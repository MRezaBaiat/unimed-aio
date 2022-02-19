import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppRCTView from '../views/rct-view/AppRCTView';
import P2PRoom from '../v3/P2PRoom';
import P2PPeer from '../v3/P2PPeer';
import AppGestureView from '../../../components/base/app-gesture-view/AppGestureView';
import AppNavigator from '../../../navigation/AppNavigator';
import { safeAssignStyles } from '../../../helpers';
import { ConferenceType } from 'api';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import useActiveCall from '../../../hooks/useActiveCall';

interface Props {
  style: ViewStyle;
  pip?: boolean;
}
function RemoteView({ pip, style }: Props) {
  const connection = useActiveCall() as P2PRoom;
  const [stream, setStream] = useState(undefined as MediaStream | undefined);
  const [pos, setPos] = useState<{ bottom?: number; top?: number; left?: number; right?: number }>({ bottom: hp(10), right: wp(5), top: undefined, left: undefined });
  const [size, setSize] = useState({ width: 1, height: 1 });
  const dateRef = useRef<{ startTime: number }>({ startTime: 0 }).current;

  // const focused = useIsFocused();

  useEffect(() => {
    const streamListener = (stream: MediaStream) => {
      setStream(stream);
    };
    const peersListener = (peers: (P2PPeer)[]) => {
      peers[0] && peers[0].getPeerRemoteStream().addListener(streamListener);
    };
    connection.addListener(peersListener);
    return () => {
      connection.removeListener(peersListener);
      connection.getPeers()[0] && connection.getPeers()[0].getPeerRemoteStream().removeListener(streamListener);
    };
  }, []);

  if (connection && connection.type === ConferenceType.audio) {
    return <AppRCTView type={connection.type} zIndex={0} src={stream} objectFit={'cover'} style={{ ...style, width: 1, height: 1 }} />;
  }

  return pip ? (
    <AppGestureView
      onLayout={({ nativeEvent }) => {
        setSize({ width: nativeEvent.layout.width, height: nativeEvent.layout.height });
      }}
      onClick={() => pip && Platform.OS === 'web' && connection && !connection.isDestroyed && AppNavigator.navigateTo('CallScreen')}
      onTouchMove={(x, y) => {
        setPos({ left: x - size.width / 2, top: y - size.height / 2 });
      }}
      onTouchStart={() => {
        if (Platform.OS !== 'web') {
          dateRef.startTime = Date.now();
        }
      }}
      onTouchEnd={() => {
        if (Platform.OS !== 'web') {
          if (Date.now() - dateRef.startTime <= 100) {
            AppNavigator.navigateTo('CallScreen');
          }
        }
      }}
      style={safeAssignStyles({
        position: 'absolute',
        display: connection && connection.type === 'audio' ? 'none' : undefined,
        zIndex: Number.MAX_SAFE_INTEGER,
        width: wp(20),
        height: wp(30),
        minWidth: 100,
        minHeight: 150,
        bottom: pos.bottom,
        right: pos.right,
        left: pos.left,
        top: pos.top,
      })}
    >
      <AppRCTView type={connection.type} zIndex={0} src={stream} objectFit={'cover'} style={style} />
    </AppGestureView>
  ) : (
    <AppRCTView type={connection.type} zIndex={0} src={stream} objectFit={'cover'} style={style} />
  );
}

export default React.memo(RemoteView);
