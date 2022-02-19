/* eslint-disable @typescript-eslint/ban-types */
import React, { memo, useEffect, useState } from 'react';
import R from '../../../assets/R';
import AppView from '../../base/app-view/AppView';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTouchable from '../../base/app-touchable/AppTouchable';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppImageView from '../../base/app-image/app-imageview';
import AppNavigator from '../../../navigation/AppNavigator';

interface Props {
  text1?: string;
  text2?: string;
  text3?: string;
  Icon2?: any;
  focusedInput?: string;
  Navigate2?: string;
  style?: any;
}

const BottomTab: React.FC<Props> = (props) => {
  const { text1, text2, text3, Icon2, focusedInput, Navigate2, style } = props;
  const [focused, setFocused] = useState();
  useEffect(() => setFocused(focusedInput), [focused]);
  return (
    <AppView
      style={[
        {
          width: wp(110),
          height: hp(9),
          alignSelf: 'center',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-around',
          bottom: 0,
          borderWidth: 2,
          borderTopColor: '#F2F2F2',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
        },
        style,
      ]}
    >
      <AppTouchable
        onClick={() => {
          setFocused('1');
          AppNavigator.navigateTo('MainScreen');
        }}
        style={{ alignItems: 'center', flex: 1 }}
      >
        <AppImageView resizeMode="contain" style={{ height: hp(3.8), width: hp(3.8) }} src={focused === '1' ? R.images.icons.HomeIconfocused : R.images.icons.HomeIcon} />
        <AppTextView text={text1} textColor={focused === '1' ? '#50BCBD' : '#38488A'} style={{ textAlign: 'center', fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3) }} />
      </AppTouchable>
      <AppTouchable
        onClick={() => {
          AppNavigator.navigateTo(Navigate2);
          setFocused('2');
        }}
        style={{ alignItems: 'center', flex: 1 }}
      >
        <AppImageView resizeMode="contain" style={{ height: hp(3.8), width: hp(3.8) }} src={focused === '2' ? Icon2.Active : Icon2.InActive} />
        <AppTextView text={text2} textColor={focused === '2' ? '#50BCBD' : '#38488A'} style={{ textAlign: 'center', fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3) }} />
      </AppTouchable>
      <AppTouchable
        onClick={() => {
          AppNavigator.navigateTo('SettingsScreen');
          setFocused('3');
        }}
        style={{ alignItems: 'center', flex: 1 }}
      >
        <AppImageView resizeMode="contain" style={{ height: hp(3.8), width: hp(3.8) }} src={focused === '3' ? R.images.icons.settingIconfocused : R.images.icons.settingIcon} />
        <AppTextView text={text3} textColor={focused === '3' ? '#50BCBD' : '#38488A'} style={{ textAlign: 'center', fontFamily: R.fonts.fontFamily_faNum, fontSize: wp(3.3) }} />
      </AppTouchable>
    </AppView>
  );
};

BottomTab.defaultProps = {
  text1: 'خانه',
  text2: 'سوابق مشاوره',
  text3: 'سایر',
  Icon2: { Active: R.images.icons.VisitHistoryIconfocused, InActive: R.images.icons.VisitHistoryIcon },
  focusedInput: '0',
  Navigate2: 'VisitsHistoryScreen',
};

export default memo(BottomTab);
