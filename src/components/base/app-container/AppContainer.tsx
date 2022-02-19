import React from 'react';
import { SafeAreaView, SafeAreaProvider, SafeAreaInsetsContext, useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, useWindowDimensions } from 'react-native';
import { safeAssignStyles } from '../../../helpers';
import { screenHeight, screenWidth } from '../../../helpers/responsive-screen';
import ConnectionStatusView from '../../composite/connection-status-view/ConnectionStatusView';

type Props = {
  backgroundImage?: number;
  style?: any;
  children?: any;
  scrollable?: boolean;
  behavior?: 'height' | 'position' | 'padding';
  enabled?: boolean;
  keyboardVerticalOffset: number;
  connectionStatus?: boolean;
};
function AppContainer(props: Props) {
  const { children, style, behavior, enabled, connectionStatus } = props;
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      enabled={enabled}
      style={safeAssignStyles({
        width: Platform.OS === 'web' ? screenWidth : '100%',
        height: Platform.OS === 'web' ? screenHeight : '100%',
      })}
    >
      <SafeAreaView
        mode={'padding'}
        style={safeAssignStyles(
          {
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            flexDirection: 'column',
          },
          style
        )}
      >
        <ConnectionStatusView enabled={connectionStatus}>{scrollHOC(props, children)}</ConnectionStatusView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
AppContainer.defaultProps = {
  scrollable: false,
  keyboardVerticalOffset: undefined,
  enabled: true,
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  connectionStatus: true,
};

export default React.memo(AppContainer);

const scrollHOC = (props, children) => {
  if (!props.scrollable) {
    return children;
  }
  return <ScrollView style={{ width: '100%', height: '100%' }}>{children}</ScrollView>;
};
