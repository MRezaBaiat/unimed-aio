import React, { useEffect } from 'react';
import { RTCView } from 'react-native-webrtc';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { CallAnalytics, ConferenceType } from 'api';
import Analytics from '../../../../analytics/analytics';

interface Props extends ViewProps {
  objectFit?: 'cover' | 'contain';
  src?: any;
  style?: ViewStyle;
  mirror?: boolean;
  muted?: boolean;
  zIndex?: number;
  type: ConferenceType;
}
function AppRCTView(props: Props) {
  const { src, objectFit, style, zIndex, mirror } = props;
  return <RTCView zOrder={zIndex} objectFit={objectFit} streamURL={src && src.toURL()} style={style} />;
}
AppRCTView.defaultProps = {
  objectFit: 'cover',
};
export default React.memo(AppRCTView);
