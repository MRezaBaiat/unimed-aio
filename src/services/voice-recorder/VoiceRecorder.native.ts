import { Audio } from 'expo-av';
import { VoiceRecordingSession } from './VoiceRecorderService';
import { ChatType } from 'api';
import FileAsset from '../../helpers/file-manager/FileAsset';

const createNew = async (): Promise<VoiceRecordingSession | undefined> => {
  const recording: Audio.Recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY).then(console.log);
  await recording.startAsync();
  const start = Date.now();
  return {
    save: () =>
      stopRecord(recording, start)
        .then((res) => convertToFile(res.uri, res.duration))
        .catch((e) => {
          console.log(e);
          return undefined;
        }),
    cancel: () =>
      stopRecord(recording, start)
        .then(() => undefined)
        .catch((e) => {
          console.log(e);
          return undefined;
        }),
    createdAt: start,
  };
};

const stopRecord = async (recording: Audio.Recording, startTime: number): Promise<{ uri: string; duration: number }> => {
  const duration = Date.now() - startTime;
  await recording.stopAndUnloadAsync();
  if (duration <= 1000) {
    throw new Error('duration too short');
  }
  const uri = recording.getURI();
  if (!uri) {
    throw new Error('error fetching recorded file uri');
  }
  return {
    uri: uri,
    duration,
  };
};

const convertToFile = async (uri: string, duration: number): Promise<FileAsset | undefined> => {
  return FileAsset.create(uri, { type: ChatType.MUSIC, mediaInfo: { duration: duration / 1000 } });
};

export default {
  createNew,
};
