import AbstractFileSystem from './AbstractFileSystem';
import localForage from 'localforage';
import { generateNameFromUrl } from '../../helpers';
import MediaUtils from '../../helpers/MediaUtils';

interface FileItem {
  name: string;
  url: string;
  size: number;
  blob: Blob;
  lastModified: number;
  objectUrl: string;
}
export default class FileSystem extends AbstractFileSystem {
  private readonly storage: LocalForage;
  private itemsCache: { [key: string]: FileItem } = {};

  private getItem = async (addressOrUrl: string) => {
    const key = this.urlToAddress(addressOrUrl);
    let item = this.itemsCache[key];
    if (item) {
      return item;
    }
    item = await this.storage.getItem(key);
    if (!item) {
      return undefined;
    }
    this.itemsCache[key] = {
      ...item,
      objectUrl: URL.createObjectURL(item.blob),
    };
    return this.itemsCache[key];
  };

  constructor(cacheName: string) {
    super();
    this.storage = localForage.createInstance({
      name: cacheName,
      storeName: cacheName,
      driver: localForage.INDEXEDDB,
      version: 1.0,
    });
  }

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      this.storage.ready(resolve);
    });
    /* return storage.keys().then((list) => {
        this.urlsCache.push(...list.map(key => { return { key }; }));
      }); */
  }

  urlToAddress(url: string): string {
    if (url.startsWith('http')) {
      return 'key:/' + generateNameFromUrl(url);
    }
    if (!url.startsWith('blob:') && !url.startsWith('key:/')) {
      throw new Error('invalid url or key = ' + url);
    }
    return url;
  }

  async deleteFile(addressOrUrl: string): Promise<void> {
    const { storage } = this;
    const key = this.urlToAddress(addressOrUrl);
    const item = this.itemsCache[key];
    item && URL.revokeObjectURL(item.objectUrl);
    delete this.itemsCache[key];
    return storage.removeItem(key);
  }

  async exists(addressOrUrl: string): Promise<boolean> {
    return Boolean(await this.getItem(addressOrUrl));
  }

  async getFileInfo(addressOrUrl: string): Promise<{ exists: false } | { exists: true; size: number; path: string; lastModified: number; name: string; extension: string }> {
    const item = await this.getItem(addressOrUrl);
    if (!item) {
      return {
        exists: false,
      };
    }
    let extension;
    if (item.name) {
      extension = item.name.split('.').pop();
    }
    return {
      exists: true,
      size: item.size,
      path: item.objectUrl,
      lastModified: item.lastModified,
      name: item.name,
      extension,
    };
  }

  async purge(): Promise<void> {
    const { storage } = this;
    for (const key of Object.keys(this.itemsCache)) {
      await this.deleteFile(key);
    }
    this.itemsCache = {};
    return storage.clear();
  }

  async switchAddressUrl(fromAddressOrUrl: string, toUrl: string): Promise<string | undefined> {
    if (!toUrl.startsWith('http')) {
      throw new Error('destination must be a url');
    }
    const oldKey = this.urlToAddress(fromAddressOrUrl);
    const newKey = this.urlToAddress(toUrl);
    const item = await this.getItem(oldKey);
    if (!item) {
      return;
    }
    if (item.url === toUrl) {
      console.log('switch is not needed since urls match');
      return newKey;
    }
    item.url = toUrl;
    delete this.itemsCache[oldKey];
    this.itemsCache[newKey] = item;
    await this.storage.removeItem(oldKey);
    await this.storage.setItem(newKey, item);
    return newKey;
  }

  async storeDownloadedFile(object: any, url: string): Promise<string | undefined> {
    const { storage } = this;
    if (!object) {
      throw new Error('blob is undefined!');
    }
    const name = MediaUtils.getFileName(url);
    const key = this.urlToAddress(url);
    const item: FileItem = {
      blob: object,
      lastModified: Date.now(),
      name,
      size: object.size,
      url,
    };
    if (url.startsWith('blob:')) {
      this.itemsCache[key] = { ...item, objectUrl: url }; // no disk store object urls
    } else {
      await storage.setItem(key, item);
    }
    return key;
  }
}

export const TempFS = new FileSystem('temp-cache');
export const PersistentFS = new FileSystem('persistent-cache');
