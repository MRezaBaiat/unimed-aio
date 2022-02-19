import React from 'react';
import AppRCTView from '../views/rct-view/AppRCTView';
import { ConferenceType } from 'api';

interface Props {
  style?: any;
  localStream: any;
}
function CameraView(props: Props) {
  const { style, localStream } = props;
  return <AppRCTView type={ConferenceType.video_audio} zIndex={1} src={localStream} muted mirror objectFit={'cover'} style={style} />;
}

export default React.memo(CameraView);
