import { Chat, ChatType, IOStatus } from 'api';
import { isBase64, mimeFromChatType } from '../index';
import Kit, { JobManager, throttle } from 'javascript-dev-kit';
import { Platform } from 'react-native';
import BlobDownloader from './BlobDownloader';
import FileDownloader from './FileDownloader';
import BlobUploader from './BlobUploader';
import FileUploader from './FileUploader';
import FileSystem from '../../cache/file-system/FileSystem';
import axios from 'axios';

const cache: { [key: string]: FileAsset } = {}; // if this grows , we could put a timeout for this cache;

const createCacheKey = (address: string, temporary?: boolean) => {
  return `${address}-${Boolean(temporary)}`;
};

const workerFactory = JobManager.initFactory('download-factory', { capacity: Number.MAX_SAFE_INTEGER, maxCapPolicy: 'drop_oldest' });
// const uploadFactory = JobManager.initFactory('upload-factory', { capacity: Number.MAX_SAFE_INTEGER, maxCapPolicy: 'drop_oldest' });
const TAG = '[file-asset]';
export interface ConfigsProps {
  type: ChatType;
  fileName?: string | undefined;
  size?: number | undefined;
  mediaInfo?: MediaInfoType;
  temporary?: boolean;
  url?: string;
}
export interface FileAssetState {
  mediaInfo: MediaInfoType;
  exists: boolean;
  path: string;
  name: string;
  state: IOStatus;
  progress: number;
  size: number;
  expectedSize: number;
  source: FileAsset;
}
type MediaInfoType = { width?: number; height?: number; duration?: number; orientation?: number };
type EventType = 'state-change';
export default class FileAsset {
  public readonly type: ChatType;
  private readonly address: string;
  private readonly expectedSize: number;
  private readonly fileName: string;
  private readonly temporary: boolean;
  private url?: string;
  // private isAvailable: boolean;
  private mediaInfo?: MediaInfoType;
  private eventListeners: { event: EventType; cb: (state: FileAssetState) => void }[] = [];
  private downloadFailed = false;
  private state: IOStatus = IOStatus.READY;
  private progress = 0;

  private constructor(address: string, fileName: string, type: ChatType, size: number, isAvailable: boolean, temporary: boolean | undefined, url?: string, mediaInfo?: MediaInfoType) {
    this.address = address;
    this.type = type;
    this.expectedSize = size && Number(size);
    this.fileName = fileName;
    // this.isAvailable = isAvailable;
    this.temporary = Boolean(temporary);
    this.mediaInfo = mediaInfo;
    this.url = url;
    // this.state = isAvailable ? 'READY' : 'WAITING_FOR_DOWNLOAD';
    cache[createCacheKey(address, temporary)] = this;
    /* if (this.state === 'WAITING_FOR_DOWNLOAD') {
        this.download();
      } */
  }

