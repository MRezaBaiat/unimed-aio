import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from '../redux/reducers/auth_reducer';
import userReducer from '../redux/reducers/users_reducer';
import chatsReducer from '../redux/reducers/chat_reducer';
import callReducer from '../redux/reducers/call_reducer';
import queueReducer from '../redux/reducers/queue_reducer';
import reducer from '../redux/reducers/reducer';
import useFileAsset from '../helpers/file-manager';

declare module 'react-redux' {
  interface DefaultRootState {}
}

const rootReducer = combineReducers({
  global: reducer,
  authReducer: authReducer,
  userReducer: userReducer,
  chatsReducer: chatsReducer,
  callReducer: callReducer,
  queueReducer: queueReducer,
});

export default function initStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
    enhancers: [],
  });

  // adding HOT reloading capability
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept();
    /* // @ts-ignore
    module.hot.accept('../redux/reducers/auth_reducer', () => store.replaceReducer(authReducer));
    // @ts-ignore
    module.hot.accept('../redux/reducers/users_reducer', () => store.replaceReducer(userReducer));
    // @ts-ignore
    module.hot.accept('../redux/reducers/chat_reducer', () => store.replaceReducer(chatsReducer));
    // @ts-ignore
    module.hot.accept('../redux/reducers/call_reducer', () => store.replaceReducer(callReducer));
    // @ts-ignore
    module.hot.accept('../redux/reducers/queue_reducer', () => store.replaceReducer(queueReducer));
    // @ts-ignore
    module.hot.accept('../redux/reducers/reducer', () => store.replaceReducer(reducer)); */
  }

  return store;
}
