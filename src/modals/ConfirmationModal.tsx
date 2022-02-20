import React, { useEffect, useState } from 'react';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import AppTextView from '../components/base/app-text-view/AppTextView';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import R from '../assets/R';
import AppModal from '../components/base/app-modal/AppModal';
import dictionary, { DictRecord } from '../assets/strings/dictionary';

interface Props {
  onRequestClose?: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  onConfirmClick: () => void;
  text: string | DictRecord;
  title: string | DictRecord;
}
function ConfirmationModal(props: Props) {
  const { onRequestClose, modalVisible, onConfirmClick, text, closeModal, title } = props;

  return (
    <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={modalVisible}>
      <AppView style={[{ height: hp(50), backgroundColor: '#FFFFFF', marginTop: hp(50), borderTopLeftRadius: 25, borderTopRightRadius: 25, alignItems: 'center' }]}>
        <ModalHeader color="#50BCBD" text={dictionary.end_visit} onClosePress={closeModal} />
        <AppTextView style={{ alignSelf: 'center', height: '30%', width: wp(76), marginTop: hp(6), lineHeight: hp(4.5) }} textColor="#38488A" fontSize={wp(3.8)} text={text} />
        <AppTouchable onClick={onConfirmClick} style={{ height: hp(6.5), width: wp(76), backgroundColor: '#38488A', alignItems: 'center', justifyContent: 'center', borderRadius: hp(1.2), bottom: hp(8), position: 'absolute' }}>
          <AppTextView text={dictionary.confirm} fontSize={wp(3.3)} style={{ color: '#FFFFFF', fontFamily: R.fonts.fontFamily_Bold }} />
        </AppTouchable>
      </AppView>
    </AppModal>
  );
}

export default React.memo(ConfirmationModal);
