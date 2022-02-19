import React, { useEffect, useRef, useState } from 'react';
import { hp, wp } from '../../helpers/responsive-screen';
import R from '../../assets/R';
import AppView from '../../components/base/app-view/AppView';
import { Animated } from 'react-native';
import AppLottieView from '../../components/base/app-lottieview/AppLottieView';

function SplashAnim({ onEnd }) {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      onEnd();
    });
  }, [fadeIn]);

  return (
    <AppView style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <AppLottieView animation={R.animations.logo_anim} width={hp(30)} height={hp(30)} style={{ alignSelf: 'center' }} loop={false} />
      <Animated.Image
        style={{
          position: 'absolute',
          bottom: 80,
          width: wp(32),
          height: (wp(32) * 70) / 100,
          opacity: fadeIn,
        }}
        resizeMode="contain"
        source={R.images.enlogo}
      />
    </AppView>
  );
}

export default React.memo(SplashAnim);
