import React, { useEffect, useState } from 'react';
import HealthCentersApi from '../../network/HealthCentersApi';
import { HealthCenter } from 'api';
import R from '../../assets/R';
import { useSelector } from 'react-redux';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppHeader from '../../components/composite/header/AppHeader';
import AppView from '../../components/base/app-view/AppView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppListView from '../../components/base/app-list-view/AppListView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppNavigator from '../../navigation/AppNavigator';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import dictionary from '../../assets/strings/dictionary';

function HealthCentersScreen() {
  const [centers, setCenters] = useState([] as HealthCenter[]);
  useEffect(() => {
    HealthCentersApi.getHealthCenters()
      .then((res) => {
        console.log('res', res.data);
        setCenters(res.data);
        console.log(centers, 'center');
      })
      .catch((err) => {
        console.log('err');
        console.log(err);
      });
  }, []);
  return (
    <AppContainer keyboardVerticalOffset={-250} style={{ backgroundColor: '#38488A', flex: 1 }}>
      <AppHeader text={dictionary['کلینیک‌ها و بیمارستان‌ها']} />
      <AppView
        style={{
          height: hp(89),
          width: wp(100),
          padding: wp(4),
          marginTop: hp(11),
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: hp(3),
          borderTopRightRadius: hp(3),
        }}
      >
        <AppView style={{ backgroundColor: '#F2F2F2', width: wp(92), height: hp(7), borderRadius: hp(1.2), alignSelf: 'center', alignItems: 'center' }}>
          <AppView style={{ width: '100%', height: hp(7), borderRadius: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center' }}>
            <AppTextInput onChange={(value) => {}} textStyle={{ fontSize: wp(3.3), color: '#878787', textAlign: 'right', fontFamily: R.fonts.fontFamily_faNum }} style={{ width: '85%', height: hp(7), alignItems: 'center', paddingHorizontal: hp(2) }} placeHolder="جستجوی نام کلینیک یا بیمارستان" />
            <AppView style={{ height: hp(5), width: 1, backgroundColor: '#C4C4C4' }} />
            <AppImageView resizeMode="contain" style={{ width: wp(10), height: wp(10) }} src={R.images.icons.search} />
          </AppView>
        </AppView>
        <AppListView
          contentContainerStyle={{ paddingBottom: hp(15) }}
          data={centers}
          extraData={centers.length}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={(item) => {
            const center: HealthCenter = item.item;
            return (
              <AppTouchable
                onClick={() => {
                  AppNavigator.navigateTo('HealthCenterMembersScreen', { center });
                }}
                style={{ width: '100%', height: hp(15), borderRadius: hp(1.2), borderWidth: 0.75, borderColor: '#BDBDBD', marginTop: hp(2), flexDirection: 'row-reverse', alignItems: 'center', paddingStart: '7%' }}
              >
                <AppView style={{ height: '70%', width: '90%', marginRight: '7%', justifyContent: 'space-around' }}>
                  <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.3), color: '#38488A' }} text={center.name} />
                  <AppView style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: hp(1) }}>
                    <AppImageView resizeMode="contain" style={{ width: wp(5), height: wp(5), alignSelf: 'flex-start', marginStart: wp(1) }} src={R.images.icons.location} />
                    <AppTextView textColor="#50BCBD" fontSize={wp(3)} text={center.address.split('،')[1] ? `${center.address.split('،')[0]}،${center.address.split('،')[1]}` : center.address.split('،')[0]} />
                  </AppView>
                </AppView>
              </AppTouchable>
            );
          }}
        />
      </AppView>
      <BottomTab />
    </AppContainer>
  );
}

export default React.memo(HealthCentersScreen);
