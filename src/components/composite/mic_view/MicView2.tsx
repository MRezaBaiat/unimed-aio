import React, { useEffect, useRef, useState } from 'react';
import { View, ViewProps, StyleSheet, ViewStyle, Dimensions, Pressable } from 'react-native';
import R from '../../../assets/R';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppView from '../../base/app-view/AppView';
import AppImageView from '../../base/app-image/app-imageview';
import { hp, screenWidth, wp } from '../../../helpers/responsive-screen';
import FileAsset from '../../../helpers/file-manager/FileAsset';
import VoiceRecorderService from '../../../services/voice-recorder/VoiceRecorderService';
import Styles from '../../../helpers/Styles';
import AppGestureView from '../../base/app-gesture-view/AppGestureView';
import { safeAssignStyles } from '../../../helpers';
import AppPermissions from '../../../helpers/AppPermissions';
import dictionary from '../../../assets/strings/dictionary';

function TimerView() {
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const tid = setTimeout(() => {
      setDuration(duration + 100);
    }, 100);
    return () => {
      clearTimeout(tid);
    };
  }, [duration]);

  const minutes = parseInt(String(duration / 1000 / 60), 2);
  const seconds = parseInt(String((duration - minutes * 1000 * 60) / 1000));
  const milliseconds = String(duration - minutes * 1000 * 60 - seconds * 1000).substr(0, 2);

  return <AppTextView text={toDoubleDigits(minutes) + ':' + toDoubleDigits(seconds) + ':' + toDoubleDigits(milliseconds)} textColor={'black'} style={safeAssignStyles({ marginLeft: 10, marginRight: 'auto' }, Styles.nonSelectable)} />;
}
export interface Props extends ViewProps {
  targetId: string;
  onRecordComplete: (file: FileAsset | undefined) => void;
  size: number;
  style?: any;
}
const toDoubleDigits = (object: any) => {
  return String(object).length === 1 ? '0' + object : object;
};
function MicView2(props: Props) {
  const { onRecordComplete, size, style } = props;
  const min = style.marginRight;
  const [state, setState] = useState({ right: min, recording: false, pressed: false, cancelled: false });
  const { right, recording, pressed } = state;

  useEffect(() => {
    const newState = { ...state };
    if (newState.right <= min) {
      newState.right = min;
    } else if (newState.right >= screenWidth / 2) {
      newState.pressed = false;
      newState.recording && VoiceRecorderService.cancel();
      newState.recording = false;
      newState.cancelled = true;
    }
    if (!newState.pressed) {
      newState.right = min;
    }
    if (newState.pressed && !newState.recording) {
      newState.recording = true;
      VoiceRecorderService.startRecorder();
    }
    if (!newState.pressed && newState.recording) {
      VoiceRecorderService.save(onRecordComplete);
      newState.recording = false;
    }
    if (newState.cancelled !== state.cancelled || newState.pressed !== state.pressed || newState.recording !== state.recording || newState.right !== state.right) {
      setState(newState);
    }
  }, [right, recording, pressed]);

  return (
    <AppGestureView
      style={safeAssignStyles(
        {
          minHeight: size,
          minWidth: size,
          backgroundColor: pressed || state.cancelled ? 'white' : undefined,
          position: pressed || state.cancelled ? 'absolute' : undefined,
          width: pressed || state.cancelled ? screenWidth : size,
          /* height: '100%', */
          alignItems: pressed ? 'flex-end' : 'center',
          justifyContent: 'center',
        },
        style,
        (pressed || state.cancelled) && {
          marginLeft: 0,
        }
      )}
      onTouchStart={() => {
        if (!AppPermissions.hasMicPermission) {
          return AppPermissions.isMicrophoneBlocked().then((blocked) => {
            if (blocked) {
              AppPermissions.alertNoPermission(false);
            }
          });
        }
        setState({
          ...state,
          pressed: true,
        });
      }}
      onTouchEnd={() => {
        setState({
          ...state,
          cancelled: false,
          pressed: false,
        });
      }}
      onTouchMove={(x) => {
        if (pressed) {
          const newRight = Math.trunc(screenWidth - x - size / 2);
          pressed &&
            setState({
              ...state,
              right: newRight,
            });
          /* if (newRight !== right && newRight % 2 === 0) {
                pressed && setState({
                  ...state,
                  right: newRight
                });
              } */
        }
      }}
    >
      <AppImageView
        src={pressed ? R.images.icons.rec : R.images.icons.mic}
        style={{
          zIndex: 5,
          position: 'absolute',
          right: pressed ? right : undefined,
          width: pressed ? size : (size * 3) / 4,
          height: size,
        }}
      />
      {state.cancelled && (
        <AppView style={{ ...Styles.nonSelectable, width: screenWidth, height: '100%', backgroundColor: 'white', position: 'absolute', alignItems: 'flex-start', justifyContent: 'center' }}>
          <AppTextView style={{ marginLeft: 10 }} text={dictionary.cancelled} />
        </AppView>
      )}
      {pressed && (
        <AppView style={{ ...Styles.nonSelectable, position: 'absolute', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: '100%', left: 0, right: 0 }}>
          <AppImageView style={{ width: hp(3), height: hp(4), marginRight: 10 }} src={R.images.icons.arrow_left} />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum, ...Styles.nonSelectable }} text={dictionary.drag_to_cancel} fontSize={wp(3)} textColor={'grey'} />
        </AppView>
      )}
      {pressed && <TimerView />}
    </AppGestureView>
  );
}

export default React.memo(MicView2);
