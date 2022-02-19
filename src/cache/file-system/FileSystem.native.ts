import AbstractFileSystem from './AbstractFileSystem';
import * as FS from 'expo-file-system';
import { generateNameFromUrl } from '../../helpers';
import MediaUtils from '../../helpers/MediaUtils';
import RNFS from 'react-native-fs';

export default class FileSystem extends AbstractFileSystem {
  private readonly DIRECTORY: string;

  public constructor(cacheName: string) {
    super();
    this.DIRECTORY = `${FS.cacheDirectory}unimed/` + cacheName + '/';
  }

  async deleteFile(addressOrUrl: string): Promise<void> {
    return FS.deleteAsync(this.urlToAddress(addressOrUrl));
  }

  async exists(addressOrUrl: string): Promise<boolean> {
    return this.getFileInfo(addressOrUrl).then((r) => r.exists);
  }

  /* async get (url: string): Promise<string | undefined> {
      const info = await this.getFileInfo(this.urlToPath(url));
      return info.exists ? info.path : undefined;
    } */

  async getFileInfo(addressOrUrl: string): Promise<{ exists: false } | { exists: true; size: number; path: string; name: string; lastModified: number; extension: string }> {
    // @ts-ignore
    return FS.getInfoAsync(this.urlToAddress(addressOrUrl), { size: true, md5: false })
      .then((res) => {
        const fileName = res.exists && MediaUtils.getFileName(res.uri);
        let extension;
        if (fileName) {
          extension = fileName.split('.').pop();
        }
        return {
          size: res.size,
          path: res.uri,
          exists: res.exists,
          lastModified: res.modificationTime,
          name: fileName,
          extension,
        };
      })
      .catch(() => {
        return {
          exists: false,
        };
      });
  }

  async initialize(): Promise<void> {
    const dirInfo = await FS.getInfoAsync(this.DIRECTORY);
    if (!dirInfo.exists) {
      return FS.makeDirectoryAsync(this.DIRECTORY, { intermediates: true }).catch(console.log);
    }
  }

  async purge(): Promise<void> {
    await FS.deleteAsync(this.DIRECTORY, { idempotent: true }).catch(console.log);
    return this.initialize().catch(console.log);
  }

  urlToAddress(url: string): string {
    if (url.startsWith('http')) {
      return this.DIRECTORY + '/' + generateNameFromUrl(url);
    }
    return url;
  }

  async storeDownloadedFile(filePath: string, url: string): Promise<string | undefined> {
    return this.switchAddressUrl(filePath, url);
  }

  async switchAddressUrl(fromAddressOrUrl: string, toUrl: string): Promise<string | undefined> {
    console.log('switch from ', fromAddressOrUrl, toUrl);
    if (!toUrl.startsWith('http')) {
      throw new Error('destination must be a url');
    }
    const expectedPath = this.urlToAddress(toUrl);
    const currentPath = this.urlToAddress(fromAddressOrUrl);
    if (expectedPath === currentPath) {
      if (!(await this.exists(expectedPath))) {
        throw new Error('input path does not exist!');
      }
      console.log('switch is not needed since paths match');
      return expectedPath;
    }
    const currentInfo = await this.getFileInfo(currentPath);
    if (!currentInfo.exists) {
      console.error('path does not exists');
      return undefined;
    }

    const canMove = currentInfo.path.replaceAll('/', '-').replaceAll('\\', '-').includes(FS.cacheDirectory?.replaceAll('/', '-').replaceAll('\\', '-'));

    if (canMove) {
      console.log('moving from ' + currentPath + '\n to \n' + expectedPath);
      await FS.moveAsync({ from: currentPath, to: expectedPath });
    } else {
      console.log('copying from ' + currentPath + '\n to \n' + expectedPath);
      // await FS.copyAsync({ from: currentPath, to: expectedPath });
      await RNFS.copyFile(currentPath, expectedPath);
    }
    FS.getInfoAsync(currentPath).then((res) => {
      console.log('before', res.isDirectory);
    });
    FS.getInfoAsync(expectedPath).then((res) => {
      console.log('after', res.isDirectory);
    });
    const info = await this.getFileInfo(expectedPath);
    if (!info.exists || info.size !== currentInfo.size) {
      console.log('move or copy failed , returning the old path');
      return currentPath;
    }
    console.log('from', currentPath, expectedPath);
    return expectedPath;
  }
}
export const TempFS = new FileSystem('temp-cache');
export const PersistentFS = new FileSystem('persistent-cache');
