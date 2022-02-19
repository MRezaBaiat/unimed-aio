import React, { useEffect, useState } from 'react';
import { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import R from '../../../assets/R';
import { generateImageSource } from './index';
import { safeAssignStyles } from '../../../helpers';

interface Props {
  src: any;
  resizeMode?: any;
  style: StyleProp<ImageStyle>;
  opacity?: number; // 0.0 : 1.0,
  blurRadius?: number;
  fadeDuration?: number;
  defaultImage?: number | string;
  hasDefaultImage?: boolean;
  headers?: { [key: string]: string };
  oval?: boolean;
  shadowSize?: number;
}
function AppImageView(props: Props) {
  const { defaultImage, opacity, resizeMode, src, style, hasDefaultImage } = props;

  const [showDefaultImage, setShowDefaultImage] = useState(false);

  useEffect(() => {
    if (!src && hasDefaultImage) {
      setShowDefaultImage(true);
    } else {
      setShowDefaultImage(false);
    }
  }, [src, hasDefaultImage]);

  /* const stateListener = (newState : SmartImageViewState) => {
      switch (newState) {
        case SmartImageViewState.DOWNLOADING:
          setShowDefaultImage(false);
          break;
        case SmartImageViewState.LOADED:
          setShowDefaultImage(false);
          break;
        case SmartImageViewState.FAILED:
          setShowDefaultImage(true);
          break;
      }
    }; */

  return <FastImage {...props} style={safeAssignStyles(style, { opacity })} resizeMode={resizeMode} source={generateImageSource(src, showDefaultImage && defaultImage, FastImage.cacheControl.immutable)} />;
}

AppImageView.defaultProps = {
  defaultImage: R.images.user_empty_view,
  hasDefaultImage: true,
  resizeMode: 'stretch',
  opacity: 1.0,
};

export default React.memo(AppImageView);
