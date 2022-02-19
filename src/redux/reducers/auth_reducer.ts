import * as actions from '../actions/auth_actions';

export interface InitialState {
  authorization: string;
  updateInfo: {
    available: boolean;
  };
}

const initialState: InitialState = {
  authorization: null as any,
  updateInfo: {
    available: false,
  },
};

const authReducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actions.ACTION_LOG_OUT:
      return {
        ...state,
        authorization: null,
      };

    case actions.ACTION_SET_AUTH:
      return {
        ...state,
        authorization: action.payload,
      };

    case actions.ACTION_SET_UPDATE_INFO:
      return {
        ...state,
        updateInfo: {
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default authReducer;
