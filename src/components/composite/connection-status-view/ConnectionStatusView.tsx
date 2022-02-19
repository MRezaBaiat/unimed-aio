import React, { useEffect, useState } from 'react';
import AppView from '../../base/app-view/AppView';
import ChatService from '../../../services/ChatService';
import { useSelector } from 'react-redux';
import AppTextView from '../../base/app-text-view/AppTextView';
import { ActivityIndicator } from 'react-native';
import AppActivityIndicator from '../../base/app-activity-indicator/AppActivityIndicator';
import AuthService from '../../../services/AuthService';
import { useIsFocused } from '@react-navigation/native';
import dictionary from '../../../assets/strings/dictionary';

function ConnectionStatusView(props) {
  const { children, enabled } = props;
  const [state, setState] = useState(ChatService.getState());
  const authorization = useSelector((s) => s.authReducer.authorization);
  const focused = useIsFocused();

  useEffect(() => {
    if (authorization) {
      ChatService.connect();
    } else {
      ChatService.disconnect();
    }
  }, [authorization]);

  useEffect(() => {
    if (enabled && focused) {
      setState(ChatService.getState());
    }
  }, [focused]);

  useEffect(() => {
    const cb = (state) => {
      setState(state);
    };
    ChatService.addListener(cb);
    return () => {
      ChatService.removeListener(cb);
    };
  }, []);

  return (
    <>
      {(state === 'disconnected' || state === 'reconnecting') && enabled && AuthService.isAuthenticated() && ChatService.connectionAllowed() && renderNotConnected(state === 'reconnecting')}
      {children}
    </>
  );
}

const renderNotConnected = (reconnecting: boolean) => {
  return (
    <AppView style={{ width: '100%', minHeight: 30, zIndex: Number.MAX_SAFE_INTEGER, position: 'relative', top: 0, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}>
      <AppTextView textColor={'white'} text={dictionary.error_accessing_server} />
      {reconnecting && <AppActivityIndicator style={{ marginRight: 7 }} />}
    </AppView>
  );
};

export default React.memo(ConnectionStatusView);
