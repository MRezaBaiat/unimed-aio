import axios from 'axios';
import AuthService from '../../services/AuthService';
import { ChatType } from 'api';
import { mimeFromChatType } from '../index';

const upload = async (url: string, blob: Blob | string, fileName: string, type: ChatType, chatId: string, visitId: string, mediaInfo, progressCB: (progress: number) => void) => {
  fileName = fileName.split('.')[0];
  if (typeof blob === 'string') {
    blob = await fetch(blob).then((r) => r.blob());
  }
  const formData = new FormData();
  const mime = blob.type || mimeFromChatType(type);
  const extension = mime.split('/')[1];
  const file = new File([blob], `${Date.now()}.${extension}`, {
    type: mime,
  });
  formData.append('file', file);
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
      onUploadProgress: (progressEvent) => {
        progressCB && progressCB(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      },
    })
    .then((res) => res.data);
};

export default {
  upload,
};
