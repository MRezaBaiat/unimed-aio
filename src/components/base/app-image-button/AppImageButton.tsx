import React from 'react';
import { ImageStyle, ViewStyle } from 'react-native';
import AppTouchable from '../app-touchable/AppTouchable';
import AppImageView from '../app-image/app-imageview';
import { safeAssignStyles } from '../../../helpers';

interface Props {
  src: any;
  style: ImageStyle;
  onClick: () => void;
  imageStyle?: ViewStyle;
  resizeMode?: string;
}
function AppImageButton(props: Props) {
  const { src, imageStyle, style, resizeMode, onClick } = props;

  return (
    <AppTouchable {...props} style={Object.assign({ alignItems: 'center', justifyContent: 'center' }, style)}>
      <AppImageView {...props} style={safeAssignStyles({ width: style && style.width, height: style && style.height }, imageStyle)} src={src} resizeMode={resizeMode} />
    </AppTouchable>
  );
}
AppImageButton.defaultProps = {
  resizeMode: 'stretch',
  imageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default React.memo(AppImageButton);
