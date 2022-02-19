import React from 'react';
import { ChatType } from 'api';
import AppView from '../components/base/app-view/AppView';
import { hp, wp } from '../helpers/responsive-screen';
import ModalHeader from '../components/composite/header/ModalHeader';
import AppTouchable from '../components/base/app-touchable/AppTouchable';
import AppImageView from '../components/base/app-image/app-imageview';
import AppTextView from '../components/base/app-text-view/AppTextView';
import * as DocumentPicker from 'expo-document-picker';
import R from '../assets/R';
import FileAsset from '../helpers/file-manager/FileAsset';
import AppModal from '../components/base/app-modal/AppModal';
import { openCameraPicker, openImagePicker } from '../helpers/FilePickers';

interface Props {
  onRequestClose: () => void;
  modalVisible: boolean;
  closeModal: () => void;
  onImagePicked: (file: FileAsset) => void;
  targetId: string;
  onFilePicked: (file: FileAsset) => void;
}
export default class ChatFilePickerModal extends React.Component<Props> {
  render() {
    const { onRequestClose, modalVisible, closeModal } = this.props;
    return (
      <AppModal onRequestClose={onRequestClose} animationType="slide" transparent={true} visible={modalVisible}>
        <AppView style={[{ height: hp(50), backgroundColor: '#FFFFFF', marginTop: hp(50), borderTopLeftRadius: hp(3), borderTopRightRadius: hp(3), alignItems: 'center', paddingHorizontal: '11.5%' }]}>
          <ModalHeader text="انتخاب فایل" color="#50BCBD" onClosePress={closeModal} />
          <AppTouchable
            onClick={() => {
              this.openGalleryImageSelector(closeModal);
            }}
            style={{ width: '100%', height: hp(9), borderColor: '#F2F2F2', borderBottomWidth: 2, flexDirection: 'row-reverse', alignItems: 'center', marginTop: hp(5) }}
          >
            <AppImageView resizeMode="contain" style={{ width: wp(8), height: wp(8), marginStart: wp(3) }} src={R.images.attachments.gallery} />
            <AppTextView fontSize={wp(3.8)} textColor="#38488A" text="گالری" />
          </AppTouchable>
          <AppTouchable
            onClick={() => {
              this.openCameraImageSelector(closeModal);
            }}
            style={{ width: '100%', height: hp(9), borderColor: '#F2F2F2', borderBottomWidth: 2, flexDirection: 'row-reverse', alignItems: 'center' }}
          >
            <AppImageView resizeMode="contain" style={{ width: wp(8), height: wp(8), marginStart: wp(3) }} src={R.images.attachments.image_camera} />
            <AppTextView fontSize={wp(3.8)} textColor="#38488A" text="دوربین" />
          </AppTouchable>
          <AppTouchable
            onClick={() => {
              this.openPDFPicker(closeModal);
            }}
            style={{ width: '100%', height: hp(9), borderColor: '#F2F2F2', borderBottomWidth: 2, flexDirection: 'row-reverse', alignItems: 'center' }}
          >
            <AppImageView resizeMode="contain" style={{ width: wp(8), height: wp(8), marginStart: wp(3) }} src={R.images.attachments.pdf} />
            <AppTextView fontSize={wp(3.8)} textColor="#38488A" text="PDF" />
          </AppTouchable>
        </AppView>
      </AppModal>
    );
  }

  private openPDFPicker = (closeModal) => {
    closeModal();
    DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      multiple: false,
      type: 'application/pdf',
    })
      .then(async (res) => {
        if (res.type === 'cancel') {
          return undefined;
        }
        if (res.file && res.file.type !== 'application/pdf') {
          // file is empty in mobile
          alert('Unsupported file type');
          return;
        }
        const file = await FileAsset.create(res.uri, { type: ChatType.PDF, size: res.size, fileName: res.name });
        file && this.props.onFilePicked(file);
      })
      .catch(console.log);
  };

  private openGalleryImageSelector = (closeModal) => {
    closeModal();
    openImagePicker().then((file) => {
      file && this.props.onImagePicked(file);
    });
  };

  private openCameraImageSelector = (closeModal) => {
    closeModal();
    openCameraPicker().then((file) => {
      file && this.props.onImagePicked(file);
    });
  };
}
interface ItemProps {
  width: number;
  height: number;
  text: string;
  img: number;
  flex: number;
  onSelected: () => void;
  close: () => void;
}
const Item = (props: ItemProps) => {
  const { flex, img, onSelected, text, height, width, close } = props;
  return (
    <AppTouchable
      style={{ flexDirection: 'column', flex, justifyContent: 'center', alignItems: 'center' }}
      onClick={() => {
        close();
        onSelected();
      }}
    >
      <AppImageView style={{ width, height }} src={img} />
      <AppTextView text={text} fontSize={14} />
    </AppTouchable>
  );
};
