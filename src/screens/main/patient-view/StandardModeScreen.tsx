import React, { memo, useEffect, useState } from 'react';
import { Keyboard, Linking, BackHandler, Platform } from 'react-native';
import UserApi from './../../../network/UserApi';
import { User } from 'api';
import { ScrollView } from 'react-native-gesture-handler';
import R from '../../../assets/R';
import GlobalAlert from '../../../modals/global_alert/GlobalAlert';
import AppNavigator from '../../../navigation/AppNavigator';
import AppContainer from '../../../components/base/app-container/AppContainer';
import AppImageView from '../../../components/base/app-image/app-imageview';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTouchable from '../../../components/base/app-touchable/AppTouchable';
import AppView from '../../../components/base/app-view/AppView';
import { FlatListSlider } from '../../../components/composite/react-native-flatlist-slider';
import AppListView from '../../../components/base/app-list-view/AppListView';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import ToastMaster from '../../../helpers/ToastMaster';
import BottomTab from '../../../components/composite/bottom_tab/BottomTab';
import { callIntent, getFavoriteDoctors, openURL } from '../../../helpers';
import AppSearchInput from '../../../components/composite/app_search_input/AppSearchInput';
import dictionary from '../../../assets/strings/dictionary';
import useLang from '../../../hooks/useLang';

const ImageSlides = [
  {
    banner: R.images.banners.doctor.banner2,
  },
  {
    banner: R.images.banners.doctor.banner3,
  },
  {
    banner: R.images.banners.patient.banner1,
  },
];

