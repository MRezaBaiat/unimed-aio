import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import AppView from '../../../components/base/app-view/AppView';
import { safeAssignStyles } from '../../../helpers';
import R from '../../../assets/R';
import AppImageButton from '../../../components/base/app-image-button/AppImageButton';
import { hp, wp } from '../../../helpers/responsive-screen';

interface Props {
  onReject?: () => void;
  onAccept?: () => void;
  style?: StyleProp<ViewStyle>;
}
function AnswerButtonsView(props: Props) {
  const { style, onAccept, onReject } = props;
  return (
    <AppView style={{ height: hp(10), width: wp(100), flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: hp(10), zIndex: 2, justifyContent: 'space-evenly' }}>
      {onAccept && <AppImageButton onClick={onAccept} resizeMode="contain" style={{ height: 50, width: 50 }} src={R.images.icons.answer_call} />}
      {onReject && <AppImageButton onClick={onReject} resizeMode="contain" style={{ height: 50, width: 50 }} src={R.images.icons.hangup_call} />}
    </AppView>
  );
}

export default React.memo(AnswerButtonsView);
