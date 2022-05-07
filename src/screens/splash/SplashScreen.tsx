import React, { useEffect, useLayoutEffect, useState } from 'react';
import AuthService from '../../services/AuthService';
import { StatusBar } from 'react-native';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppNavigator from '../../navigation/AppNavigator';
import { preloadAll } from '../../navigation/Routes';
import ChatService from '../../services/ChatService';
import AppImageView from '../../components/base/app-image/app-imageview';
import { hp } from '../../helpers/responsive-screen';
import AppView from '../../components/base/app-view/AppView';
import images from '../../assets/images/images';

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

    setTimeout(() => {
      ChatService.allowConnect();
      setAnimationEnded(true);
    }, 3000);
  }, []);

  return (
    <AppContainer connectionStatus={animationEnded} style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 0 }}>
      <StatusBar hidden />
      <AppView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <AppImageView src={images.arm} style={{ width: hp(30), height: hp(50) }} />
      </AppView>
      {/*<SplashAnim
        onEnd={() => {
          ChatService.allowConnect();
          setAnimationEnded(true);
        }}
      />*/}
    </AppContainer>
  );
}

export default React.memo(SplashScreen);
