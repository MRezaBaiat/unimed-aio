import axios from 'axios';
import AuthService from '../../services/AuthService';

const download = async (url: string, progressCB: (progress: number) => void): Promise<Blob> => {
  return axios
    .get(url, {
      responseType: 'blob',
      method: 'GET',
      headers: {
        authorization: AuthService.getAuthorization(),
      },
      onDownloadProgress: (progressEvent) => {
        progressCB(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      },
    })
    .then(async (res) => {
      return res.data;
    });
};

export default {
  download,
};
