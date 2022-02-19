import React, { useEffect, useState } from 'react';
import { HealthCenter, User } from 'api';
import R from '../../assets/R';
import HealthCentersApi from '../../network/HealthCentersApi';
import { useSelector } from 'react-redux';
import dictionary from '../../assets/strings/dictionary';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppImageView from '../../components/base/app-image/app-imageview';
import { hp, wp } from '../../helpers/responsive-screen';
import AppHeader from '../../components/composite/header/AppHeader';
import AppView from '../../components/base/app-view/AppView';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import AppListView from '../../components/base/app-list-view/AppListView';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import AppCardRow from '../../components/composite/app_card_row/AppCardRow';
import { Keyboard } from 'react-native';

interface Props {
  center: HealthCenter;
}
function HealthCenterMembersScreen(props: Props) {
  const { center } = getScreenParam(props);
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([] as User[]);
  const [isResponse, setIsResponse] = useState(false);
  const [focused, setFocused] = useState(false);
  console.log('focused', focused);
  useEffect(() => {
    HealthCentersApi.getDoctorsIn(center._id)
      .then((res) => {
        console.log(res.data, 'getdoctorsIn');
        setDoctors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    const keyboardShow = () => {
      setFocused(true);
    };
    const keyboardHide = () => {
      setFocused(false);
    };
    Keyboard.addListener('keyboardDidShow', keyboardShow);
    Keyboard.addListener('keyboardDidHide', keyboardHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardShow);
      Keyboard.removeListener('keyboardDidHide', keyboardHide);
    };
  }, []);
  const data: User[] = search === '' ? doctors : doctors.filter((s) => s.name.includes(search));

  return (
    <AppContainer keyboardVerticalOffset={-250} style={{ alignItems: 'center', backgroundColor: '#38488A' }}>
      <AppHeader />
      <AppImageView resizeMode="contain" style={{ height: wp(23), width: wp(23), marginTop: hp(4) }} src={R.images.icons.clinics_logo} />
      <AppView
        style={{
          height: '100%',
          width: wp(100),
          marginTop: hp(2),
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: hp(3),
          borderTopRightRadius: hp(3),
        }}
      >
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_faNum_Bold,
            marginTop: '5%',
            alignSelf: 'center',
          }}
          textColor="#38488A"
          fontSize={wp(3.8)}
          text={center.name}
        />
        <AppView
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            alignSelf: 'center',
            width: wp(80),
            marginTop: hp(1),
          }}
        >
          <AppImageView
            resizeMode="contain"
            style={{
              width: wp(5),
              height: wp(5),
              alignSelf: 'flex-start',
              marginStart: wp(1),
            }}
            src={R.images.icons.location}
          />
          <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum }} textColor="#50BCBD" fontSize={wp(3)} text={center.address} />
        </AppView>
        <AppView
          style={{
            width: '100%',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: hp(2),
          }}
        >
          <AppView style={{ backgroundColor: '#F2F2F2', width: wp(92), height: hp(7), borderRadius: hp(1.2), alignSelf: 'center', marginRight: 'auto', marginLeft: 'auto', marginBottom: 7 }}>
            <AppView style={{ width: '100%', height: hp(7), borderRadius: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center' }}>
              <AppTextInput value={search} onChange={setSearch} textStyle={{ fontSize: wp(3.3), color: '#878787', textAlign: 'right', fontFamily: R.fonts.fontFamily_faNum }} style={{ width: '85%', height: hp(7), alignItems: 'center' }} placeHolder="جستجوی نام پزشک" />
              <AppView
                style={{
                  height: hp(5),
                  width: 1,
                  backgroundColor: '#C4C4C4',
                }}
              />
              <AppImageView resizeMode="contain" style={{ width: wp(10), height: wp(10) }} src={R.images.icons.search} />
            </AppView>
          </AppView>
        </AppView>
        <AppListView
          data={data}
          extraData={data.length}
          contentContainerStyle={{ paddingBottom: hp(15), alignItems: 'center' }}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item }) => {
            const user: User = item;
            return (
              <AppCardRow
                onClick={() => {
                  AppNavigator.navigateTo('DoctorProfileScreen', {
                    DoctorData: item,
                  });
                }}
                title={user.name}
                subTitle={user.specialization.name}
                imageSrc={user.imageUrl}
                online={isResponse}
              />
            );
          }}
        />
      </AppView>
      {!focused && <BottomTab />}
    </AppContainer>
  );
}

export default React.memo(HealthCenterMembersScreen);
