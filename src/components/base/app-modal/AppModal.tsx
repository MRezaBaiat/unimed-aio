import React from 'react';
import { Modal, ModalProps } from 'react-native';

function AppModal(props: ModalProps & { children?: any }) {
  return <Modal {...props}>{props.children}</Modal>;
}

export default React.memo(AppModal);
