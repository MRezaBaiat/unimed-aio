import { Chat, IOStatus } from 'api';
import React, { useState } from 'react';
import { getMyUserId, openViewer } from '../../../../helpers';
import { Dimensions, Modal, View, Image } from 'react-native';
import { maxMediaWidth } from '../file_row/FileHolderView';
import R from '../../../../assets/R';
import AppView from '../../../base/app-view/AppView';
import { hp, wp } from '../../../../helpers/responsive-screen';
import AppTouchable from '../../../base/app-touchable/AppTouchable';
import AppImageView from '../../../base/app-image/app-imageview';
import SendStatusView from '../../send_status_view/SendStatusView';
import AppImageButton from '../../../base/app-image-button/AppImageButton';
import DownloadUploadStatusView from '../../download_upload_status_view/DownloadUploadStatusView';
import ImageViewer from 'react-native-image-zoom-viewer';
import { FileAssetState } from '../../../../helpers/file-manager/FileAsset';
import AppModal from '../../../base/app-modal/AppModal';

interface Props {
  chat: Chat;
  fileState: FileAssetState;
}
function ImageHolderView(props: Props) {
  const { chat, fileState } = props;
  const width = chat.mediaInfo.width;
  const scale = maxMediaWidth / width;
  const height = chat.mediaInfo.height;
  const [modalVisible, setModalVisible] = useState(false);

  const isSentByUser = chat.sender === getMyUserId();

  return (
    <AppView style={{ minWidth: 100, alignItems: isSentByUser ? 'flex-end' : 'flex-start' }}>
      <AppView style={{ marginTop: hp(0.5), marginHorizontal: hp(1.5), ...(isSentByUser ? styles.sender : styles.receiver) }}>
        <AppView style={{ width: wp(50), height: wp(50), alignItems: 'center', justifyContent: 'center' }}>
          {fileState.exists && (
            <AppTouchable
              style={{ width: '98%', height: '98%' }}
              onClick={() => {
                // openViewer(file);
                setModalVisible(true);
              }}
            >
              <AppImageView resizeMode="cover" src={fileState.path} style={{ width: '100%', height: '100%', borderRadius: hp(0.7) }} />
              <SendStatusView sendStatus={chat.sender === getMyUserId() && chat.sendStatus} date={chat.date} style={{ flexDirection: 'row-reverse', position: 'absolute', bottom: '1%', width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', height: hp(3), alignItems: 'center', paddingHorizontal: wp(1) }} />
            </AppTouchable>
          )}
          {fileState.state !== IOStatus.READY && <DownloadUploadStatusView style={{ position: 'absolute' }} chat={chat} fileState={fileState} />}
        </AppView>
      </AppView>
      <AppModal
        visible={modalVisible}
        presentationStyle={'fullScreen'}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <AppImageButton
          style={{ width: 55, height: 55, backgroundColor: 'black', position: 'absolute', top: '2%', left: '2%', zIndex: 1000 }}
          src={R.images.icons.back}
          imageStyle={{ width: 15, height: 25 }}
          onClick={() => {
            setModalVisible(false);
          }}
        />
        <ImageViewer imageUrls={[{ url: fileState.path }]} renderIndicator={() => null} />
        {/* <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height}>
          <AppImageView resizeMode={'contain'} style={{ width: '100%', height: '100%' }} src={path} />
        </ImageZoom> */}
      </AppModal>
    </AppView>
  );
}

const styles = {
  sender: {
    borderTopLeftRadius: hp(1.2),
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: 0,
    backgroundColor: '#C6E4FF',
    color: '#38488A',
    padding: hp(0.5),
    maxWidth: wp(60),
  },
  receiver: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: hp(1.2),
    backgroundColor: '#F2F2F2',
    color: '#4F4F4F',
    padding: hp(0.5),
    maxWidth: wp(60),
  },
};

export default React.memo(ImageHolderView);
