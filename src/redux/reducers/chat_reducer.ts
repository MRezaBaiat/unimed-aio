import * as actions from '../actions/chat_actions';
import { TypingStatus, Chat } from 'api';

export interface InitialState {
  chats: Chat[];
  typingStatusExpirationTimerId: number;
  typingStatus: TypingStatus;
}

const initialState: InitialState = {
  chats: [],
  typingStatusExpirationTimerId: 0,
  typingStatus: TypingStatus.IDLE,
};

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case actions.ACTION_NEW_MESSAGE:
      return {
        ...state,
        chats: [...state.chats, action.payload],
      };
    case actions.ACTION_SET_CONVERSATIONS:
      return {
        ...state,
        chats: action.payload,
      };
    case actions.ACTION_SET_TYPING_STATUS_EXPIRATION_TIMER_ID:
      return {
        ...state,
        typingStatusExpirationTimerId: action.payload,
      };
    case actions.ACTION_SET_TYPING_STATUS:
      return {
        ...state,
        typingStatus: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
