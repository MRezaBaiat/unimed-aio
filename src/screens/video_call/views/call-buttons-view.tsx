import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import AppView from '../../../components/base/app-view/AppView';
import { safeAssignStyles } from '../../../helpers';
import R from '../../../assets/R';
import AppImageButton from '../../../components/base/app-image-button/AppImageButton';
import { hp, wp } from '../../../helpers/responsive-screen';

interface Props {
  speakerOn?: boolean;
  muted?: boolean;
  onSwitchCamera?: () => void;
  onSpeaker?: () => void;
  onMute?: () => void;
  style?: StyleProp<ViewStyle>;
}
function CallButtonsView(props: Props) {
  const { style, onSpeaker, onSwitchCamera, onMute, speakerOn, muted } = props;
  return (
    <AppView style={{ height: hp(9), width: wp(100), backgroundColor: '#01796c', flexDirection: 'row', alignItems: 'center', zIndex: 2, justifyContent: 'space-evenly' }}>
      {onSwitchCamera && <AppImageButton src={R.images.icons.switch_camera} resizeMode={'contain'} style={{ height: 25, width: 25, padding: 25 }} onClick={onSwitchCamera} />}
      {onSpeaker && <AppImageButton src={R.images.icons.speakerOn} resizeMode={'contain'} style={{ height: 25, width: 25, backgroundColor: speakerOn ? '#ffffff66' : undefined, borderRadius: 50, padding: 25 }} onClick={onSpeaker} />}
      {onMute && <AppImageButton src={R.images.icons.mute} resizeMode={'contain'} style={{ height: 25, width: 25, backgroundColor: muted ? '#ffffff66' : undefined, borderRadius: 50, padding: 25 }} onClick={onMute} />}
    </AppView>
  );
}

export default React.memo(CallButtonsView);
