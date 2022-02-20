import React, { memo, useEffect, useState, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import R from '../../../assets/R';
import { useSelector } from 'react-redux';
import { DoctorStatus } from 'api';
import { ActivityIndicator, BackHandler, Linking } from 'react-native';
import GlobalAlert from '../../../modals/global_alert/GlobalAlert';
import AppNavigator from '../../../navigation/AppNavigator';
import AppImageView from '../../../components/base/app-image/app-imageview';
import AppContainer from '../../../components/base/app-container/AppContainer';
import { hp, wp } from '../../../helpers/responsive-screen';
import AppTouchable from '../../../components/base/app-touchable/AppTouchable';
import AppView from '../../../components/base/app-view/AppView';
import { FlatListSlider } from '../../../components/composite/react-native-flatlist-slider';
import AppTextView from '../../../components/base/app-text-view/AppTextView';
import AppListView from '../../../components/base/app-list-view/AppListView';
import ToastMaster from '../../../helpers/ToastMaster';
import BottomTab from '../../../components/composite/bottom_tab/BottomTab';
import { callIntent, openURL } from '../../../helpers';
import AppLottieView from '../../../components/base/app-lottieview/AppLottieView';
import AppActivityIndicator from '../../../components/base/app-activity-indicator/AppActivityIndicator';
import useStatus from '../../../hooks/useStatus';
import { smartDate } from 'javascript-dev-kit';
import dictionary from '../../../assets/strings/dictionary';

const ImageSlides = [
  {
    banner: R.images.banners.doctor.banner1,
  },
  {
    banner: R.images.banners.doctor.banner2,
  },
  {
    banner: R.images.banners.doctor.banner3,
  },
];
const FeaturesData = [
  {
    title: dictionary['پزشکان'],
    imageUrl: R.images.features.feature1,
    Navigate: 'DoctorListScreen',
  },
  { title: dictionary['نسخه الکترونیکی'], imageUrl: R.images.features.feature8 },
];
const _linkToURL = async (url) => {
  const canOpen = await Linking.canOpenURL(url);
  console.log(canOpen);
  if (canOpen) {
    openURL(url);
  } else {
    alert('Not Available');
  }
};
const DoctorView = () => {
  const status = useStatus() as DoctorStatus;

  const queueList = status.queueList;

  const _phoneCall = () => {
    callIntent('+989900303910');
  };

  const [backMillisec, setBackMillisec] = useState(0);
  const [exitAlert, setExitAlert] = useState(false);

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
  }, [backMillisec, setBackMillisec]);

  const getLastPatientInQueueTime = () => {
    const initiateDate = queueList[queueList.length - 1].createdAt;
    const SecondsToNow = (smartDate().getTime() - smartDate(initiateDate).getTime()) / 1000;
    return SecondsToNow < 60 ? `${Math.round(SecondsToNow)} ثانیه ` : `${Math.round(SecondsToNow / 60)} دقیقه `;
  };

  return (
    <AppContainer style={{ flex: 1 }}>
      {exitAlert && <GlobalAlert BgColor="green" text={dictionary['برای بستن اپلیکشیشن دوباره دکمه برگشت را لمس کنید']} />}
      {queueList ? (
        <ScrollView
          contentContainerStyle={{
            height: '100%',
          }}
        >
          <AppView style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginTop: '2%', paddingLeft: '5%', paddingRight: '5%' }}>
            <AppTouchable onClick={_phoneCall}>
              <AppImageView style={{ width: wp(9.5), height: wp(9.5) }} resizeMode="contain" src={R.images.icons.support} />
            </AppTouchable>
            <AppImageView
              style={{
                width: wp(25),
                height: wp(12),
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
          <AppTouchable
            onClick={() => {
              AppNavigator.navigateTo('QueueListScreen');
            }}
            disabled={queueList.length === 0}
            style={{
              width: wp(92),
              alignSelf: 'center',
              height: hp(12.5),
              borderRadius: hp(1.2),
              borderWidth: 0.75,
              borderColor: queueList.length > 0 ? '#38488a' : '#BDBDBD',
              marginTop: hp(1.2),
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingStart: '4%',
            }}
          >
            {queueList.length === 0 ? (
              <AppImageView
                src={R.images.icons.notify_icon}
                resizeMode="cover"
                style={{
                  height: hp(6),
                  width: hp(6),
                  borderRadius: 100,
                  marginRight: hp(3),
                }}
              />
            ) : (
              <AppLottieView width={hp(12)} height={hp(12)} animation={R.animations.doctor_queue_notify_anim} />
            )}
            <AppView
              style={{
                height: '60%',
                width: '70%',
                marginRight: '4%',
                justifyContent: 'center',
              }}
            >
              {queueList.length !== 0 && (
                <AppView style={{ flexDirection: 'row-reverse' }}>
                  <AppTextView
                    style={{
                      fontFamily: R.fonts.fontFamily_faNum_Bold,
                      fontSize: wp(3.3),
                      color: '#38488a',
                    }}
                    text={`${queueList.length} بیمار`}
                  />
                  <AppTextView
                    style={{
                      fontFamily: R.fonts.fontFamily_faNum,
                      fontSize: wp(3.3),
                      color: '#38488a',
                    }}
                    text={' در انتظار پاسخگویی شما هستند'}
                  />
                </AppView>
              )}
              <AppTextView
                style={{
                  fontFamily: R.fonts.fontFamily_faNum,
                  fontSize: wp(3.3),
                  color: '#9E9E9E',
                  marginTop: hp(1),
                }}
                text={queueList.length === 0 ? dictionary['بیماری در لیست انتظار وجود ندارد'] : `${dictionary['مدت انتظار آخرین بیمار']}: ${getLastPatientInQueueTime()}`}
              />
            </AppView>
          </AppTouchable>
          <AppListView
            style={{
              width: wp(100),
              marginTop: hp(1.5),
              backgroundColor: '#e5f3f3',
            }}
            data={FeaturesData}
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
                <AppImageView resizeMode="contain" style={{ width: '40%', height: '40%' }} src={item.imageUrl} />
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
      ) : (
        <AppActivityIndicator style={R.styles.spinner} size="large" />
      )}
      <BottomTab focusedInput="1" />
    </AppContainer>
  );
};

export default memo(DoctorView);
