import * as actions from '../actions/actions';
import { ACTION_SET_PIP, ACTION_SET_VERSION } from '../actions/actions';

export interface InitialState {
  version: string | undefined;
  pip: { render: () => JSX.Element } | undefined;
}

const initialState: InitialState = {
  version: undefined,
  pip: undefined,
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case ACTION_SET_VERSION:
      return {
        ...state,
        version: action.payload,
      };
    case ACTION_SET_PIP:
      return {
        ...state,
        pip: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
