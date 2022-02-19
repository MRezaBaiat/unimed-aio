import React, { useEffect, useState } from 'react';
import { ChatType, IOStatus, Chat } from 'api';
import VoiceRowView from '../voice_row/VoiceHolderView';
import ImageHolderView from '../image_row/ImageHolderView';
import OthersHolderView from '../others_row/OthersHolderView';
import { Dimensions } from 'react-native';
import AppView from '../../../base/app-view/AppView';
import useFileAsset from '../../../../helpers/file-manager';

export const maxMediaWidth = (Dimensions.get('window').width * 60) / 100;

interface Props {
  chat: Chat;
  temporary: boolean;
}
function FileHolderView(props: Props) {
  const { chat, temporary } = props;

  const fileState = useFileAsset(chat, temporary);

  return <AppView style={{ paddingBottom: 7 }}>{fileState && rowFromType(chat.type, { chat, fileState })}</AppView>;
}

const rowFromType = (type: ChatType, props) => {
  switch (type) {
    case ChatType.MUSIC:
      return <VoiceRowView {...props} />;
    case ChatType.IMAGE:
      return <ImageHolderView {...props} />;
    case ChatType.PDF:
      return <OthersHolderView {...props} />;
  }
};

export default React.memo(FileHolderView);
