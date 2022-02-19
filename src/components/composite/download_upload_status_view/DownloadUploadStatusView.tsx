import React, { useEffect, useState } from 'react';
import { IOStatus, Chat } from 'api';
import { actionDeleteChat } from '../../../redux/actions/chat_actions';
import store from '../../../redux/Store';
import AppView from '../../base/app-view/AppView';
import AppTouchable from '../../base/app-touchable/AppTouchable';
import AppTextView from '../../base/app-text-view/AppTextView';
import AppImageButton from '../../base/app-image-button/AppImageButton';
import R from '../../../assets/R';
import FileAsset, { FileAssetState } from '../../../helpers/file-manager/FileAsset';

interface Props {
  fileState: FileAssetState;
  chat: Chat;
  style?: any;
}
function DownloadUploadStatusView(props: Props) {
  const { fileState, style, chat } = props;

  const cancelUploadDownload = () => {
    if (fileState.state === IOStatus.UPLOADING || fileState.state === IOStatus.WAITING_FOR_UPLOAD) {
      fileState.source.cancelUpload();
      store.dispatch(actionDeleteChat(chat.id));
    } else {
      fileState.source.cancelDownload();
    }
  };

  const upload = () => {
    const { chat } = props;
    fileState.source.upload(chat.id, store.getState().userReducer.status.visit._id);
  };

  const download = () => {
    fileState.source.forceDownload();
  };

  return (
    <AppView style={style}>
      {(fileState.state === IOStatus.DOWNLOADING || fileState.state === IOStatus.UPLOADING || fileState.state === IOStatus.IN_UPLOAD_QUEUE || fileState.state === IOStatus.IN_DOWNLOAD_QUEUE) && <ProgressingButton progress={fileState.progress} onPress={cancelUploadDownload} />}
      {fileState.state === IOStatus.WAITING_FOR_DOWNLOAD && <ActionButton action={'download'} onPress={download} />}
      {fileState.state === IOStatus.WAITING_FOR_UPLOAD && <ActionButton action={'upload'} onPress={upload} />}
    </AppView>
  );
}

const ActionButton = ({ action, onPress }) => {
  return <AppImageButton style={{ width: 50, height: 50 }} src={action === 'upload' ? R.images.icons.upload_icon : R.images.icons.download_icon} onClick={onPress} />;
};

const ProgressingButton = ({ progress, onPress }) => {
  return (
    <AppTouchable onClick={onPress} style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', padding: 7, backgroundColor: '#D3D3D3BF', borderRadius: 100 }}>
      <AppTextView text={progress + ' %'} />
    </AppTouchable>
  );
};

export default React.memo(DownloadUploadStatusView);
