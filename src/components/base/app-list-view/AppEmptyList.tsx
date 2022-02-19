import React from 'react';
import AppView from '../app-view/AppView';
import AppImageView from '../app-image/app-imageview';
import AppTextView from '../app-text-view/AppTextView';
import { hp, wp } from '../../../helpers/responsive-screen';
import { DictRecord } from '../../../assets/strings/dictionary';

interface Props {
  text: string | DictRecord;
  ImageUrl: any;
}
export default function AppEmptyList(props: Props) {
  const { text, ImageUrl } = props;
  return (
    <AppView style={{ height: '100%', width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
      <AppImageView style={{ height: hp(30), width: hp(32), marginTop: hp(15) }} src={ImageUrl} />
      <AppView style={{ height: hp(7), width: wp(60), borderRadius: hp(1.2), borderWidth: 2, borderColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center', marginTop: hp(4) }}>
        <AppTextView style={{ fontSize: wp(3.3), color: '#9e9e9e' }} text={text} />
      </AppView>
    </AppView>
  );
}
