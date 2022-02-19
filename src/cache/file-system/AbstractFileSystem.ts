import FileSystem, { PersistentFS, TempFS } from './FileSystem';

export default abstract class AbstractFileSystem {
  public abstract exists(pathOrUrl: string): Promise<boolean>;
  public abstract getFileInfo(pathOrUrl: string): Promise<{ exists: false } | { exists: true; size: number; name: string; path: string; lastModified: number; extension: string }>;
  public abstract storeDownloadedFile(object: any, url: string): Promise<string | undefined>;
  // public abstract async readFile(pathOrUrl: string): Promise<string | undefined>;
  public abstract initialize(): Promise<void>;
  public abstract purge(): Promise<void>;
  public abstract deleteFile(pathOrUrl: string): Promise<void>;
  public abstract switchAddressUrl(fromAddressOrUrl: string, toUrl: string): Promise<string | undefined>;
  // public abstract async get(url: string): Promise<string | undefined>
  public abstract urlToAddress(url: string): string;

  public static getFileSystem = (temporary?: boolean) => {
    return temporary ? TempFS : PersistentFS;
  };
}
