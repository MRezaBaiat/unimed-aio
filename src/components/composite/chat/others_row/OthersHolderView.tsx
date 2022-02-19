import React, { useEffect, useState } from 'react';
import { Chat, ChatType, IOStatus } from 'api';
import { Linking, Modal, Platform, View } from 'react-native';
import DownloadUploadStatusView from '../../download_upload_status_view/DownloadUploadStatusView';
import SendStatusView from '../../send_status_view/SendStatusView';
import { getMyUserId, openViewer } from '../../../../helpers';
import AppView from '../../../base/app-view/AppView';
import { hp, wp } from '../../../../helpers/responsive-screen';
import AppTouchable from '../../../base/app-touchable/AppTouchable';
import AppImageView from '../../../base/app-image/app-imageview';
import AppTextView from '../../../base/app-text-view/AppTextView';
import R from '../../../../assets/R';
import { FileAssetState } from '../../../../helpers/file-manager/FileAsset';
import * as FS from 'expo-file-system';
import AppImageButton from '../../../base/app-image-button/AppImageButton';
import AppModal from '../../../base/app-modal/AppModal';
const PDFView = Platform.OS === 'web' ? undefined : require('react-native-view-pdf').default;

interface Props {
  chat: Chat;
  fileState: FileAssetState;
}
function OthersHolderView(props: Props) {
  const { chat, fileState } = props;
  const isSentByUser = chat.sender === getMyUserId();
  const [modalOpen, setModalOpen] = useState(undefined as string | undefined);
  return (
    <View style={{ alignItems: isSentByUser ? 'flex-end' : 'flex-start' }}>
      <AppView style={{ marginVertical: hp(0.5), paddingTop: hp(1), paddingBottom: hp(0.5), marginHorizontal: hp(1), alignItems: isSentByUser ? 'flex-end' : 'flex-start', ...(isSentByUser ? styles.sender : styles.receiver) }}>
        {fileState.exists && (
          <AppTouchable
            style={{ alignItems: isSentByUser ? 'flex-end' : 'flex-start' }}
            onClick={() => {
              if (Platform.OS === 'web') {
                openViewer(fileState.path);
              } else {
                FS.getContentUriAsync(fileState.path)
                  .then((uri) => {
                    setModalOpen(uri);
                  })
                  .catch(console.warn);
              }
            }}
          >
            <AppView style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <AppImageView src={imageFromType(chat.type)} style={{ width: wp(5), height: wp(6) }} />
              <AppTextView style={{ marginHorizontal: hp(4), maxWidth: wp(32), fontSize: wp(3), textAlign: isSentByUser ? 'right' : 'left' }} text={chat.fileName} textColor={'#38488A'} />
            </AppView>
          </AppTouchable>
        )}
        <SendStatusView sendStatus={chat.sender === getMyUserId() && chat.sendStatus} date={chat.createdAt} style={{ flexDirection: 'row-reverse', height: hp(3), alignItems: 'flex-start', marginTop: hp(0.2) }} />
        {fileState.state !== IOStatus.READY && <DownloadUploadStatusView chat={chat} fileState={fileState} />}
      </AppView>
      {Platform.OS !== 'web' && (
        <AppModal visible={Boolean(modalOpen)} onRequestClose={() => setModalOpen(undefined)}>
          <AppImageButton style={{ width: 55, height: 55, backgroundColor: 'black', position: 'absolute', top: '2%', left: '2%', zIndex: 1000 }} src={R.images.icons.back} imageStyle={{ width: 15, height: 25 }} onClick={() => setModalOpen(undefined)} />
          <PDFView fadeInDuration={250.0} style={{ flex: 1 }} resource={modalOpen} resourceType={'url'} onError={(error) => console.log('Cannot render PDF', error)} />
        </AppModal>
      )}
    </View>
  );
}

const imageFromType = (chatType: ChatType) => {
  return R.images.attachments.pdf;
};

const styles = {
  sender: {
    borderTopLeftRadius: hp(1.2),
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: 0,
    backgroundColor: '#C6E4FF',
    color: '#38488A',
    paddingHorizontal: hp(2),
    maxWidth: wp(60),
    maxHeight: hp(15),
  },
  receiver: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: hp(1.2),
    borderBottomLeftRadius: hp(1.2),
    borderBottomRightRadius: hp(1.2),
    backgroundColor: '#F2F2F2',
    color: '#4F4F4F',
    paddingHorizontal: hp(2),
    maxWidth: wp(60),
    maxHeight: hp(15),
  },
};

export default React.memo(OthersHolderView);
