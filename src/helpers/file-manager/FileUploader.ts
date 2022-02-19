import AuthService from '../../services/AuthService';
import { ChatType } from 'api';
import { mimeFromChatType } from '../index';
import axios from 'axios';

const upload = async (url: string, path: string, fileName: string, type: ChatType, chatId: string, visitId: string, mediaInfo, progressCB: (progress: number) => void) => {
  fileName = fileName.split('.')[0];
  const formData = new FormData();
  formData.append('file', {
    uri: path,
    type: mimeFromChatType(type),
    name: fileName,
  });
  return axios
    .post(url, formData, {
      headers: {
        type: type,
        id: chatId,
        mediainfo: JSON.stringify(mediaInfo || {}),
        roomid: visitId,
        authorization: AuthService.getAuthorization(),
        filename: encodeURIComponent(fileName),
      },
      onUploadProgress: (event) => {
        progressCB(Math.round((100 * event.loaded) / event.total));
      },
    })
    .then((res) => res.data);
};

export default {
  upload,
};
