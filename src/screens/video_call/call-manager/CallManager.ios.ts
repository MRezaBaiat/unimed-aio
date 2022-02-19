import InCallManager from 'react-native-incall-manager';
import { CallAnalytics, ConferenceType } from 'api';
import { DeviceEventEmitter } from 'react-native';
import { UniqueKeyArray } from 'javascript-dev-kit';
import Analytics from '../../../analytics/analytics';

export default class CallManager {
  private readonly listeners = new UniqueKeyArray<() => void>();
  private sound: any;
  private shouldRing = false;
  private currentRoute = undefined;
  private availableDevices: string[] = [];
  private defaultSpeakerEnabled = true;
  private initializing = true;
  private tid;
  private readonly sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  public addListener(listener: () => void) {
    return this.listeners.add('state-change', listener);
  }

  public startTransmitting(type: ConferenceType) {
    this.stopRing();
    InCallManager.start({ media: type === ConferenceType.audio ? 'audio' : 'video' }); // audio/video, default: audio
    DeviceEventEmitter.addListener('onAudioDeviceChanged', this.audioDeviceChangeListener);
    this.setSpeakerEnabled(!this.isHeadsetPluggedIn());
  }

  public isHeadsetPluggedIn() {
    // return this.currentRoute === 'EARPIECE' && !CallManager.availableDevices.includes('WIRED_HEADSET');
    return this.availableDevices.includes('WIRED_HEADSET') || this.availableDevices.includes('BLUETOOTH');
  }

  public isSpeakerPhoneOn() {
    return this.currentRoute === 'SPEAKER_PHONE';
  }

  private getBestDevice() {
    if (this.isHeadsetPluggedIn()) {
      return this.availableDevices.includes('WIRED_HEADSET') ? 'WIRED_HEADSET' : 'BLUETOOTH';
    }
    if (this.defaultSpeakerEnabled) {
      return 'SPEAKER_PHONE';
    }
    return 'EARPIECE';
  }

  private audioDeviceChangeListener = (data) => {
    const newDevices = JSON.parse(data.availableAudioDeviceList);
    if (newDevices.length !== this.availableDevices.length) {
      this.initializing = true;
    }
    this.availableDevices = newDevices;
    this.currentRoute = data.selectedAudioDevice;
    this.listeners.getValues('state-change').forEach((l) => l());
    if (this.initializing) {
      this.initializing = false;
      const route = this.getBestDevice();
      InCallManager.chooseAudioRoute(route);
    }
    // const { availableAudioDeviceList, selectedAudioDevice } = data;
    console.log('audio-devices', this.currentRoute, this.isSpeakerPhoneOn(), data);
  };

  public setSpeakerEnabled(enabled: boolean) {
    this.defaultSpeakerEnabled = enabled;
    if (enabled) {
      InCallManager.chooseAudioRoute('SPEAKER_PHONE');
    } else {
      const route = (this.availableDevices && this.availableDevices.find((d) => d !== 'SPEAKER_PHONE' && d !== 'EARPIECE')) || 'EARPIECE';
      InCallManager.chooseAudioRoute(route);
    }
    this.listeners.getValues('state-change').forEach((l) => l());
  }

  public startRing(initiator: boolean) {
    if (this.sound || this.shouldRing) {
      return;
    }
    Analytics.send(new CallAnalytics.RingStateChange(this.sessionId, { ringing: true, isInitiator: initiator }));
    this.shouldRing = true;
    if (initiator) {
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
    } else {
      InCallManager.startRingtone('_DEFAULT_');
    }
  }

  public stopRing() {
    if (this.shouldRing || this.sound) {
      Analytics.send(new CallAnalytics.RingStateChange(this.sessionId, { ringing: false, isInitiator: false }));
    }
    this.tid && clearTimeout(this.tid);
    this.sound && this.sound.stop();
    this.sound = undefined;
    InCallManager.stopRingtone();
    this.shouldRing = false;
  }

  public shutdown() {
    this.stopRing();
    InCallManager.stop();
    DeviceEventEmitter.removeListener('onAudioDeviceChanged', this.audioDeviceChangeListener);
  }
}
