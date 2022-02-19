import React from 'react';
import LottieView from 'lottie-react-native';

interface Props {
  animation: any;
  width: number;
  height: number;
  style?: any;
  loop?: boolean;
}
function AppLottieView(props: Props) {
  const { animation, style, height, width, loop } = props;
  return <LottieView style={{ ...style, width, height }} source={animation} autoPlay={true} loop={loop} />;
}

export default React.memo(AppLottieView);
