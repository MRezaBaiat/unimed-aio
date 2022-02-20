import FileAsset from './file-manager/FileAsset';
import { ChatType } from 'api';
import MobileImagePicker from 'react-native-image-crop-picker';

export function openImagePicker(): Promise<FileAsset | undefined> {
  return MobileImagePicker.openPicker({
    multiple: false,
    maxFiles: 1,
    compressImageMaxWidth: 700,
    compressImageMaxHeight: 700,
    compressImageQuality: 0.5,
    mediaType: 'photo',
  })
    .then(async (res) => {
      return await FileAsset.create(res.path, { type: ChatType.IMAGE, mediaInfo: { width: res.width, height: res.height } });
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
}

export function openCameraPicker(): Promise<FileAsset | undefined> {
  return MobileImagePicker.openCamera({
    multiple: false,
    maxFiles: 1,
    compressImageQuality: 0.5,
    compressImageMaxWidth: 700,
    compressImageMaxHeight: 700,
    mediaType: 'photo',
  })
    .then(async (res) => {
      return await FileAsset.create(res.path, { type: ChatType.IMAGE, mediaInfo: { width: res.width, height: res.height } });
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
}
