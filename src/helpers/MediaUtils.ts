import { ChatType } from 'api';
import { Image } from 'react-native';

export default class MediaUtils {
  public static getFileName(path: string): string {
    return decodeURIComponent(path)
      .replace(/^.*[\\\/]/, '')
      .replace('primary:', '');
  }

  public static calculateMediaSize(
    filePath: string,
    chatType: ChatType
  ): Promise<{
    width?: number;
    height?: number;
    orientation?: number;
    duration?: number;
  }> {
    return new Promise<{
      width?: number;
      height?: number;
      orientation?: number;
      duration?: number;
    }>((resolve, reject) => {
      if (chatType === ChatType.IMAGE || chatType === ChatType.GIF) {
        if (!filePath.startsWith('file://')) {
          filePath = 'file:///' + filePath;
        }
        Image.getSize(
          filePath,
          (width: number, height: number) => {
            resolve({ width, height, orientation: 0 });
          },
          (err) => {
            console.log(err);
            reject();
          }
        );
      } else if (chatType === ChatType.VIDEO) {
        this.getVideoInfo(filePath)
          .then((res) => {
            resolve({
              width: res.width,
              height: res.height,
              orientation: 0,
              duration: res.duration,
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else if (chatType === ChatType.MUSIC) {
        this.getMusicInfo(filePath)
          .then((res) => {
            resolve({ duration: res.duration });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      } else {
        resolve({});
      }
    });
  }

  public static durationToString(duration: number) {
    return 'NaN yet!';
  }

  public static getMusicInfo(filePath: string): Promise<{ duration: number }> {
    // get the metadata for a list of files
    return new Promise<any>((resolve, reject) => {
      const sound = new Sound(filePath, '', (error) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }
        resolve({ duration: sound.getDuration() });
      });
    });
  }
}

export class MediaItem {
  type: string;
  image: { width: number; height: number; uri: string };
  timestamp: number;
  constructor(type: string, image: { width: number; height: number; uri: string }, timestamp: number) {
    this.type = type;
    this.image = image;
    this.timestamp = timestamp;
  }

  public async getFilePath(): Promise<string> {
    return this.stats().then((stats) => {
      return stats.path;
    });
  }
}
