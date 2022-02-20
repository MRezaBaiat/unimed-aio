import IO, { ManagerOptions } from 'socket.io-client';
import AuthService from './AuthService';
import { EventType, SendStatus, TypingStatus, DebugType, Chat, DoctorStatus, PatientStatus, Visit, CallAnalytics, CallMetricsEvent, Conference } from 'api';
import { store } from '../redux/Store';
import { actionSetFinalizableVisits, actionSetStatus } from '../redux/actions/users_actions';
import { actionChatReceived, actionSendStatusChanged, actionSetConversation, actionSetTypingStatus } from '../redux/actions/chat_actions';
import { setQueue } from '../redux/actions/queue_actions';
import CallApi from '../network/CallApi';
import { AppState, Platform } from 'react-native';
import PushNotificationService from './PushNotificationService';
import NetUtils from '../helpers/NetUtils';
import Kit from 'javascript-dev-kit';
import AppNavigator from '../navigation/AppNavigator';
import { actionClearCall, actionSetCallConnection } from '../redux/actions/call_actions';
import { videoCallVersion } from '../config/config';
import AppPermissions from '../helpers/AppPermissions';
import P2PRoom from '../screens/video_call/v3/P2PRoom';
import { getDeviceInfo, openURL } from '../helpers';
import analytics from '../analytics/analytics';
import { SocketOptions } from 'socket.io-client/build/esm/socket';
type SocketState = 'disconnected' | 'connected' | 'reconnecting';

const TAG = '[socket-service]';
const stateCache = {
  typeStatusThreshold: 1000,
  lastTypeStatusDate: 0,
  state: 'disconnected' as SocketState,
  firstConnection: true,
  connectionAllowed: false,
};
const getState = () => stateCache.state;
const canConnect = () => AuthService.isAuthenticated() && isForeground() && NetUtils.isConnected() && stateCache.connectionAllowed;
const setState = (state: SocketState, error?: any) => {
  error && console.warn(TAG, error);
  const oldState = stateCache.state;
  stateCache.state = state;
  console.log(TAG, `state change [${oldState}] => [${state}] = ` + socket.id);

  if (oldState !== state) {
    listeners.forEach((cb) => cb(stateCache.state));
  }
  stateCache.firstConnection = false;

  switch (state) {
    case 'connected':
      break;
    case 'disconnected':
      if (canConnect()) {
        connect();
      }
      break;
    case 'reconnecting':
      break;
  }
};
const config: Partial<ManagerOptions & SocketOptions> = {
  path: '/live',
  transports: ['websocket'],
  reconnection: false,
  forceNew: false,
  autoConnect: false,
  timeout: 5000,
  secure: true,
  query: {
    videoCallVersion: videoCallVersion,
  },
  extraHeaders: {
    videoCallVersion: videoCallVersion,
  },
};

