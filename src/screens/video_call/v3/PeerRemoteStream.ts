import Stream from './Stream';
import Analytics from '../../../analytics/analytics';
import { CallAnalytics } from 'api';

export default class PeerRemoteStream extends Stream {
  private readonly sessionId: string;
  private userId: string;
  public mediaStream?: MediaStream;

  constructor(userId: string, sessionId: string) {
    super();
    this.userId = userId;
    this.sessionId = sessionId;
  }

  public setRemoteStream(stream: MediaStream) {
    this.mediaStream = stream;
    console.log('GOT REMOTE');
    stream.getTracks().forEach((t) => {
      Analytics.send(new CallAnalytics.TrackCreated(this.sessionId, { kind: t.kind as any, local: false }));
      t.addEventListener('mute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: false, enabled: false })));
      t.addEventListener('unmute', () => Analytics.send(new CallAnalytics.TrackStateChange(this.sessionId, { kind: t.kind as any, local: false, enabled: true })));
    });
    stream && this.emitEvent('change', stream);
  }

  public stream(): MediaStream | undefined {
    return this.mediaStream;
  }

  public addListener(cb: (stream: MediaStream) => void) {
    this.on('change', cb);
    const stream = this.stream();
    stream && cb(stream);
  }

  public removeListener(cb: (stream: MediaStream) => void) {
    this.off('change', cb);
  }

  public close() {
    super.close();
    this.mediaStream &&
      this.mediaStream.getTracks().forEach((t) => {
        t.stop();
        Analytics.send(new CallAnalytics.TrackStopped(this.sessionId, { kind: t.kind as any, local: false }));
      });
  }
}
