import React, { memo, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import R from '../../assets/R';
import { useSelector } from 'react-redux';
import { User } from 'api';
import dictionary from '../../assets/strings/dictionary';
import AuthService from '../../services/AuthService';
import AppContainer from '../../components/base/app-container/AppContainer';
import AppView from '../../components/base/app-view/AppView';
import { hp, wp } from '../../helpers/responsive-screen';
import AppHeader from '../../components/composite/header/AppHeader';
import AppTouchable from '../../components/base/app-touchable/AppTouchable';
import AppImageView from '../../components/base/app-image/app-imageview';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppNavigator from '../../navigation/AppNavigator';
import SoundSettingModal from '../../modals/SoundSettingModal';
import BottomTab from '../../components/composite/bottom_tab/BottomTab';
import LanguageSetModal from '../../modals/LanguageSetModal';
import PatientProfileModal from '../../modals/PatientProfileModal';
import { callIntent } from '../../helpers';
import DeviceInfo from 'react-native-device-info';
import useUser from '../../hooks/useUser';

function SettingScreen() {
  const user = useUser();
  const isPatient = user && user.type === 'PATIENT';

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [soundSettingModalVisible, setSoundSettingModalVisible] = useState(false);

  const _phoneCall = () => {
    callIntent('+989900303910');
  };

  return (
    <AppContainer style={{ backgroundColor: '#50BCBD', flex: 1 }}>
      {profileModalVisible ||
        languageModalVisible ||
        (soundSettingModalVisible && (
          <AppView
            style={{
              height: hp(100),
              width: wp(100),
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              position: 'absolute',
            }}
          />
        ))}

      <AppHeader text={dictionary.other} />
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
        {isPatient && (
          <AppTouchable
            onClick={() => {
              setProfileModalVisible(true);
            }}
            style={{
              width: '100%',
              height: hp(16),
              borderColor: '#F2F2F2',
              borderBottomWidth: 2,
              marginTop: hp(2),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingStart: '7%',
            }}
          >
            <AppView
              style={{
                height: '60%',
                width: '55%',
                marginRight: '7%',
                justifyContent: 'space-around',
              }}
            >
              <AppTextView
                style={{
                  fontFamily: R.fonts.fontFamily_Bold,
                  fontSize: wp(3.8),
                  color: '#38488A',
                }}
                text={dictionary.profile_settings}
              />
              <AppTextView textColor="#9E9E9E" fontSize={wp(3.3)} text={dictionary.personal_account_info} />
            </AppView>
            <AppImageView src={user.imageUrl} resizeMode="cover" style={{ width: wp(19), height: wp(19), borderRadius: 100 }} />
            <AppImageView
              style={{
                height: hp(2.3),
                width: hp(2),
                position: 'absolute',
                left: wp(5),
              }}
              src={R.images.icons.arrow_left}
            />
          </AppTouchable>
        )}
        {!isPatient && <AppImageView src={user.imageUrl} resizeMode="cover" style={{ width: wp(19), height: wp(19), borderRadius: 100, marginLeft: 'auto', marginRight: '7%', marginBottom: '3%' }} />}
        {!isPatient && (
          <AppTouchable
            onClick={() => {
              AppNavigator.navigateTo('DoctorWorkTimeSettingScreen');
            }}
            style={{
              width: '100%',
              height: hp(9),
              borderColor: '#F2F2F2',
              borderBottomWidth: 2,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingStart: '11.5%',
            }}
          >
            <AppImageView resizeMode="contain" style={{ width: wp(8.5), height: wp(8.5) }} src={R.images.icons.response_time} />
            <AppTextView
              style={{
                fontFamily: R.fonts.fontFamily_faNum,
                fontSize: wp(3.8),
                color: '#38488A',
                marginRight: '14.75%',
              }}
              text={dictionary.response_time}
            />
          </AppTouchable>
        )}
        <AppTouchable
          onClick={() => {
            AppNavigator.navigateTo('TransactionsHistoryScreen');
          }}
          style={{
            width: '100%',
            height: hp(9),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingStart: '11.5%',
          }}
        >
          <AppImageView resizeMode="contain" style={{ width: wp(10), height: wp(10) }} src={R.images.icons.transactionIcon} />
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              fontSize: wp(3.8),
              color: '#38488A',
              marginRight: '13.75%',
            }}
            text={dictionary.financial_records}
          />
        </AppTouchable>
        {/* {
          isPatient &&
          <AppTouchable
            onClick={() => { AppNavigator.navigateTo('AttendanceHistoryScreen', { isPatient: isPatient }); }}
            style={{
              width: '100%',
              height: hp(9),
              borderColor: '#F2F2F2',
              borderBottomWidth: 2,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingStart: '11.5%'
            }}>
            <AppImageView
              resizeMode="contain"
              style={{ width: wp(10), height: wp(10) }}
              src={R.images.icons.AttendHistory}
            />
            <AppTextView
              style={{
                fontFamily: R.fonts.fontFamily_faNum,
                fontSize: wp(3.8),
                color: '#38488A',
                marginRight: '13.75%'
              }}
              text={'سوابق نوبت حضوری'}
            />
          </AppTouchable>
        } */}

        {!isPatient && (
          <AppTouchable
            onClick={() => {
              setSoundSettingModalVisible(true);
            }}
            style={{
              width: '100%',
              height: hp(9),
              borderColor: '#F2F2F2',
              borderBottomWidth: 2,
              flexDirection: 'row-reverse',
              alignItems: 'center',
              paddingStart: '11.5%',
            }}
          >
            <AppImageView resizeMode="contain" style={{ width: wp(9), height: wp(9) }} src={R.images.icons.soundSettingIcon} />
            <AppTextView
              style={{
                fontFamily: R.fonts.fontFamily_faNum,
                fontSize: wp(3.8),
                color: '#38488A',
                marginRight: '14.25%',
              }}
              text={dictionary.announcements}
            />
          </AppTouchable>
        )}
        {/* <AppTouchable
          onClick={() => {
            setLanguageModalVisible(true);
          }}
          style={{
            width: '100%',
            height: hp(9),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingStart: '11.5%'
          }}>
          <AppImageView
            resizeMode="contain"
            style={{ width: wp(8.5), aspectRatio: 1 }}
            src={R.images.icons.languageSettingIcon}
          />
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              fontSize: wp(3.8),
              color: '#38488A',
              marginRight: '14.75%'
            }}
            text="زبان (Language)"
          />
        </AppTouchable> */}
        <AppTouchable
          onClick={() => {
            _phoneCall();
          }}
          style={{
            width: '100%',
            height: hp(9),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingStart: '11.5%',
          }}
        >
          <AppImageView resizeMode="contain" style={{ width: wp(8.5), height: wp(8.5) }} src={R.images.icons.support} />
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              fontSize: wp(3.8),
              color: '#38488A',
              marginRight: '14.75%',
            }}
            text={dictionary.call_support}
          />
        </AppTouchable>
        <AppTouchable
          onClick={() => {
            AppNavigator.resetStackTo('Exit');
          }}
          style={{
            width: '100%',
            height: hp(9),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingStart: '11.5%',
          }}
        >
          <AppImageView resizeMode="contain" style={{ width: wp(8.5), height: wp(8.5) }} src={R.images.icons.exit} />
          <AppTextView
            style={{
              fontFamily: R.fonts.fontFamily_faNum,
              fontSize: wp(3.8),
              color: '#38488A',
              marginRight: '14.75%',
            }}
            text={dictionary.exit}
          />
        </AppTouchable>
        {Platform.OS !== 'web' && <AppTextView text={DeviceInfo.getVersion()} textColor={'#38488A'} style={{ marginTop: 10, alignSelf: 'flex-start' }} />}
      </AppView>
      <PatientProfileModal
        modalVisible={profileModalVisible}
        closeModal={() => {
          setProfileModalVisible(false);
        }}
      />
      <LanguageSetModal
        modalVisible={languageModalVisible}
        closeModal={() => {
          setLanguageModalVisible(false);
        }}
        title={dictionary.select_language}
      />
      <SoundSettingModal
        closeModal={() => {
          setSoundSettingModalVisible(false);
        }}
        modalVisible={soundSettingModalVisible}
        title={dictionary.sound_settings}
      />
      <BottomTab focusedInput="3" />
    </AppContainer>
  );
}
export default memo(SettingScreen);
