import AppNavigator from '../../navigation/AppNavigator';
import { actionClearCall } from './call_actions';
import { store } from '../Store';
import { actionSetConversation } from './chat_actions';
import { setQueue } from './queue_actions';
import { VisitStatus } from 'api';
import FileSystem from '../../cache/file-system/FileSystem';

export const ACTION_SET_VERSION = 'ACTION_SET_VERSION';
export const ACTION_SET_PIP = 'ACTION_SET_PIP';

export const actionSetPictureInPicture = (config?: { render: () => JSX.Element }) => {
  return {
    type: ACTION_SET_PIP,
    payload: config,
  };
};

export const setVersion = (version: string) => {
  return {
    type: ACTION_SET_VERSION,
    payload: version,
  };
};

export const handleStateChange = () => {
  return (dispatch, getState) => {
    const status = getState().userReducer.status;
    const activeCall = getState().callReducer.activeCall;
    if (status.visit && status.visit.state === VisitStatus.STARTED) {
      if (AppNavigator.getTopScreen() !== 'ChatScreen' && AppNavigator.getTopScreen() !== 'CallScreen') {
        AppNavigator.resetStackTo('ChatScreen');
      }
    } else {
      if (AppNavigator.getTopScreen() === 'ChatScreen' || AppNavigator.getTopScreen() === 'CallScreen') {
        AppNavigator.resetStackTo('MainScreen');
        store.dispatch(actionSetConversation([]));
        store.dispatch(setQueue(undefined, undefined));
      }
      FileSystem.getFileSystem(false).purge();
    }
    if (activeCall && !status.visit) {
      store.dispatch(actionClearCall());
    }
  };
};
