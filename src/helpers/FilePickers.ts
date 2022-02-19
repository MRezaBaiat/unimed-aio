import FileAsset from './file-manager/FileAsset';
import * as WebImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker/src/ImagePicker.types';
import { ChatType } from 'api';

export function openImagePicker(): Promise<FileAsset | undefined> {
  return WebImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    mediaTypes: MediaTypeOptions.Images,
    quality: 0.5,
  })
    .then(async (res) => {
      if (res.cancelled) {
        return undefined;
      }
      return await FileAsset.create(res.uri, { type: ChatType.IMAGE, mediaInfo: { width: res.width, height: res.height } });
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
}

export function openCameraPicker(): Promise<FileAsset | undefined> {
  return WebImagePicker.launchCameraAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    mediaTypes: MediaTypeOptions.Images,
    quality: 0.5,
  })
    .then(async (res) => {
      if (res.cancelled) {
        return undefined;
      }
      return await FileAsset.create(res.uri, { type: ChatType.IMAGE, mediaInfo: { width: res.width, height: res.height } });
    })
    .catch((e) => {
      console.log(e);
      return undefined;
    });
}
