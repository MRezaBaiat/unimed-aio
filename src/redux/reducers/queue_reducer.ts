import * as actions from '../actions/queue_actions';

export interface InitialState {
  queue: number | undefined;
  estimated: number | undefined;
}

const initialState: InitialState = {
  queue: undefined,
  estimated: undefined,
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actions.ACTION_SET_QUEUE:
      return {
        ...state,
        queue: action.payload.queue,
        estimated: action.payload.estimated,
      };
    default:
      return state;
  }
};

export default reducer;