  public static async create(addressOrObject: string | Blob | Chat, config: ConfigsProps): Promise<FileAsset | undefined> {
    // const available = config.temporary ? await TempCache.getFilePath(chat) : await PersistentCache.getFilePath(chat);
    if (!addressOrObject) {
      //  || !config.type
      console.log('no path was provided');
      return undefined;
    }

    if (typeof addressOrObject === 'string') {
      const fromCache = cache[createCacheKey(addressOrObject, config.temporary)];
      if (fromCache) {
        return fromCache;
      }
      if (isBase64(addressOrObject)) {
        return fetch(addressOrObject)
          .then((r) => r.blob())
          .then((b) => {
            return FileAsset.create(b, config);
          });
      }
      if (addressOrObject.startsWith('blob://')) {
        throw new Error('do not provide a object url here'); // or fetch the blob?
      }
      if (addressOrObject.startsWith('http')) {
        const address = FileSystem.getFileSystem(config.temporary).urlToAddress(addressOrObject);
        return FileAsset.create(address, { ...config, url: addressOrObject });
      }
      const fileInfo = await FileSystem.getFileSystem(config.temporary).getFileInfo(addressOrObject);
      if (!fileInfo.exists && !config.size) {
        console.log(TAG, 'neither exists or has size');
        return undefined;
      }
      if (!fileInfo.exists && !config.url) {
        console.log(TAG, 'neither exists or has url');
        return undefined;
      }

      if ((!config.size || !config.fileName) && fileInfo.exists && Platform.OS !== 'web') {
        if (!config.size) {
          config.size = fileInfo.size;
        }
        if (!config.fileName) {
          config.fileName = fileInfo.name;
        }
      }
      if (!config.size || !config.fileName) {
        console.log(TAG, 'couldnt find name and/or size');
        return undefined;
      }
      const exists = fileInfo.exists && fileInfo.size === (config.size || fileInfo.size);
      return new FileAsset(addressOrObject, config.fileName || fileInfo.name, config.type, config.size || fileInfo.size, exists, config.temporary, config.url, config.mediaInfo);
    } else if (addressOrObject instanceof Blob) {
      const objectUrl = URL.createObjectURL(addressOrObject);
      const address = await FileSystem.getFileSystem(config.temporary).storeDownloadedFile(addressOrObject, objectUrl);
      if (!address) {
        return undefined;
      }
      const name = config.fileName || Kit.generateUUID();
      return FileAsset.create(address, { ...config, fileName: name, url: objectUrl, size: addressOrObject.size });
      // return new FileAsset(address, name, config.type, addressOrObject.size, true, config.temporary, config.url, config.mediaInfo);
    } else if (addressOrObject.id && addressOrObject.type) {
      if (addressOrObject.localFile) {
        return addressOrObject.localFile;
      }
      return FileAsset.create(addressOrObject.url, {
        ...config,
        size: config.size || addressOrObject.fileSize,
        fileName: config.fileName || addressOrObject.fileName,
        mediaInfo: config.mediaInfo || addressOrObject.mediaInfo,
        url: config.url || addressOrObject.url,
      });
    }
    console.log(TAG, 'none matched for ', addressOrObject);
    return undefined;
  }

  private changeState = (state: IOStatus, progress = 0) => {
    this.state = state;
    this.progress = progress;
    throttle('file-asset-change-state-' + (this.address || this.url), 50, { policy: 'replace' }, () => {
      // removing this will cause address switching issues
      this.notifyListeners('state-change');
    });
    // return this.notifyListeners('state-change');
  };

  private exists = async (info?) => {
    const { temporary, address, expectedSize } = this;
    if (!info) {
      info = await FileSystem.getFileSystem(temporary).getFileInfo(address);
    }
    if (expectedSize) {
      return info.exists && info.size === expectedSize;
    }
    return info.exists;
  };

  public get = async (): Promise<FileAssetState> => {
    const { temporary, address, mediaInfo, fileName, expectedSize, state } = this;
    const info = await FileSystem.getFileSystem(temporary).getFileInfo(address);
    const exists = await this.exists(info);
    if (!exists) {
      await this.download();
    }
    if (info.exists && expectedSize !== info.size && state !== 'DOWNLOADING' && state !== 'IN_DOWNLOAD_QUEUE' && state !== 'WAITING_FOR_DOWNLOAD') {
      console.warn(TAG, 'warning, expected size was different from real size ' + info.size + ' vs ' + expectedSize);
    }
    return {
      expectedSize,
      size: info.exists ? info.size : -1,
      source: this,
      exists,
      mediaInfo: mediaInfo || {},
      name: fileName,
      path: info.path,
      progress: this.progress,
      state: this.state,
    };
  };

  /* private getState = (): FileState => {
      return {
        file: this,
        state: this.state,
        progress: this.progress
      };
    }; */

  private notifyListeners = async (event: EventType) => {
    if (event === 'state-change') {
      const state = await this.get();
      this.eventListeners.forEach((eventListeners) => {
        if (eventListeners.event === event) {
          eventListeners.cb(state);
        }
      });
    }
  };

  public on = (event: EventType, cb: (state: FileAssetState) => void) => {
    if (!this.eventListeners.find((l) => l.event === event && l.cb === cb)) {
      this.eventListeners.push({ event, cb });
    }
  };

  public off = (event: EventType, cb: (state: FileAssetState) => void) => {
    const listener = this.eventListeners.find((l) => l.event === event && l.cb === cb);
    listener && this.eventListeners.splice(this.eventListeners.indexOf(listener), 1);
  };

  public cancelUpload = () => {};

  public cancelDownload = () => {};

  public forceDownload = () => {
    this.downloadFailed = false;
    this.get();
  };

