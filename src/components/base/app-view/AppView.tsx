import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

export interface Props extends ViewProps {
  ref?: (ref: any) => void;
  children?: any;
  style?: StyleProp<ViewStyle>;
}
function AppView(props: Props) {
  return <View {...props}>{props.children}</View>;
}

export default React.memo(AppView);
