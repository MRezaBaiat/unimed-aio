import React, { ReactNode } from 'react';
import R from '../../../assets/R';
import AppView from '../../base/app-view/AppView';
import AppTextView from '../../base/app-text-view/AppTextView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTouchable from '../../base/app-touchable/AppTouchable';
import AppNavigator from '../../../navigation/AppNavigator';
import AppImageView from '../../base/app-image/app-imageview';
import { Platform, StatusBar } from 'react-native';
import { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  text?: string | DictRecord;
  onBackPress?: () => void;
  BackIcon: any;
  backIconVisible: boolean;
  mode?: 'screen';
}
const AppHeader = (props: Props) => {
  const { text, onBackPress, BackIcon, backIconVisible, mode } = props;
  return (
    <AppView style={{ width: wp(86), zIndex: Number.MAX_SAFE_INTEGER, position: 'absolute', height: hp(10), alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppTextView style={{ fontFamily: R.fonts.fontFamily_Bold, fontSize: wp(4.6), color: '#FFFFFF', textAlignVertical: 'top' }} text={text || ''} />
      {backIconVisible && (
        <AppTouchable style={{ padding: 10, justifyContent: 'center' }} onClick={onBackPress}>
          <AppImageView resizeMode="contain" style={{ width: 25, height: 25 }} src={BackIcon} />
        </AppTouchable>
      )}
    </AppView>
  );
};

AppHeader.defaultProps = {
  onBackPress: AppNavigator.goBack,
  BackIcon: R.images.icons.backwhite,
  backIconVisible: true,
};

export default React.memo(AppHeader);
