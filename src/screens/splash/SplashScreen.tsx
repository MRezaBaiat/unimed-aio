import React, { useEffect, useLayoutEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
import { Platform, StatusBar } from 'react-native';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppNavigator from '../../navigation/AppNavigator';
import SplashAnim from './splash-anim';
import { preloadAll } from '../../navigation/Routes';
import ChatService from '../../services/ChatService';

function SplashScreen() {
  const [loaded, setLoaded] = useState(true);
  const [animationEnded, setAnimationEnded] = useState(false);

  useLayoutEffect(() => {
    if (loaded && animationEnded) {
      AppNavigator.resetStackTo(AuthService.isAuthenticated() ? 'MainScreen' : 'SigninScreen');
    }
  }, [loaded, animationEnded]);

  useEffect(() => {
    preloadAll().then(() => {
      setLoaded(true);
    });
  }, []);

  return (
    <AppContainer connectionStatus={animationEnded} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 0 }}>
      <StatusBar hidden />
      <SplashAnim
        onEnd={() => {
          ChatService.allowConnect();
          setAnimationEnded(true);
          /* if (Platform.OS === 'web') {
              ChatService.allowConnect();
              setAnimationEnded(true);
            } else {
              AppNavigator.navigateTo('TestScreen');
            } */
        }}
      />
    </AppContainer>
  );
}

export default React.memo(SplashScreen);
