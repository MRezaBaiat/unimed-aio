import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import UserApi from '../../network/UserApi';
import ModalHeader from '../../components/composite/header/ModalHeader';
import AppView from '../../components/base/app-view/AppView';
import AppTextView from '../../components/base/app-text-view/AppTextView';
import AppModal from '../../components/base/app-modal/AppModal';
import dictionary from '../../assets/strings/dictionary';

interface Props {
  closeModal: () => void;
  tcModalVisible: boolean;
}
function TermsAndConditionsModal(props: Props) {
  const { closeModal, tcModalVisible } = props;
  const [tc, setTC] = useState<string>('');
  useEffect(() => {
    UserApi.getTermsAndConditions()
      .then((res) => {
        setTC(res.data);
      })
      .catch(console.log);
  });
  return (
    <AppModal animationType="slide" visible={tcModalVisible}>
      <ModalHeader
        text={dictionary.terms_and_conditions}
        onClosePress={() => {
          closeModal();
        }}
      />
      <ScrollView>
        <AppView style={{ padding: 10 }}>
          <AppTextView style={{ textAlign: 'right' }} text={tc} />
        </AppView>
      </ScrollView>
    </AppModal>
  );
}

export default React.memo(TermsAndConditionsModal);
