import React, { useState } from 'react';
import { safeAssignStyles } from '../../../helpers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LayoutChangeEvent, NativeTouchEvent, Pressable, StyleProp, ViewStyle } from 'react-native';

const TAG = '[gesture]';
interface Props {
  onTouchMove?: (x: number, y: number, event: NativeTouchEvent) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  children?: any;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
  innerRef?: any;
  onLayout?: (event: LayoutChangeEvent) => void;
}
function AppGestureView(props: Props) {
  // return isMobileBrowser() ? <MobileBrowserView {...props}/> : <DesktopBrowserView {...props}/>;
  return <DesktopBrowserView {...props} />;
}

function MobileBrowserView(props: Props) {
  const { onTouchEnd, onTouchMove, children, onTouchStart, style } = props;

  return (
    <Pressable
      style={style}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      /* onTouchMove={(event) => {
        console.log(TAG,'move 1');
        onTouchMove && onTouchMove(event.nativeEvent.touches[0].pageX, event.nativeEvent.touches[0].pageY);
      }} */
      onMoveShouldSetResponder={() => {
        return true;
      }}
      onMoveShouldSetResponderCapture={() => {
        return true;
      }}
      onResponderMove={(event) => {
        onTouchMove && onTouchMove(event.nativeEvent.touches[0].pageX, event.nativeEvent.touches[0].pageY, event.nativeEvent);
      }}
      delayLongPress={Number.MAX_SAFE_INTEGER}
    >
      {children}
    </Pressable>
  );
}

function DesktopBrowserView(props: Props) {
  const { onTouchEnd, onTouchMove, children, onTouchStart, style, onClick, innerRef } = props;
  const [moved, setMoved] = useState(false);
  const [ended, setEnded] = useState(true);
  // const [pressed,set]
  return (
    <GestureHandlerRootView
      ref={(r) => {
        innerRef && innerRef(r);
      }}
      onLayout={props.onLayout}
      style={safeAssignStyles(style, {
        // @ts-ignore
        cursor: 'pointer',
      })}
      /* onTouchMove={() => {
        console.log(TAG, 'move 1');
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd} */
      onMoveShouldSetResponder={() => {
        return true;
      }}
      onMoveShouldSetResponderCapture={() => {
        return true;
      }}
      onStartShouldSetResponder={() => {
        return true;
      }}
      onStartShouldSetResponderCapture={() => {
        return true;
      }}
      onTouchEndCapture={(e) => {
        // @ts-ignore
        !ended && onTouchEnd && onTouchEnd(e);
        setEnded(true);
      }}
      onResponderStart={(e) => {
        setEnded(false);
        onClick && setMoved(false);
        // @ts-ignore
        onTouchStart && onTouchStart(e);
      }}
      onResponderEnd={(e) => {
        !ended && onClick && !moved && onClick();
        // @ts-ignore
        !ended && onTouchEnd && onTouchEnd(e);
        setEnded(true);
      }}
      onResponderMove={(event) => {
        setMoved(true);
        onTouchMove && onTouchMove(event.nativeEvent.touches[0].pageX, event.nativeEvent.touches[0].pageY, event.nativeEvent);
      }}
    >
      {children}
    </GestureHandlerRootView>
  );
}

export default React.memo(AppGestureView);
