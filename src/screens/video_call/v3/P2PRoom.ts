import { Participant, ConferenceType, CallAnalytics, Conference } from 'api';
import P2PPeer, { P2PPeerOptions } from './P2PPeer';
import Stream from './Stream';
import { getMyUserId, ping } from '../../../helpers';
import PeerLocalStream from './PeerLocalStream';
import SDP from './SDP';
import CallApi from '../../../network/CallApi';
import CallManager from '../call-manager/CallManager';
import { WebRTCStats } from '@peermetrics/webrtc-stats';
import Analytics from '../../../analytics/analytics';
import ChatService from '../../../services/ChatService';
import NetUtils from '../../../helpers/NetUtils';

const TAG = '[webrtc-P2PRoom]';
export default class P2PRoom extends Stream {
  public otherSideNotified = false;
  public readonly session: Conference;
  public readonly type: ConferenceType;
  private readonly peers: P2PPeer[] = [];
  private readonly peerLocalStream: PeerLocalStream;
  private readonly incomingQueue: SDP[] = [];
  public readonly callManager: CallManager;
  public readonly isInitiator;
  private readonly pingTid: any;
  private readonly socketListener: any;
  private readonly netListener: any;
  private readonly webrtcStats = new WebRTCStats({
    getStatsInterval: 5000,
  });

  constructor(session: Conference) {
    super();
    this.session = session;
    this.type = session.type;
    this.peerLocalStream = new PeerLocalStream(session.mediaConstraints, session.id);
    this.isInitiator = session.initiator.id === getMyUserId();
    this.peerLocalStream.initialize();
    this.callManager = new CallManager(session.id);
    this.socketListener = (state) => Analytics.send(new CallAnalytics.SocketStateChange(session.id, { state }));
    this.netListener = (isConnected: boolean) => Analytics.send(new CallAnalytics.NetworkStateChanged(session.id, { connected: isConnected }));
    ChatService.addListener(this.socketListener);
    NetUtils.addListener(this.netListener);
    this.webrtcStats.on('stats', (ev) => {
      console.log('stats', ev);
      // Analytics.send(new CallAnalytics.Stats(session.id, ev));
      // const metrics = new CallMetrics.Stats(getMyUserId(), getMyUserType(), );
      // console.log(metrics);
    });
    const pingFn = () => {
      const server = session.iceServers[0].urls[0];
      ping(server).then((result) => Analytics.send(new CallAnalytics.Ping(session.id, { server, result })));
    };
    this.pingTid = setInterval(pingFn, 5000);
    pingFn();
  }

  public async start() {
    const { session } = this;
    if (this.isStarted) {
      return;
    }
    this.isStarted = true;
    await this.addParticipant(session.initiator);
    await this.addParticipant(session.receiver);
  }

  public addListener(cb: (peers: P2PPeer[]) => void) {
    this.on('peers', cb);
    const peers = this.getPeers();
    peers.length > 0 && cb(peers);
  }

  public removeListener(cb: (peers: P2PPeer[]) => void) {
    this.off('peers', cb);
  }

  public getPeerLocalStream() {
    return this.peerLocalStream;
  }

  public onSDP(sdp: SDP) {
    if (this.isDestroyed) {
      return;
    }
    console.log('RECEIVED SDP');
    const peer = this.getPeer(sdp.from);
    if (peer) {
      peer.onSignal(sdp);
    } else {
      console.log('pushed to queue');
      this.incomingQueue.push(sdp);
    }
  }

  public getPeers() {
    return this.peers;
  }

  public getPeer(userId: string) {
    return this.peers.find((peer) => peer.userId === userId);
  }

  // initiator is who ever joined second and received list by update not by event
  private async addParticipant(participant: Participant) {
    try {
      const { session, peerLocalStream } = this;
      if (participant.id === getMyUserId()) {
        return;
      }
      await peerLocalStream.initialize();
      let peer: P2PPeer | undefined = this.peers.find((peer) => peer.userId === participant.id);
      if (peer) {
        return;
      }
      const opts: P2PPeerOptions = {
        userId: participant.id,
        conferenceId: session.id,
        mediaConstraints: session.mediaConstraints,
        trickleIce: session.trickleIce,
        iceServers: session.iceServers,
        iceTransportPolicy: session.iceTransportPolicy,
        type: session.type,
        initiatorId: session.initiator.id,
        videoMaxBitrate: session.videoMaxBitrate,
        audioMaxBitrate: session.audioMaxBitrate,
        preferredCodecs: session.preferredCodecs,
      };

      peer = new P2PPeer(peerLocalStream, opts);
      this.peers.push(peer);
      peer.start();
      this.emitEvent('peers', this.getPeers());
      this.webrtcStats.addPeer({
        pc: peer.getPC(),
        peerId: participant.id,
      });
      this.incomingQueue
        .filter((p) => p.from === participant.id)
        .forEach((sdp) => {
          peer && peer.onSignal(sdp);
          this.incomingQueue.splice(this.incomingQueue.indexOf(sdp), 1);
        });
    } catch (e) {
      console.error(e);
      Analytics.send(new CallAnalytics.Error(this.session.id, e, 'error when creating participant'));
    }
  }

  private removeParticipant(userId: string) {
    const peer = this.peers.find((peer) => peer.userId === userId);
    if (peer) {
      this.peers.splice(this.peers.indexOf(peer), 1);
      peer.close();
    }
  }

  public close() {
    super.close();
    ChatService.removeListener(this.socketListener);
    NetUtils.removeListener(this.netListener);
    this.peerLocalStream.close();
    this.peers.forEach((peer) => this.removeParticipant(peer.userId));
  }

  public shutDown(isFromOtherSide = false) {
    clearInterval(this.pingTid);
    this.callManager.shutdown();
    if (global.audio) {
      if (global.audio.disconnect) {
        global.audio.disconnect();
      } else if (global.audio.pause) {
        global.audio.pause();
      }
      global.audio = undefined;
    }
    if (isFromOtherSide) {
      this.otherSideNotified = true;
    }
    if (!this.otherSideNotified) {
      this.otherSideNotified = true;
      CallApi.endCall(this.session.id).catch(console.log);
    }
    this.close();
  }
}