  private download = async () => {
    const { url, temporary, address, type, state, changeState, downloadFailed } = this;
    if (downloadFailed) {
      console.log(TAG, 'download rejected, did fail already');
      return;
    }
    if (await this.exists()) {
      // could happens some times , for example when some of file is downloaded and not yet fully downloaded , or some delay in storing in file system
      return;
    }
    if (!url) {
      throw new Error('no url is provided!');
    }
    if (state === IOStatus.DOWNLOADING || state === IOStatus.UPLOADING || state === IOStatus.IN_DOWNLOAD_QUEUE || state === IOStatus.IN_UPLOAD_QUEUE) {
      console.log(TAG, 'download rejected, state=' + state);
      return;
    }

    changeState(IOStatus.IN_DOWNLOAD_QUEUE);

    workerFactory.schedule(async () => {
      if (await this.exists()) {
        console.log('already exists , no need to re download');
        return changeState(IOStatus.READY);
      }
      changeState(IOStatus.DOWNLOADING);

      const listener = (progress: number) => {
        changeState(IOStatus.DOWNLOADING, progress);
      };

      const onErr = (err) => {
        this.downloadFailed = true;
        console.log(TAG, url, err);
        changeState(IOStatus.WAITING_FOR_DOWNLOAD);
      };

      if (Platform.OS === 'web') {
        await BlobDownloader.download(url, listener)
          .then(async (blob: Blob) => {
            blob = blob.slice(0, blob.size, mimeFromChatType(type));
            await FileSystem.getFileSystem(temporary).storeDownloadedFile(blob, url);
            changeState(IOStatus.READY);
          })
          .catch(onErr);
      } else {
        await FileDownloader.download(url, address, listener)
          .then(async (path) => {
            await FileSystem.getFileSystem(temporary).storeDownloadedFile(path, url);
            changeState(IOStatus.READY);
          })
          .catch(onErr);
      }
    });
  };

  public upload = async (chatId: string, visitId: string, targetUrl = axios.defaults.baseURL + '/api/chatfiles'): Promise<string | undefined> => {
    console.log(targetUrl);
    const { state, fileName, address, type, mediaInfo, temporary, changeState } = this;
    const info = await FileSystem.getFileSystem(temporary).getFileInfo(address);
    if (!(await this.exists(info))) {
      console.log('file no longer exists for upload');
      return;
    }
    const path = (info.exists && info.path) || '';
    if (!targetUrl) {
      throw new Error('no url is provided!');
    }
    if (state === IOStatus.DOWNLOADING || state === IOStatus.UPLOADING || state === IOStatus.IN_DOWNLOAD_QUEUE || state === IOStatus.IN_UPLOAD_QUEUE) {
      return;
    }

    changeState(IOStatus.IN_UPLOAD_QUEUE);

    return new Promise((resolve) => {
      workerFactory.schedule(async () => {
        if (!(await this.exists())) {
          console.log('file no longer exists');
          changeState(IOStatus.WAITING_FOR_DOWNLOAD);
          return resolve(undefined);
        }
        changeState(IOStatus.UPLOADING);

        const listener = (progress: number) => {
          changeState(IOStatus.UPLOADING, progress);
        };

        const onThen = async (url: string) => {
          console.log('url changed from ' + this.url + ' to ' + url);
          this.url = url;
          const newAddress = await FileSystem.getFileSystem(temporary).switchAddressUrl(address, url);
          if (newAddress) {
            const oldCacheKey = createCacheKey(address, temporary);
            const newCacheKey = createCacheKey(newAddress, temporary);
            cache[newCacheKey] = this;
            this.address = newAddress;
            delete cache[oldCacheKey];
            console.log('address changed from ' + oldCacheKey + ' to ' + newCacheKey);
          }
          changeState(IOStatus.READY);
          resolve(url);
        };

        const onErr = (err) => {
          console.log(TAG, err);
          changeState(IOStatus.WAITING_FOR_UPLOAD);
          resolve(undefined);
        };

        if (Platform.OS === 'web') {
          await BlobUploader.upload(targetUrl, path, fileName, type, chatId, visitId, mediaInfo, listener).then(onThen).catch(onErr);
        } else {
          await FileUploader.upload(targetUrl, path, fileName, type, chatId, visitId, mediaInfo, listener).then(onThen).catch(onErr);
        }
      });
    });
  };
}
