import Stream from './Stream';
import { block } from './Blocking';
import { Platform } from 'react-native';
import WebrtcUtils from './WebrtcUtils';
import Analytics from '../../../analytics/analytics';
import { CallAnalytics } from 'api';
import { actionClearCall } from '../../../redux/actions/call_actions';
import store from '../../../redux/Store';

const streams: MediaStream[] = [];
export default class PeerLocalStream extends Stream {
  private readonly constraints: any;
  private readonly sessionId: string;
  private muted = false;

  constructor(constraints, sessionId: string) {
    super();
    this.constraints = constraints;
    this.sessionId = sessionId;
  }

  public async switchCamera() {
    const localStream = this.stream();
    if (this.isDestroyed || !localStream) {
      return;
    }
    if (Platform.OS === 'web') {
      const allDevices = await WebrtcUtils.getDevices();
      const tracks = localStream.getVideoTracks();
      const currentDeviceId = tracks.length > 0 && tracks[0].getSettings().deviceId;
      if (!currentDeviceId) {
        return;
      }
      const newDevice = allDevices.videoInputs.find((d) => d.deviceInfo.deviceId !== currentDeviceId);
      if (!newDevice) {
        return;
      }
      const constraints = this.constraints;
      if (typeof constraints.video === 'boolean') {
        constraints.video = {};
      }
      constraints.video.deviceId = { exact: newDevice.deviceInfo.deviceId };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((newStream) => {
          if (!newStream || this.isDestroyed) {
            newStream && newStream.getTracks().forEach((t) => t.stop());
            return;
          }
          newStream.getTracks().forEach((t) => {
            Analytics.send(new CallAnalytics.TrackCreated(this.sessionId, { kind: t.kind as any, local: true }));
            t.addEventListener('mute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: true, enabled: false })));
            t.addEventListener('unmute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: true, enabled: true })));
          });
          streams[0] = newStream;
          this.notifyListeners();
          // tracks.forEach(t => t.stop());
          localStream.getTracks().forEach((t) => t.stop()); // audio tracks
        })
        .catch((e) => {
          Analytics.send(new CallAnalytics.Error(this.sessionId, e, 'getUserMedia()'));
          store.dispatch(actionClearCall(false));
        });
    } else {
      localStream.getVideoTracks().forEach((track) => {
        // @ts-ignore
        track._switchCamera && track._switchCamera();
      });
    }
  }

  private notifyListeners() {
    this.emitEvent('change', this.stream(), this.isMuted());
  }

  public toggleMute() {
    const localStream = this.stream();
    if (this.isDestroyed || !localStream) {
      return;
    }
    this.muted = !this.muted;
    // localStream.getTracks()[0].enabled = !this.muted;
    const track = localStream.getTracks().find((t) => t.kind === 'audio');
    if (track) {
      track.enabled = !this.muted;
    }
    this.notifyListeners();
  }

  public isMuted() {
    return this.muted;
  }

  public addListener(cb: (stream: MediaStream, isMuted: boolean) => void) {
    this.on('change', cb);
    const stream = this.stream();
    stream && cb(stream, this.isMuted());
  }

  public removeListener(cb: (stream: MediaStream) => void) {
    this.off('change', cb);
  }

  public stream(): MediaStream | undefined {
    return streams[0];
  }

  public async initialize() {
    if (streams[0]) {
      return;
    }
    const fn = async () => {
      if (streams[0]) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      stream.getTracks().forEach((t) => {
        Analytics.send(new CallAnalytics.TrackCreated(this.sessionId, { kind: t.kind as any, local: true }));
        t.addEventListener('mute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: true, enabled: false })));
        t.addEventListener('unmute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: true, enabled: true })));
      });
      streams.push(stream);
      if (this.isDestroyed) {
        this.close();
      }
      this.notifyListeners();
    };

    return new Promise((resolve, reject) => {
      block('local-stream-getter', () =>
        fn()
          .then(resolve)
          .catch((e) => {
            Analytics.send(new CallAnalytics.Error(this.sessionId, e, 'getUserMedia()'));
            store.dispatch(actionClearCall(false));
            reject(e);
          })
      );
    });
  }

  public close() {
    super.close();
    if (streams.length > 1) {
      throw new Error('there were ' + streams.length + ' items in local streams cache!');
    }
    streams.forEach((stream) => {
      stream.getTracks().forEach((t) => {
        t.stop();
        console.log('STOPPED');
        Analytics.send(new CallAnalytics.TrackStopped(this.sessionId, { kind: t.kind as any, local: true }));
      });
      streams.splice(streams.indexOf(stream), 1);
    });
  }
}
