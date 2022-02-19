import { Chat, IOStatus } from 'api';
import FileAsset from '../helpers/file-manager/FileAsset';

export interface UploadQueue {
  localFile: FileAsset;
  visitId: string;
  chat: Chat;
  errorsCount: number;
  status: IOStatus;
  progress: number;
}

export interface DownloadQueue {
  chat: Chat;
  errorsCount: number;
  status: IOStatus;
  progress: number;
  temporary: boolean;
}

type Queue = UploadQueue | DownloadQueue;

export default Queue;
