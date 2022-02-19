import React, { useEffect, useState } from 'react';
import { Modal, Keyboard, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { User } from 'api';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import AppTextView from '../components/base/app-text-view/AppTextView';
import R from '../assets/R';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import { actionSetLang } from '../redux/actions/users_actions';
import store from '../redux/Store';
import dictionary, { DictRecord } from '../assets/strings/dictionary';
import AppModal from '../components/base/app-modal/AppModal';

interface Props {
  onRequestClose?: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  title: string | DictRecord;
}
function LanguageSetModal(props: Props) {
  const { onRequestClose, modalVisible, closeModal, title } = props;

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={modalVisible}>
      <AppView
        style={[
          {
            height: hp(50),
            backgroundColor: '#FFFFFF',
            marginTop: hp(50),
            borderTopLeftRadius: hp(3),
            borderTopRightRadius: hp(3),
            alignItems: 'center',
          },
        ]}
      >
        <AppTextView
          style={{
            fontFamily: R.fonts.fontFamily_Bold,
            marginTop: hp(5),
            marginRight: wp(12),
            alignSelf: 'flex-end',
          }}
          textColor="#50BCBD"
          fontSize={wp(3.8)}
          text={title}
        />
        <AppTouchable
          onClick={() => {
            store.dispatch(actionSetLang('fa'));
            closeModal();
          }}
          style={{
            width: wp(76),
            height: hp(8),
            borderColor: '#F2F2F2',
            borderBottomWidth: 2,
            marginTop: hp(2),
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <AppTextView style={{ fontSize: wp(3.8), color: '#38488A' }} text={dictionary.persian} />
        </AppTouchable>
        <AppTouchable
          onClick={() => {
            store.dispatch(actionSetLang('en'));
            closeModal();
          }}
          style={{
            width: wp(76),
            height: hp(5),
            borderColor: '#F2F2F2',
            marginTop: hp(2),
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}
        >
          <AppTextView style={{ fontSize: wp(3.8), color: '#38488A' }} text={dictionary.english} />
        </AppTouchable>
        <AppTouchable
          onClick={closeModal}
          style={{
            height: hp(6.5),
            width: wp(76),
            marginTop: hp(3),
            borderRadius: hp(1.2),
            bottom: hp(8),
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#50BCBD',
            borderWidth: 1,
          }}
        >
          <AppTextView text={dictionary.cancel} fontSize={wp(3.8)} style={{ color: '#50BCBD', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
    </AppModal>
  );
}

export default React.memo(LanguageSetModal);
