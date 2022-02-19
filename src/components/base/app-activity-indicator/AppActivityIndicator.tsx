import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { safeAssignStyles } from '../../../helpers';

interface Props {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: string;
}
function AppActivityIndicator(props: Props) {
  const { style } = props;
  return <ActivityIndicator {...props} color={'green'} style={safeAssignStyles(style)} />;
}

export default React.memo(AppActivityIndicator);
