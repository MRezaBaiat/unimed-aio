import React, { useEffect, useState } from 'react';
import { Keyboard, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ChatType, User, UserType } from 'api';
import UserApi from '../network/UserApi';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import AppImageView from '../components/base/app-image/app-imageview';
import AppTextInput from '../components/base/app-text-input/AppTextInput';
import dictionary from '../assets/strings/dictionary';
import R from '../assets/R';
import AppTextView from '../components/base/app-text-view/AppTextView';
import AuthService from '../services/AuthService';
import ToastMaster from '../helpers/ToastMaster';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker/src/ImagePicker.types';
import FileAsset from '../helpers/file-manager/FileAsset';
import AppActivityIndicator from '../components/base/app-activity-indicator/AppActivityIndicator';
import axios from 'axios';
import AppModal from '../components/base/app-modal/AppModal';
import { openImagePicker } from '../helpers';
import useUser from '../hooks/useUser';

interface Props {
  modalVisible: boolean;
  closeModal: () => void;
}

function PatientProfileModal(props: Props) {
  const { modalVisible, closeModal } = props;
  const user = useUser();
  const [imageUrl, setImageUrl] = useState(user.imageUrl);
  const [modalHeight, setModalHeight] = useState(89);
  const [changePic, setChangePic] = useState(false);

  const pickFile = () => {
    openImagePicker()
      .then((file) => {
        if (!file) {
          return;
        }
        setChangePic(true);
        file
          .upload(undefined, undefined, axios.defaults.baseURL + '/api/users/profileimage')
          .then((url) => {
            if (!url) {
              return;
            }
            AuthService.setUser({
              ...user,
              imageUrl: url,
            });
            setImageUrl(url);
          })
          .catch((err) => {
            console.log(err);
            // ToastMaster.makeText(dictionary.error_sending_file);
          })
          .finally(() => {
            setChangePic(false);
          });
      })
      .finally(closeModal);
  };
  const [gender, setGender] = useState(user.gender);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState('');

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setModalHeight(100);
  };

  const _keyboardDidHide = () => {
    setModalHeight(89);
  };

  return (
    <AppModal animationType="slide" transparent={true} visible={modalVisible}>
      <AppView style={[{ height: hp(modalHeight), backgroundColor: '#FFFFFF', width: '100%', marginTop: hp(100 - modalHeight), borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3), alignItems: 'center' }]}>
        <ModalHeader
          text={dictionary['تنظیمات پروفایل']}
          onClosePress={() => {
            closeModal();
          }}
        />
        {changePic ? (
          <AppActivityIndicator color="#4E55A1" size="large" style={R.styles.spinner} />
        ) : (
          <AppTouchable style={{ marginTop: hp(4), alignItems: 'center' }} onClick={user.type === UserType.PATIENT ? pickFile : undefined}>
            <AppImageView resizeMode="cover" style={{ width: hp(18), height: hp(18), borderRadius: 100, marginBottom: hp(1) }} src={imageUrl} />
          </AppTouchable>
        )}

        <AppTextInput style={{ width: '90%', height: hp(6.5), paddingHorizontal: wp(6), borderColor: '#F2F2F2', borderBottomWidth: 2, marginTop: hp(2), flexDirection: 'row-reverse', alignItems: 'center' }} textStyle={{ color: '#38488A', fontSize: wp(3.8), textAlign: 'right', textAlignVertical: 'top', fontFamily: R.fonts.fontFamily }} placeHolder={dictionary.full_name} onChange={(value) => setName(value)} value={name} />
        <AppTextInput style={{ width: '90%', height: hp(6.5), paddingHorizontal: wp(6), borderColor: '#F2F2F2', borderBottomWidth: 2, marginTop: hp(2), flexDirection: 'row-reverse', alignItems: 'center' }} textStyle={{ color: '#38488A', fontSize: wp(3.8), textAlign: 'right', fontFamily: R.fonts.fontFamily_faNum, textAlignVertical: 'top' }} placeHolder={dictionary.age} onChange={(value) => setAge(value)} value={age} />
        <AppView style={{ width: '90%', height: hp(6.5), paddingHorizontal: wp(6), borderColor: '#F2F2F2', borderBottomWidth: 2, marginTop: hp(2), flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppTextView style={{ flex: 2 }} textColor="#38488A" fontSize={wp(3.8)} text={dictionary.gender} />
          <AppView style={{ flex: 4 }}>
            <AppView style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around' }}>
              <AppView style={{ flexDirection: 'row-reverse', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                <AppTextView text={dictionary.female} textColor="#38488A" fontSize={wp(3.8)} />
                <AppTouchable
                  onClick={() => {
                    setGender('female');
                  }}
                  style={{ height: hp(2.8), width: hp(2.8), borderRadius: 15, borderWidth: 1, borderColor: '#939393', justifyContent: 'center', alignItems: 'center', marginRight: wp(1) }}
                >
                  {gender === 'female' && <AppView style={{ height: '70%', width: '70%', borderRadius: 7.5, backgroundColor: '#3ac248' }} />}
                </AppTouchable>
              </AppView>
              <AppView style={{ flexDirection: 'row-reverse', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                <AppTextView text={dictionary.male} textColor="#38488A" fontSize={wp(3.8)} />
                <AppTouchable
                  onClick={() => {
                    setGender('male');
                  }}
                  style={{ height: hp(2.8), width: hp(2.8), borderRadius: 15, borderWidth: 1, borderColor: '#939393', justifyContent: 'center', alignItems: 'center', marginRight: wp(1) }}
                >
                  {gender === 'male' && <AppView style={{ height: '70%', width: '70%', borderRadius: 7.5, backgroundColor: '#3ac248' }} />}
                </AppTouchable>
              </AppView>
            </AppView>
          </AppView>
        </AppView>
        <AppTouchable
          disabled={changePic}
          onClick={() => {
            UserApi.patchProfile({ name, gender })
              .then((res) => {
                console.log(res.data);
                AuthService.setUser(res.data);
                ToastMaster.makeText(dictionary.success_profile_update);
                closeModal();
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          style={{ height: hp(6.5), width: wp(76), backgroundColor: '#38488A', alignItems: 'center', justifyContent: 'center', borderRadius: hp(1.2), bottom: hp(8), position: 'absolute' }}
        >
          <AppTextView text={dictionary.update} fontSize={wp(3.8)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold, textAlign: 'center' }} />
        </AppTouchable>
      </AppView>
    </AppModal>
  );
}

export default React.memo(PatientProfileModal);