export const socket = IO('https://www.azdanaz.az', config);
socket.io.on('packet', (packet) => packet /* && console.log(TAG, 'packet', packet.data) */);
socket.io.on('open', () => {
  console.log(TAG, 'connection opened');
  setState('reconnecting');
});
socket.io.on('close', (...args) => {
  console.log(TAG, 'connection closed', args);
  setState('disconnected');
});
socket
  .on('connect', () => setState('reconnecting'))
  .on('authenticated', () => setState('connected'))
  .on('connecting', () => setState('reconnecting'))
  .on('connect_error', (err) => setState('disconnected', err))
  .on('reconnect', () => setState('connected'))
  .on('connect_timeout', (err) => setState('disconnected', err))
  .on('error', (err) => setState('disconnected', err))
  .on('disconnect', (reason) => setState('disconnected'))
  .on('unauthorized', (msg) => {
    setState('disconnected');
    throw new Error(msg.data.type);
  })
  .on('typing_status', (roomId, { visitId, status }) => {
    const visit = store.getState().userReducer.status.visit;
    if (!visit || visitId !== visit._id) {
      return;
    }
    store.dispatch(actionSetTypingStatus(status));
  })
  .on('finalizable_visits', (roomId: string, visits: Visit[]) => {
    store.dispatch(actionSetFinalizableVisits(visits));
  })
  .on('queue_update', (roomId: string, queue: { queue: number; estimated: number }) => {
    setTimeout(() => {
      store.dispatch(setQueue(queue.queue, queue.estimated));
    }, 2000);
  })
  .on('exchange-sdp', (roomId: string, data) => {
    try {
      const activeCall = store.getState().callReducer.activeCall;
      if (!activeCall || data.offerId !== activeCall.connection.session.id) {
        console.log('no active call');
        CallApi.endCall(data.offerId);
        return;
      }
      activeCall.connection.onSDP(data);
    } catch (e) {
      console.error(e);
    }
  })
  .on(EventType.EVENT_CALL_REQUEST, async (roomId: string, offer: Conference) => {
    const activeCall = store.getState().callReducer.activeCall;
    if (activeCall || AppNavigator.getTopScreen() === 'CallScreen') {
      CallApi.declineCall(offer, 'طرف مقابل شما اشغال است');
    } else {
      if (offer.type === 'audio' && (await AppPermissions.isMicrophoneBlocked())) {
        return CallApi.declineCall(offer, 'طرف مقابل شما اجازه های لازم را برای برقراری این تماس نداده است').finally(() => {
          AppPermissions.alertNoPermission(true);
        });
      } else if (offer.type === 'video/audio' && (await AppPermissions.isCameraOrMicrophoneBlocked())) {
        return CallApi.declineCall(offer, 'طرف مقابل شما اجازه های لازم را برای برقراری این تماس نداده است').finally(() => {
          AppPermissions.alertNoPermission(true);
        });
      }
      // if (Platform.OS !== 'web') {
      // openURL('unimed://call');
      // }
      analytics.send(new CallAnalytics.AbstractCallMetric(offer.id, CallMetricsEvent.REQUEST_RECEIVED));
      store.dispatch(actionSetCallConnection(new P2PRoom(offer)));
      AppNavigator.navigateTo('CallScreen');
    }
  })
  .on(EventType.EVENT_CALL_ACCEPTED, (roomId: string, offer: Conference) => {
    const activeCall = store.getState().callReducer.activeCall;
    if (activeCall && activeCall.connection.session.id === offer.id && activeCall.connection.session.state !== 'transmitting') {
      const connection = activeCall.connection;
      connection.session.state = 'transmitting';
      store.dispatch(actionSetCallConnection(connection));
    }
  })
  .on(EventType.EVENT_CALL_DECLINED, (roomId: string, data: { id: string; reason: string }) => {
    if (typeof data === 'string') {
      // ignore this , another packet will be received , this is a solution for older versions, will be removed later
      return;
    }
    const activeCall = store.getState().callReducer.activeCall;
    if (activeCall && activeCall.connection.session.id === data.id) {
      store.dispatch(actionClearCall(true));
      if (data.reason) {
        alert(data.reason);
      }
    }
  })
  .on(EventType.EVENT_CALL_ENDED, (roomId: string, id: string) => {
    const activeCall = store.getState().callReducer.activeCall;
    if (activeCall && activeCall.connection.session.id === id) {
      store.dispatch(actionClearCall(true));
    }
  })
  .on('message', (senderId: string, roomId: string, chat: Chat) => {
    console.log('sender', senderId);
    console.log('room', roomId);
    console.log('chat', chat);
    store.dispatch(actionChatReceived(chat));
  })
  .on('display_text', (roomId: string, text: string) => {
    alert(text);
  })
  .on('exit', () => {
    AuthService.logOut();
    AppNavigator.resetStackTo('SplashScreen');
    disconnect();
  })
  .on(EventType.EVENT_STATUS_UPDATE, (roomId: string, status: PatientStatus | DoctorStatus) => {
    store.dispatch(actionSetStatus(status));
  })
  .on('conversations', (roomId: string, conversations: Chat[]) => {
    store.dispatch(actionSetConversation(conversations));
  })
  .on(DebugType.remote_logs, (roomId, { enabled }) => {
    debuggingEnabled = enabled;

    if (enabled) {
      logMethods.forEach((method) => {
        console[method] = function () {
          if (debuggingEnabled) {
            // eslint-disable-next-line prefer-rest-params
            emitDebug(method, [...arguments]);
          }
          // eslint-disable-next-line prefer-rest-params
          origins[method](...arguments);
        };
      });
      getDeviceInfo().then((i) => console.info('device-info', i));
      // consolere.ready(() => {});
    } else {
      logMethods.forEach((method) => {
        console[method] = origins[method];
      });
    }
  });

const emitDebug = (mode: string, data: any[]) => {
  if (debuggingEnabled) {
    // console.re && console.re[mode](...data);
    socket.emit(DebugType.remote_logs, { mode, data });
  }
};

let debuggingEnabled = false;
const logMethods = ['log', 'warn', 'error', 'info', 'debug'];
const origins = [];
logMethods.forEach((method) => {
  origins[method] = console[method];
});

