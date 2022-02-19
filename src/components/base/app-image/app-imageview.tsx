import React, { useEffect, useState } from 'react';
import R from '../../../assets/R';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { generateImageSource } from './index';
import { safeAssignStyles } from '../../../helpers';
import Styles from '../../../helpers/Styles';

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
  const { defaultImage, opacity, resizeMode, src, hasDefaultImage } = props;
  const { aspectRatio = 1, ...inputStyle } = StyleSheet.flatten(props.style) || {};

  const getStyles = () => {
    return safeAssignStyles({ ...inputStyle, ...Styles.nonSelectable }, { aspectRatio, opacity });
  };

  const [showDefaultImage, setShowDefaultImage] = useState(false);
  const [layout, setLayout] = React.useState(null as any);
  const [styles, setStyles] = useState(getStyles() as any);

  useEffect(() => {
    if (!src && hasDefaultImage) {
      setShowDefaultImage(true);
    } else {
      setShowDefaultImage(false);
    }
  }, [src, hasDefaultImage]);

  useEffect(() => {
    setStyles(getStyles());
  }, [props.style]);

  /* useEffect(() => {
    console.log('layout change');
    if (layout) {
      const { width = 0, height = 0 } = layout;
      if (width === 0 || height === 0) {
        const mStyles = { ...styles };
        if (width === 0) {
          mStyles.height = height;
          mStyles.width = height * aspectRatio;
        } else if (height === 0) {
          mStyles.height = width * aspectRatio;
          mStyles.width = width;
        }
        setStyles(mStyles);
      }
    }
  }, [layout]); */

  /* useEffect(() => {
    console.log('layout change')
    if (layout && (layout.width === 0 || layout.height === 0)) {
      console.log('changed')
      const mStyles = { ...styles };
      const { width = 0, height = 0 } = layout;
      if (width === 0) {
        mStyles.height = height;
        mStyles.width = height * aspectRatio;
      } else if (height === 0) {
        mStyles.height = width * aspectRatio;
        mStyles.width = width;
      }
      setStyles(mStyles);
      setAllowLayout(false);
    }
  }, [styles, layout]); */

  return (
    <Image
      {...props}
      style={styles}
      resizeMode={resizeMode}
      onClick={undefined}
      onPress={undefined}
      source={generateImageSource(src, showDefaultImage && defaultImage, 'force-cache')}
      /* onLayout={({ nativeEvent: { layout } }) => (layout.width === 0 || layout.height === 0) && setLayout(layout)} */
    />
  );
}

AppImageView.defaultProps = {
  defaultImage: R.images.user_empty_view,
  hasDefaultImage: true,
  resizeMode: 'stretch',
  opacity: 1.0,
};

export default React.memo(AppImageView);
