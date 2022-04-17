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
import ModalHeader from '../components/composite/header/ModalHeader';

interface Props {
  onRequestClose: () => void;
}
export function WhatsAppPayModal(props: Props) {
  const { onRequestClose } = props;

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={false} visible={true}>
      <ModalHeader text={dictionary.pay_for_visit} closeColor="darkBlue" onClosePress={onRequestClose} />
      <AppView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
        <AppTextView fontSize={wp(5)} textAlign={'center'} text={dictionary.whatsapp_pay} />
      </AppView>
    </AppModal>
  );
}