const isError = (e: any) => {
  if (typeof e !== 'object') {
    return false;
  }
  const a = String(e);
  return a === '[object Error]' || a === '[object DOMException]' || (typeof e.name === 'string' && typeof e.message === 'string');
};

if (Platform.OS === 'web') {
  window.addEventListener('error', (event) => {
    if (debuggingEnabled) {
      emitDebug('error', [...Object.values(event)]);
    }
    return event;
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (debuggingEnabled) {
      const reason = event.reason;
      emitDebug('error', ['Unhandled promise rejection:', reason && (reason.stack || reason), event]);
    }
  });
}

const listeners: ((state: SocketState) => void)[] = [];

const addListener = (cb: (state: SocketState) => void) => {
  !listeners.includes(cb) && listeners.push(cb);
};

const removeListener = (cb: (state: SocketState) => void) => {
  listeners.splice(listeners.indexOf(cb), 1);
};

AppState.addEventListener('change', (state) => {
  if (state === 'active' && canConnect()) {
    console.log(TAG, 'back to foreground');
    connect();
    PushNotificationService.resetBadgeNumber();
  }
});

const isForeground = () => {
  return AppState.currentState === 'active';
};

NetUtils.addListener(() => {
  if (!isConnected() && canConnect()) {
    console.log('trying to connect due to network being back on');
    connect();
  }
});

const requestVisit = (doctorCode: string, discountCode: string) => {
  doctorCode = Kit.numbersToEnglish(doctorCode);
  discountCode = Kit.numbersToEnglish(discountCode);
  socket.emit(EventType.REQUEST_VISIT, { doctorCode, discountCode });
};

const setAvailable = (available: boolean) => {
  socket.emit(EventType.EVENT_SET_AVAILABLE, available);
};

const isConnected = () => {
  if (!NetUtils.isConnected() && socket.connected) {
    console.log(TAG, 'force disconnecting because the network was unavailable');
    socket.disconnect();
    return false;
  }
  console.log(`${NetUtils.isConnected()} && ${socket.connected} && ${!socket.disconnected}`);
  return NetUtils.isConnected() && socket.connected && !socket.disconnected;
};

const endVisitRequest = (visitId: string) => {
  try {
    socket.emit(EventType.REQUEST_END_VISIT, visitId);
  } catch (error) {
    console.log(error);
  }
  socket.emit(EventType.REQUEST_END_VISIT, visitId);
};

const acceptVisit = (visitId: string) => {
  socket.emit(EventType.VISIT_REQUEST_ACCEPTED, visitId);
};

const sendMessage = (chat: Chat, roomId: string) => {
  socket.send(roomId, chat, (err, success) => {
    store.dispatch(actionSendStatusChanged(chat.id, err ? SendStatus.FAILED : SendStatus.SENT));
  });
};

const sendTypingStatus = (status: TypingStatus) => {
  if (stateCache.lastTypeStatusDate === 0 || Date.now() - stateCache.lastTypeStatusDate >= stateCache.typeStatusThreshold) {
    const visit = store.getState().userReducer.status.visit;
    console.log(Date.now() - stateCache.lastTypeStatusDate);
    console.log('sending typing status : ' + status);
    socket.emit('typing_status', { visitId: visit ? visit._id : undefined, status });
    stateCache.lastTypeStatusDate = Date.now();
  }
};

const acceptCall = (session: Conference) => {
  socket.emit(EventType.EVENT_CALL_ACCEPTED, session);
};

const setLanguage = (lang: string) => {
  if (socket && socket.connected) {
    socket.emit('set-language', lang);
  }
};

const disconnect = () => {
  socket.disconnect();
};

const allowConnect = () => {
  stateCache.connectionAllowed = true;
  connect();
};

const connectionAllowed = () => {
  return stateCache.connectionAllowed;
};

const connect = () => {
  if (isConnected() || !canConnect()) {
    return;
  }
  console.log(TAG, 'trying to connect, already connected? ' + isConnected() + ', can connect ? ' + canConnect());
  setState('reconnecting');
  // @ts-ignore
  config.query.authorization = AuthService.getAuthorization().split('Bearer ')[1];
  socket.connect();
};

export default {
  connect,
  setLanguage,
  setAvailable,
  endVisitRequest,
  acceptVisit,
  sendMessage,
  acceptCall,
  requestVisit,
  sendTypingStatus,
  disconnect,
  isConnected,
  addListener,
  removeListener,
  getState,
  canConnect,
  allowConnect,
  connectionAllowed,
  socket,
};
