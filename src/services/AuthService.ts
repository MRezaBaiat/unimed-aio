import axios, { AxiosResponse } from 'axios';
import { store } from '../redux/Store';
import { actionLogOut, actionSetAuthorization, actionSetUpdateinfo } from '../redux/actions/auth_actions';
import { User } from 'api';
import Storage from '../helpers/Storage';
import Gateway, { ResponseType } from '../network/Gateway';
import { actionSetUser } from '../redux/actions/users_actions';
import PushNotificationService from './PushNotificationService';
import { Platform } from 'react-native';
import Kit from 'javascript-dev-kit';
import ChatService from './ChatService';
/* import AppCenter, {CustomProperties} from 'appcenter'; */

const setAuthorization = (auth: string | null) => {
  if (auth) {
    Storage.set('authorization', auth);
  } else {
    Storage.remove('authorization');
  }
  return store.dispatch(actionSetAuthorization(auth));
};

const setUser = (user: User | null) => {
  if (user) {
    Storage.set('user', JSON.stringify(user));
    /* AppCenter.setUserId(user._id);
    AppCenter.setCustomProperties(
        new CustomProperties()
            .set('user-type',user.type)
    ); */
  } else {
    Storage.remove('user');
    /* AppCenter.setUserId(null);
    AppCenter.setCustomProperties(
        new CustomProperties()
            .clear('user-type')
    ); */
  }
  return store.dispatch(actionSetUser(user));
};

const setUpdateInfo = (updateInfo: any) => {
  return store.dispatch(actionSetUpdateinfo(updateInfo));
};

const getAuthorization = (): string => {
  return store.getState().authReducer.authorization || Storage.get('authorization');
};

const isAuthenticated = () => {
  return Boolean(getAuthorization());
};

const initialize = async () => {
  if (!isAuthenticated()) {
    setUser(null);
    return;
  }
  const auth = await Storage.get('authorization');
  const user = JSON.parse(Storage.get('user'));
  setAuthorization(auth);
  setUser(user);
  axios.defaults.headers.common.authorization = auth;
  console.log(auth);
  console.log('renewing auth');
  return renewAuth().catch((err) => {
    console.log('error at renewing auth');
  });
};

const logOut = () => {
  axios.defaults.headers.common.authorization = null;
  setAuthorization(null);
  setUser(null);
  PushNotificationService.unsubscribeFromTopics();
  store.dispatch(actionLogOut());
  ChatService.disconnect();
};

/* const sendRegisterOTP = (otp: string): ResponseType<void> => {
  otp = numbersToEnglish(otp);
  return Gateway.post('/api/users/signup/otp', { otp }).then((res) => {
    const { user, token } = res.data;
    axios.defaults.headers.common.authorization = 'Bearer ' + token;
    setAuthorization('Bearer ' + token);
    setUser(user);
    return null;
  });
};

const signUp = async (user: User): ResponseType<void> => {
  return Gateway.post('/api/users/signup', user);
}; */

const signIn = (mobile: string): ResponseType<void> => {
  mobile = Kit.numbersToEnglish(mobile);
  return Gateway.post('/api/users/signin', { mobile });
};

const renewAuth = async (): Promise<void> => {
  if (!isAuthenticated()) {
    return;
  }
  const fcmToken = await PushNotificationService.getRegistrationToken();
  // const version = VersionCheck.getCurrentVersion();
  // const build = VersionCheck.getCurrentBuildNumber();
  return Gateway.post<any>('/api/users/signin/renew', {}, { fcmToken, os: Platform.OS, version: store.getState().global.version }).then((res) => {
    const { user, token, updateInfo } = res.data;
    axios.defaults.headers.common.authorization = 'Bearer ' + token;
    setAuthorization('Bearer ' + token);
    setUser(user);
    setUpdateInfo(updateInfo);
  });
};

const sendLoginOTP = async (otp: string): Promise<null | AxiosResponse<void>> => {
  otp = Kit.numbersToEnglish(otp);
  const fcmtoken = await PushNotificationService.getRegistrationToken();
  // const version = VersionCheck.getCurrentVersion();
  // const build = VersionCheck.getCurrentBuildNumber();
  return Gateway.post<any>('/api/users/signin/otp', { otp, fcmtoken, os: Platform.OS, version: store.getState().global.version }).then((res) => {
    const { user, token, updateInfo } = res.data;
    axios.defaults.headers.common.authorization = 'Bearer ' + token;
    setAuthorization('Bearer ' + token);
    setUser(user);
    setUpdateInfo(updateInfo);
    PushNotificationService.subscribeToTopics();
    return null;
  });
};

export default {
  signIn,
  logOut,
  initialize,
  isAuthenticated,
  getAuthorization,
  sendLoginOTP,
  renewAuth,
  setUser,
};
