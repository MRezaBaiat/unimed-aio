import PeerSocket from './PeerSocket';
import P2PPeer from './P2PPeer';
import SDP from './SDP';
import Analytics from '../../../analytics/analytics';
import { CallAnalytics, CallMetricsEvent } from 'api';

export default class WebrtcInitializer {
  public readyAcknowledged = false;
  public isOtherSideReady = false;
  private peer: P2PPeer;
  private onOtherSideReadyListener?: () => void;
  private onBothSidesReadyListener?: () => void;
  private socket: PeerSocket;

  constructor(peer: P2PPeer, socket: PeerSocket) {
    this.peer = peer;
    this.socket = socket;
  }

  public isReady = () => {
    return this.isOtherSideReady && this.readyAcknowledged;
  };

  public setOnOtherSideReady = (cb: () => void) => {
    if (this.isOtherSideReady) {
      cb();
      return this;
    }
    this.onOtherSideReadyListener = cb;
    return this;
  };

  public setOnBothSidesReady = (cb: () => void) => {
    if (this.isOtherSideReady && this.readyAcknowledged) {
      cb();
      return this;
    }
    this.onBothSidesReadyListener = cb;
    return this;
  };

  private onReadyStateChanged = () => {
    if (this.isOtherSideReady && this.onOtherSideReadyListener) {
      this.onOtherSideReadyListener();
      this.onOtherSideReadyListener = undefined;
    }
    if (this.isOtherSideReady && this.readyAcknowledged && this.onBothSidesReadyListener) {
      this.onBothSidesReadyListener();
      this.onBothSidesReadyListener = undefined;
    }
  };

  public signalReady = () => {
    if (this.peer.isDestroyed) {
      return this;
    }
    if (this.readyAcknowledged) {
      return this;
    }
    this.socket.emit(new SDP({ ready: true }));
    setTimeout(this.signalReady, 200);
    return this;
  };

  private onOtherSideReady = () => {
    if (this.peer.isDestroyed) {
      return;
    }
    this.socket.emit(new SDP({ readyAcknowledged: true }));
    this.onReadyStateChanged();
  };

  public handleSdp = (data): boolean => {
    if (data.ready) {
      if (!this.isOtherSideReady) {
        Analytics.send(new CallAnalytics.AbstractCallMetric(this.peer.options.conferenceId, CallMetricsEvent.OTHER_SIDE_READY));
      }
      this.isOtherSideReady = true;
      this.onOtherSideReady();
      return true;
    }
    if (data.readyAcknowledged) {
      if (!this.readyAcknowledged) {
        Analytics.send(new CallAnalytics.AbstractCallMetric(this.peer.options.conferenceId, CallMetricsEvent.READY_ACKNOWLEDGED));
      }
      this.readyAcknowledged = true;
      this.onReadyStateChanged();
      return true;
    }
    return false;
  };
}
