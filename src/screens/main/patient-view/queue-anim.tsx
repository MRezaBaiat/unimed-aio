import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppLottieView from '../../../components/base/app-lottieview/AppLottieView';
import R from '../../../assets/R';

function QueueAnim() {
  return <AppLottieView animation={R.animations.queue_anim} width={wp(60)} height={wp(60)} style={{ alignSelf: 'center', marginTop: hp(0.5) }} loop={true} />;
}

export default React.memo(QueueAnim);