const StandardModeScreen = ({ initialCode }: { initialCode?: string }) => {
  const [searchFocused, setSearchFocued] = useState(false);
  const [doctors, setDoctors] = useState(getFavoriteDoctors() as User[]);
  const [backMillisec, setBackMillisec] = useState(0);
  const [exitAlert, setExitAlert] = useState(false);
  const [search, setSearch] = useState(initialCode ? String(initialCode) : '');
  const lang = useLang();
  console.log('LLLL', lang, dictionary.code);

  const _keyboardDidShow = () => {
    setSearchFocued(true);
  };

  const _keyboardDidHide = () => {
    setSearchFocued(false);
    setSearch('');
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const handleBackButton = (): boolean => {
    if (AppNavigator.getTopScreen() === 'MainScreen') {
      if (backMillisec && new Date().getTime() - backMillisec <= 3000) {
        BackHandler.exitApp();
      } else {
        setBackMillisec(new Date().getTime());
        setExitAlert(true);
      }
      return true;
    }

    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [backMillisec]);

  /* const load = () => {
    if (search === '' && loading) {
      return;
    }
    setLoading(true);
  };

  useEffect(load, [search]); */

  const _phoneCall = () => {
    callIntent('+994555809998');
  };

  const _linkToURL = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    console.log(canOpen);
    if (canOpen) {
      openURL(url);
    } else {
      alert('متاسفانه امکان مشاهده سایت در حال حاضور وجود ندارد');
    }
  };

  return (
    <AppContainer style={{ flex: 1 }}>
      {exitAlert && (
        <GlobalAlert
          onEnd={() => {
            setExitAlert(false);
          }}
          BgColor="green"
          text={dictionary.press_again_for_exit}
        />
      )}
      <ScrollView
        contentContainerStyle={{
          height: '100%',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <AppView style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: '2%', paddingLeft: '5%', paddingRight: '5%' }}>
          <AppTouchable onClick={_phoneCall}>
            <AppImageView style={{ width: wp(9.5), height: wp(9.5) }} resizeMode="contain" src={R.images.icons.support} />
          </AppTouchable>
          <AppImageView
            style={{
              width: wp(25),
              height: wp(14),
            }}
            resizeMode="contain"
            src={R.images.home_logo}
          />
        </AppView>
        <AppView style={{ marginTop: hp(1), width: '100%' }}>
          <FlatListSlider
            data={ImageSlides}
            imageKey={'banner'}
            local
            timer={5000}
            indicatorContainerStyle={{
              position: 'relative',
              top: hp(-1.4),
              justifyContent: 'center',
            }}
            indicatorActiveColor={'#38488A'}
            indicatorInActiveColor={'#C4C4C4'}
            indicatorActiveWidth={hp(1)}
            indicatorStyle={{
              height: hp(1),
              width: hp(1),
              marginHorizontal: hp(0.8),
            }}
            onPress={(item, index) => {
              console.log('object');
            }}
            height={wp(42)}
            width={wp(100)}
            separatorWidth={wp(2)}
            contentContainerStyle={{ paddingHorizontal: wp(0.5) }}
          />
        </AppView>
        <AppView
          style={[
            {
              backgroundColor: searchFocused ? '#FFFFFF' : '#F2F2F2',
              width: wp(92.3),
              height: searchFocused ? hp(56) : hp(7),
              borderRadius: hp(1.2),
              zIndex: 10,
              position: searchFocused ? 'absolute' : 'relative',
              top: searchFocused ? hp(10) : 0,
              alignSelf: 'center',
              marginTop: hp(-0.3),
            },
          ]}
        >
          <AppView
            style={{
              width: '100%',
              height: hp(7),
              borderRadius: hp(1.2),
              flexDirection: 'row-reverse',
              alignItems: 'center',
              alignContent: 'space-around',
            }}
          >
            <AppSearchInput
              textStyle={{
                fontSize: wp(3.3),
                color: '#878787',
                fontFamily: R.fonts.fontFamily_faNum,
                textAlign: 'right',
              }}
              onFocus={(focused) => {
                if (!focused) {
                  if (Platform.OS === 'web') {
                    setTimeout(() => {
                      setSearchFocued(false);
                    }, 100);
                  } else {
                    setSearchFocued(false);
                  }
                } else {
                  setSearchFocued(true);
                }
              }}
              placeHolder={dictionary['جستجو بر اساس کد اختصاصی یا نام پزشک']}
              placeholderTextColor={searchFocused ? '#878787' : '#4F4F4F'}
              value={search}
              onChange={(search) => setSearch(search)}
              onResults={(doctors) => setDoctors(doctors)}
              onEmpty={() => setDoctors(getFavoriteDoctors())}
              getResults={(search) => {
                return UserApi.getDoctors(0, 20, search)
                  .then((res) => res.data.results)
                  .catch(() => []);
              }}
            />
          </AppView>
          {searchFocused && (
            <AppListView
              keyboardShouldPersistTaps="handled"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#C4C4C4',
                borderWidth: 0.5,
                borderRadius: 7,
              }}
              data={doctors}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              extraData={doctors.length}
              onEndReachedThreshold={0.1}
              renderItem={({ item }) => {
                const doctor: User = item;
                return (
                  <AppTouchable
                    onClick={() => {
                      setSearch('');
                      setSearchFocued(false);
                      Keyboard.dismiss();
                      if (item.isFromFavourite) {
                        AppNavigator.navigateTo('DoctorListScreen', { initial: doctor.code });
                      } else {
                        AppNavigator.navigateTo('DoctorProfileScreen', {
                          DoctorData: doctor,
                        });
                      }
                    }}
                    style={{
                      height: hp(9.5),
                      width: '90%',
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#BDBDBD',
                    }}
                  >
                    <AppView>
                      <AppTextView
                        style={{
                          fontFamily: R.fonts.fontFamily_faNum,
                          color: '#4f4f4f',
                          fontSize: wp(3.8),
                          textAlign: 'right',
                        }}
                        text={doctor.name}
                      />
                      <AppTextView
                        style={{
                          fontFamily: R.fonts.fontFamily_faNum,
                          color: '#9e9e9e',
                          fontSize: wp(3),
                        }}
                        text={doctor.specialization.name}
                      />
                    </AppView>

                    <AppTextView
                      style={{
                        width: '20%',
                        textAlign: 'left',
                        fontFamily: R.fonts.fontFamily_faNum,
                        fontSize: wp(3.3),
                        color: '#4f4f4f',
                      }}
                      text={` ${dictionary.code[lang]}: ${doctor.code}`}
                    />
                  </AppTouchable>
                );
              }}
            />
          )}
        </AppView>
        <AppListView
          style={{
            width: wp(100),
            marginTop: hp(1.5),
            backgroundColor: '#e5f3f3',
          }}
          data={[
            {
              title: dictionary['ارتباط آنلاین با پزشک'],
              imageUrl: R.images.features.feature1,
              Navigate: 'DoctorListScreen',
              type: 'OnLine',
            },
            {
              title: dictionary['کلینیک‌ و بیمارستان‌'],
              imageUrl: R.images.features.feature3,
              Navigate: 'HealthCentersScreen',
            },
          ]}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          horizontal={false}
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: hp(9.4),
            paddingTop: hp(1),
          }}
          scrollsToTop
          numColumns={2}
          renderItem={({ item }) => (
            <AppTouchable
              onClick={() => {
                if (item.Link || item.Navigate) {
                  item.Link
                    ? _linkToURL(item.Link)
                    : AppNavigator.navigateTo(item.Navigate, {
                        type: item.type ? item.type : null,
                      });
                } else {
                  ToastMaster.makeText('به زودی');
                }
              }}
              style={[
                {
                  backgroundColor: '#FFFFFF',
                  width: wp(44),
                  height: hp(18),
                  borderRadius: hp(1.2),
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginHorizontal: wp(1),
                  marginVertical: wp(1),
                  paddingVertical: hp(1.5),
                },
              ]}
            >
              <AppImageView resizeMode="contain" style={{ width: hp(9), height: hp(9) }} src={item.imageUrl} />
              <AppTextView
                textColor="#38488A"
                style={{
                  fontSize: wp(3.2),
                  fontFamily: R.fonts.fontFamily_faNum,
                }}
                text={item.title}
              />
            </AppTouchable>
          )}
        />
      </ScrollView>
      {!searchFocused && <BottomTab focusedInput="1" />}
    </AppContainer>
  );
};

export default memo(StandardModeScreen);
