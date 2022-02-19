// import MicRecorder from './MicRecorder';
import Recorder from './VoiceRecorder';
import FileAsset from '../../helpers/file-manager/FileAsset';

const TAG = '[voice-recorder]';

/*
alternative https://collab-project.github.io/videojs-record/#/plugins/libvorbis.js
*/

export interface VoiceRecordingSession {
  save: () => Promise<FileAsset | undefined>;
  cancel: () => Promise<void>;
  createdAt: number;
}

export default class VoiceRecorderService {
  private static shouldBeRecording = false;
  private static active:
    | {
        session: VoiceRecordingSession | undefined;
      }
    | undefined;

  public static async startRecorder() {
    this.shouldBeRecording = false;
    if (this.active) {
      if (!this.active.session) {
        // still is initializing
        return;
      }
      await this.active.session.cancel();
    }
    this.shouldBeRecording = true;
    const session = await Recorder.createNew();
    if (!session || !this.shouldBeRecording) {
      this.active = undefined;
      this.shouldBeRecording = false;
      session && session.cancel();
      return;
    }

    this.active = {
      session,
    };
  }

  public static async save(cb: (FileAsset: FileAsset) => void) {
    if (!this.shouldBeRecording || !this.active) {
      return;
    }

    if (!this.active.session) {
      this.shouldBeRecording = false;
      return;
    }
    const session = this.active.session;
    this.active = undefined;
    this.shouldBeRecording = false;
    session.save().then((file) => {
      file && cb && cb(file);
    });
  }

  public static async cancel() {
    if (!this.shouldBeRecording || !this.active) {
      return;
    }
    if (!this.active.session) {
      this.shouldBeRecording = false;
      return;
    }
    const session = this.active.session;
    this.active = undefined;
    this.shouldBeRecording = false;
    session.cancel();
  }
}
