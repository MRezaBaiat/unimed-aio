import React, { useEffect, useState } from 'react';
import { Modal, Keyboard, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import AppView from '../components/base/app-view/AppView';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppTextView from '../components/base/app-text-view/AppTextView';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import { hp, wp } from '../helpers/responsive-screen';
import R from '../assets/R';
import AppModal from '../components/base/app-modal/AppModal';
import dictionary, { DictRecord } from '../assets/strings/dictionary';

interface Props {
  onRequestClose?: () => void;
  modalVisible: boolean;
  onConfirmClick: () => void;
  onCancelClick: () => void;
  text: string | DictRecord;
  title: string | DictRecord;
}
function DoctorPostVisitModal(props: Props) {
  const { onRequestClose, onConfirmClick, text, title, onCancelClick } = props;

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={true}>
      <AppView style={[{ height: hp(45), backgroundColor: '#FFFFFF', marginTop: hp(55), borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center' }]}>
        <ModalHeader closeBtn={true} color="#50BCBD" text={dictionary.receive_visit_payment} />
        <AppTextView style={{ alignSelf: 'center', height: '25%', width: wp(76), marginTop: hp(6), lineHeight: hp(4.5) }} textColor="#38488A" fontSize={wp(3.8)} text={text} />
        <AppTouchable onClick={onConfirmClick} style={{ height: hp(6.5), width: wp(76), backgroundColor: '#50BCBD', alignItems: 'center', justifyContent: 'center', borderRadius: hp(1.2) }}>
          <AppTextView text={dictionary.yes} fontSize={wp(3.3)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
        <AppTouchable onClick={onCancelClick} style={{ height: hp(6.5), width: wp(76), marginTop: hp(2), backgroundColor: '#BDBDBD', alignItems: 'center', justifyContent: 'center', borderRadius: hp(1.2) }}>
          <AppTextView text={dictionary.no} fontSize={wp(3.3)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
    </AppModal>
  );
}

export default React.memo(DoctorPostVisitModal);
