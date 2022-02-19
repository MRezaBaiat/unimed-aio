/*
import { getMyUserId } from '../helpers';
import { IOStatus, SendStatus, Chat } from 'api';
import UploadService from '../services/UploadService';
import DownloadService from '../services/DownloadService';
import { PersistentCache, TempCache } from '../cache';

export default class AppFiles {
  public static async findIOStatus (chat:Chat, temporary = false): Promise<{ status: IOStatus, progress?: number, file?: string, exists: boolean }> {
    const file = temporary ? await TempCache.getFilePath(chat) : await PersistentCache.getFilePath(chat);
    const exists = Boolean(file);

    if (chat.sender === getMyUserId() && chat.sendStatus < SendStatus.SENT) {
      return { ...UploadService.getStatus(chat.id), file, exists };
    }
    if (exists) {
      return { status: IOStatus.READY, file, exists };
    }
    const status = DownloadService.getStatus(chat.url);
    if (!status) {
      return { exists: false, file: file, progress: 0, status: IOStatus.WAITING_FOR_DOWNLOAD };
    }
    return { ...status, file, exists };
  }
}
*/
