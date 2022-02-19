import * as actions from '../actions/call_actions';
import P2PRoom from '../../screens/video_call/v3/P2PRoom';

export interface InitialState {
  activeCall?: {
    connection: P2PRoom;
  };
}

const initialState: InitialState = {
  activeCall: undefined,
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actions.ACTION_SET_CALL_CONNECTION:
      return {
        activeCall: action.payload
          ? {
              connection: action.payload,
            }
          : undefined,
      };
    default:
      return state;
  }
};

export default reducer;
