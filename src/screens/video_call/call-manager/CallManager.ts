import { CallAnalytics, ConferenceType } from 'api';
import { UniqueKeyArray } from 'javascript-dev-kit';
import Analytics from '../../../analytics/analytics';

export default class CallManager {
  private sound: any;
  private shouldRing = false;
  private tid;
  private readonly listeners = new UniqueKeyArray<() => void>();
  private readonly sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  public addListener(listener: () => void) {
    return this.listeners.add('state-change', listener);
  }

  public startTransmitting(type: ConferenceType) {}

  public isHeadsetPluggedIn() {
    return false;
  }

  public setSpeakerEnabled(enabled: boolean) {}

  public isSpeakerPhoneOn() {
    return false;
  }

  public startRing(initiator: boolean) {
    if (this.sound || this.shouldRing) {
      return;
    }
    Analytics.send(new CallAnalytics.RingStateChange(this.sessionId, { ringing: true, isInitiator: initiator }));
    this.shouldRing = true;
    playLocalSound(initiator ? 'dial_tone' : 'dial_tone').then((sound) => {
      this.sound = sound;
      sound.setOnEndListener(() => {
        this.sound = undefined;
        if (this.shouldRing) {
          this.tid = setTimeout(() => {
            this.shouldRing && this.startRing(initiator);
          }, 1500);
        }
      });
    });
  }

  public stopRing() {
    if (this.shouldRing || this.sound) {
      Analytics.send(new CallAnalytics.RingStateChange(this.sessionId, { ringing: false, isInitiator: false }));
    }
    this.tid && clearTimeout(this.tid);
    this.sound && this.sound.stop();
    this.sound = undefined;
    this.shouldRing = false;
  }

  public shutdown() {
    this.stopRing();
  }
}
