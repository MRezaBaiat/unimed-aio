import React from 'react';
import LottieView from 'react-lottie';

interface Props {
  animation: any;
  width: number | string;
  height: number | string;
  style?: any;
  loop?: boolean;
}
function AppLottieView(props: Props) {
  const { animation, style, height, width, loop } = props;
  return (
    <LottieView
      options={{
        loop: loop || false,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
      width={width}
      height={height}
      style={style}
    />
  );
}

export default React.memo(AppLottieView);
