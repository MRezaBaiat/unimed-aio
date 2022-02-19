import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { isSafari, safeAssignStyles } from '../../../../helpers';
import { Howler, Howl } from 'howler';
import { ConferenceType } from 'api';
import global from '../../../../config/global';

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
  const { src, objectFit, style, muted, zIndex, mirror, type } = props;
  const ref = useRef<any>(undefined);

  useEffect(() => {
    if (type === ConferenceType.audio) {
      if (isSafari) {
        if (src && global.audio && global.audio.mediaStream !== src) {
          global.audio.disconnect();
          global.audio = undefined;
          console.log('disconnected');
        }

        /*  if (!src && global.audio) {
          global.audio.disconnect();
          global.audio = undefined;
          console.log('disconnected');
        } */

        if (src && !global.audio) {
          console.log('src set');
          const audioCtx = Howler.ctx;
          // const gainNode = Howler.masterGain;
          const mediaSource = audioCtx.createMediaStreamSource(src);
          mediaSource.connect(audioCtx.destination);
          // gainNode.connect(audioCtx.destination);
          global.audio = mediaSource;
        }
      } else {
        if (global.audio && global.audio.mediaStream !== src) {
          global.audio.pause();
          global.audio = undefined;
        }

        if (!src && global.audio) {
          global.audio.pause();
          global.audio = undefined;
        }

        if (src && !global.audio) {
          const audio = new Audio();
          audio.srcObject = src;
          global.audio = audio;
          audio.play();
        }
      }
    }
  }, [src]);

  useEffect(() => {
    if (type === ConferenceType.video_audio) {
      if (ref.current && src) {
        if ('srcObject' in ref.current) {
          if (ref.current.srcObject !== src) {
            ref.current.srcObject = src;
          }
        } else {
          ref.current.src = window.URL.createObjectURL(src);
        }
      }
    }
  }, [ref.current, src]);

  // @ts-ignore
  return <video ref={ref} autoPlay playsInline muted={muted} style={safeAssignStyles(style, { objectFit: objectFit, zIndex })} />;
}
AppRCTView.defaultProps = {
  objectFit: 'cover',
};
export default React.memo(AppRCTView);
