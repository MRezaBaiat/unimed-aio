import AppNavigator from '../../navigation/AppNavigator';
import { handleStateChange } from './actions';
import P2PRoom from '../../screens/video_call/v3/P2PRoom';
import Analytics from '../../analytics/analytics';
import { CallAnalytics } from 'api';

export const ACTION_SET_CALL_CONNECTION = 'ACTION_SET_CALL_CONNECTION';

export const actionSetCallConnection = (connection: P2PRoom | undefined) => {
  return {
    type: ACTION_SET_CALL_CONNECTION,
    payload: connection,
  };
};

export const actionClearCall = (isFromOtherSide = false) => {
  return (dispatch, getState) => {
    const activeCall = getState().callReducer.activeCall;
    if (activeCall) {
      Analytics.send(new CallAnalytics.CallClosed(activeCall.connection.session.id, { reason: 'call cleared in redux', isFromOtherSide }));
      activeCall.connection.shutDown(isFromOtherSide);
      dispatch(actionSetCallConnection(undefined));
      dispatch(handleStateChange());
    }
  };
};
