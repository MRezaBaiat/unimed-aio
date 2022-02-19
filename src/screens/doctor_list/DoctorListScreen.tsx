import React, { useState, useEffect, useRef } from 'react';
import UserApi from '../../network/UserApi';
import R from '../../assets/R';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Kit from 'javascript-dev-kit';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppHeader from '../../components/composite/header/AppHeader';
import AppView from '../../components/base/app-view/AppView';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppTextInput from '../../components/base/app-text-input/AppTextInput';
import AppListView from '../../components/base/app-list-view/AppListView';
import AppNavigator, { getScreenParam } from '../../navigation/AppNavigator';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import { User } from 'api';
import AppCardRow from '../../components/composite/app_card_row/AppCardRow';
import AppActivityIndicator from '../../components/base/app-activity-indicator/AppActivityIndicator';
import { getFavoriteDoctors } from '../../helpers';
import dictionary from '../../assets/strings/dictionary';

function DoctorListScreen(props) {
  const initialCode = getScreenParam(props, 'initial');
  const type = getScreenParam(props, 'type');

  const [doctors, setDoctors] = useState([] as User[]);
  const [maxCount, setMaxCount] = useState(0);
  const [search, setSearch] = useState(String(initialCode || ''));
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (search === '' && loading) {
      return;
    }
    if (search === '') {
      return setDoctors(getFavoriteDoctors());
    }
    setLoading(true);
    UserApi.getDoctors(doctors.length, 20, Kit.numbersToEnglish(search))
      .then((res) => {
        const obj = {};
        doctors.forEach((user) => {
          obj[user._id] = user;
        });
        res.data.results.forEach((user) => {
          obj[user._id] = user;
        });
        setMaxCount(res.data.total);
        setDoctors(Object.values(obj));
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(load, [search]);

  // @ts-ignore
  return (
    <AppContainer style={{ alignItems: 'center', backgroundColor: '#50BCBD' }}>
      <AppImageView resizeMode="contain" style={{ height: wp(22), width: wp(22), marginTop: hp(3) }} src={R.images.icons.doctors_list_icon} />
      <AppHeader />
      <AppView style={{ flex: 1, backgroundColor: '#FFFFFF', width: wp(100), borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3) }}>
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_Bold,
            marginTop: hp(2),
            alignSelf: 'center',
          }}
          textColor="#38488A"
          fontSize={wp(4.6)}
          text={dictionary.doctors}
        />
        <AppView style={[{ backgroundColor: '#F2F2F2', width: wp(92), height: hp(7), borderRadius: hp(1.2), alignSelf: 'center', marginTop: hp(2) }]}>
          <AppView style={{ width: '100%', height: hp(7), borderRadius: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center', alignContent: 'space-around' }}>
            <AppTextInput
              value={search}
              onChange={(value) => {
                setDoctors([]);
                setMaxCount(0);
                setSearch(value);
              }}
              placeholderTextColor={'#4F4F4F'}
              textStyle={{ fontSize: wp(3), color: '#878787', fontFamily: R.fonts.fontFamily_faNum, textAlign: 'right' }}
              style={{ width: '85%', height: hp(6.5), justifyContent: 'center', paddingHorizontal: hp(2) }}
              placeHolder="جستجو بر اساس کد اختصاصی یا نام پزشک"
            />
            <AppView style={{ height: '50%', width: 1, backgroundColor: '#C4C4C4', marginHorizontal: hp(1.8) }} />
            <AppImageView resizeMode="contain" style={{ width: wp(5), height: wp(5) }} src={R.images.icons.search} />
          </AppView>
        </AppView>
        <AppListView
          contentContainerStyle={{ paddingBottom: hp(15), alignItems: 'center' }}
          data={doctors}
          extraData={doctors.length}
          onEndReached={() => {
            if (!loading && doctors.length < maxCount) {
              load();
            }
          }}
          onEndReachedThreshold={0.1}
          legacyImplementation
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item }) => {
            const user: User = item;
            return (
              <AppCardRow onClick={() => AppNavigator.navigateTo('DoctorProfileScreen', { DoctorData: item, type: type })} online={user.ready} imageSrc={user.imageUrl} title={user.name} subTitle={user.specialization.name} />
              /* <AppCardView
                    touchable
                    onClick={() => {
                      AppNavigator.navigateTo('DoctorProfileScreen', { DoctorData: item, type: type });
                    }}
                    style={{ width: wp(92), height: hp(12.5), borderRadius: hp(1.2), marginTop: hp(1.2), flexDirection: 'row-reverse', alignItems: 'center', paddingStart: '4%' }}
                >
                        <AppView>
                            {user.ready &&
                            <AppView style={{ height: hp(1.8), width: hp(1.8), backgroundColor: '#3AED2A', zIndex: 4, borderRadius: 100, position: 'absolute', right: '28%', bottom: '3%', borderWidth: 1, borderColor: 'white' }} />}
                            <AppAvatar url={user.imageUrl} style={{ marginRight: wp(3) }}/>
                        </AppView>
                        <AppView style={{ height: '60%', width: '55%', marginRight: '4%', justifyContent: 'space-between' }}>
                            <AppTextView style={{ fontFamily: R.fonts.fontFamily_faNum_Bold, fontSize: wp(3.8), color: '#38488a' }}
                                         text={user.name} />
                            <AppTextView textColor='#50BCBD' fontSize={wp(3.3)} text={user.specialization.name} />
                        </AppView>
                        <AppImageView style={{ height: hp(2), width: hp(1.5), position: 'absolute', left: '6%' }} src={R.images.icons.arrow_left} />
                </AppCardView> */
            );
          }}
        />
      </AppView>
      {loading && <AppActivityIndicator color="#4E55A1" size="large" style={{ alignSelf: 'center', width: '100%', height: '100%', position: 'absolute', zIndex: 4 }} />}
      <HideWithKeyboard>
        <BottomTab style={{ position: null, bottom: undefined }} />
      </HideWithKeyboard>
    </AppContainer>
  );
}
export default React.memo(DoctorListScreen);
