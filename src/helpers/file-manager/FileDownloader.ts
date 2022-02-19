import * as FS from 'expo-file-system';
import AuthService from '../../services/AuthService';

const download = async (url: string, path: string, progressCB: (progress: number) => void): Promise<string> => {
  console.log(path);
  return FS.createDownloadResumable(
    url,
    path,
    {
      headers: {
        authorization: AuthService.getAuthorization(),
      },
    },
    (data) => {
      console.log('progress ' + (data.totalBytesWritten * 100) / data.totalBytesExpectedToWrite);
      progressCB(Math.trunc((data.totalBytesWritten * 100) / data.totalBytesExpectedToWrite));
    }
  )
    .downloadAsync()
    .then((res) => {
      return res.uri;
    });
};

export default {
  download,
};
