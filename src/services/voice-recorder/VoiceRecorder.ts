import MicRecorder from 'mic-recorder-to-mp3';
import { VoiceRecordingSession } from './VoiceRecorderService';
import FileAsset from '../../helpers/file-manager/FileAsset';
import { ChatType } from 'api';

const createNew = async (): Promise<VoiceRecordingSession | undefined> => {
  const recorder = new MicRecorder({
    bitRate: 128,
  });
  await recorder.start();
  const start = Date.now();
  return {
    save: () =>
      stopRecord(recorder, start)
        .then((res) => convertToFileAsset(res.blob, res.duration))
        .catch((e) => {
          console.log(e);
          return undefined;
        }),
    cancel: () =>
      stopRecord(recorder, start)
        .then(() => undefined)
        .catch((e) => {
          console.log(e);
          return undefined;
        }),
    createdAt: start,
  };
};

const stopRecord = async (recorder: any, startTime: number): Promise<{ blob: Blob; duration: number }> => {
  return new Promise(async (resolve, reject) => {
    const duration = Date.now() - startTime;
    if (duration < 1000) {
      recorder.stop();
      return reject(new Error('duration too short'));
    }
    const [buffer, blob] = await recorder.stop().getMp3();
    resolve({ blob, duration });
  });
};

const convertToFileAsset = async (blob: Blob, duration: number) => {
  return await FileAsset.create(blob, { type: ChatType.MUSIC, mediaInfo: { duration: duration / 1000 } });
};

export default {
  createNew,
};
/*

import FileAsset from '../../helpers/file-manager/FileAsset';
import { VoiceRecordingSession } from './VoiceRecorderService';
import { ChatType } from 'api';
import { ReactMic } from './microphone-recorder/MicrophoneRecorder';

const createNew = async (): Promise<VoiceRecordingSession | undefined> => {
  const recorder = new ReactMic({
    audioBitsPerSecond: 128000,
    mimeType: 'audio/wav',
    bufferSize: 2048,
    sampleRate: 44100,
    recorderParams: {},
    record: true,
    onStart: () => {
      recorder.createdAt = Date.now();
    },
    onStop: (info) => {
      recorder.onStop(info);
    },
    onSave: (info) => {
      console.log('saved', info);
    }
  });
  recorder.componentDidMount();
  const start = Date.now();
  // recorder.start();
  // const recorder = new MicrophoneRecorder(null, null, null, null, options);
  // recorder.startRecording();
  recorder.render();
  return {
    save: () => stopRecord(recorder, start).then(res => convertToFileAsset(res.blob, res.duration)).catch(e => { console.log(e); return undefined; }),
    cancel: () => stopRecord(recorder, start).then(() => undefined).catch(e => { console.log(e); return undefined; }),
    createdAt: start
  };
};

const stopRecord = async (recorder: any, startTime: number): Promise<{blob: Blob, duration: number}> => {
  return new Promise((resolve, reject) => {
    try {
      const duration = Date.now() - recorder.createdAt;
      recorder.props.record = false;
      if (duration < 1000) {
        recorder.onStop = () => {};
        return reject(new Error('duration too low'));
      }
      console.log(recorder);
      recorder.onStop = (info) => {
        console.log(info);
        resolve({ blob: info.blob, duration: duration });
      };
      recorder.stopRecording((info) => {
        console.log(info);
        resolve({ blob: info.blob, duration: info.stopTime - info.startTime });
      });
      /!* recorder.addEventListener('dataavailable', (e) => {
        resolve({ blob: e.data, duration });
      }); *!/
    } finally {
      recorder.render();
      // recorder.stop();
      // recorder.stream.getTracks().forEach(i => i.stop());
    }
  });
};

const convertToFileAsset = async (blob: Blob, duration: number) => {
  return await FileAsset.create(blob, { type: ChatType.MUSIC, mediaInfo: { duration: duration / 1000 } });
};

export default {
  createNew
};
*/
