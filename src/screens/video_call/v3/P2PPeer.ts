import Stream from './Stream';
import PeerSocket from './PeerSocket';
import SDP from './SDP';
import PeerLocalStream from './PeerLocalStream';
import PeerRemoteStream from './PeerRemoteStream';
import SimplePeer from 'simple-peer-light';
import WebrtcUtils from './WebrtcUtils';
import store from '../../../redux/Store';
import { actionClearCall } from '../../../redux/actions/call_actions';
import { CallAnalytics, CallMetricsEvent, ConferenceType } from 'api';
import WebrtcInitializer from './WebrtcInitializer';
import { getMyUserId } from '../../../helpers';
import { Platform } from 'react-native';
import Analytics from '../../../analytics/analytics';

export type StreamState = 'connecting' | 'connected' | 'reconnecting';
const TAG = '[webrtc-P2PPeer]';
export interface P2PPeerOptions extends Partial<RTCConfiguration> {
  userId: string;
  conferenceId: string;
  mediaConstraints: { audio: any; video: any };
  trickleIce: boolean;
  type: ConferenceType;
  initiatorId: string;
  videoMaxBitrate: 'unlimited' | number;
  audioMaxBitrate: 'unlimited' | number;
  preferredCodecs: ('vp8' | 'vp9' | 'h264')[];
  iceServers: RTCIceServer[];
}
export default class P2PPeer extends Stream {
  public readonly options: P2PPeerOptions;
  private readonly socket: PeerSocket;
  private readonly localStream: PeerLocalStream;
  private readonly remoteStream: PeerRemoteStream;
  public readonly userId: string;
  private readonly initializer?: WebrtcInitializer;
  private state: StreamState = 'connecting';
  private peer: SimplePeer.Instance;
  private readonly incomingQueue: SDP[] = [];
  private readonly outgoingQueue: SDP[] = [];

  constructor(stream: PeerLocalStream, options: P2PPeerOptions) {
    super();
    this.userId = options.userId;
    this.options = options;
    this.socket = new PeerSocket(options.conferenceId, options.userId);
    this.localStream = stream;
    this.remoteStream = new PeerRemoteStream(options.userId, options.conferenceId);
    this.peer = this.createPeer();
    stream.addListener(this.mLocalStreamListener);
    this.initializer = new WebrtcInitializer(this, this.socket);
    this.removeListeners();
    this.addListeners();
  }

  public start() {
    if (this.isStarted) {
      return;
    }
    this.isStarted = true;
    const { initializer } = this;
    if (initializer) {
      initializer
        .setOnBothSidesReady(async () => {
          this.injectQueues();
        })
        .signalReady();
    } else {
      this.injectQueues();
    }
  }

  private mLocalStreamListener = () => {
    if (Platform.OS === 'web') {
      const pc: RTCPeerConnection = this.getPC();
      const newStream = this.localStream.stream();
      newStream &&
        newStream.getVideoTracks().forEach((track) => {
          const sender = pc.getSenders().find((s) => {
            return s.track && s.track !== track && s.track.kind === track.kind;
          });
          sender && sender.replaceTrack(track);
        });
    }
  };

  public getState() {
    return this.state;
  }

  private stateChanged = (state: StreamState) => {
    if (this.state === state) {
      return;
    }
    Analytics.send(new CallAnalytics.CallStateChange(this.options.conferenceId, { from: this.state, to: state }));
    this.state = state;
    this.emitEvent('change');
  };

  private injectQueues() {
    const { incomingQueue, outgoingQueue } = this;
    incomingQueue.forEach((p) => this.onSignal(p));
    outgoingQueue.forEach((p) => this.emitSignal(p));
    outgoingQueue.length = 0;
    incomingQueue.length = 0;
  }

  private createPeer() {
    const { options, localStream, remoteStream } = this;
    // @ts-ignore
    RTCPeerConnection.prototype.addTrack = function (track, stream) {
      // @ts-ignore
      this.removeStream(stream);
      // @ts-ignore
      this.addStream(stream);
    };

    const peer = new SimplePeer({
      sdpTransform: (sdp: string): string => {
        return WebrtcUtils.morphSDP(sdp, options);
      },
      stream: localStream.stream(),
      initiator: options.initiatorId === getMyUserId(),
      trickle: options.trickleIce,
      config: { iceServers: options.iceServers, iceTransportPolicy: options.iceTransportPolicy || 'relay' },
      offerOptions: {
        offerToReceiveVideo: options.type === ConferenceType.video_audio,
        offerToReceiveAudio: true,
      },
      answerOptions: {
        offerToReceiveVideo: options.type === ConferenceType.video_audio,
        offerToReceiveAudio: true,
      },
    });
    peer.on('error', (e: Error) => {
      console.error(e);
      Analytics.send(new CallAnalytics.Error(this.options.conferenceId, e, 'error when creating simplePeer'));
      store.dispatch(actionClearCall());
    });
    peer.on('signal', (data) => this.emitSignal(new SDP(data)));
    peer.on('stream', (stream: MediaStream) => remoteStream.setRemoteStream(stream));
    peer.on('close', () => store.dispatch(actionClearCall()));

    /* this.getPC().onaddstream = (e) => {
      remoteStream.setRemoteStream(e.stream.toURL());
    }; */
    if (!peer._pc.getConfiguration) {
      peer._pc.getConfiguration = () => {
        return {
          ...options,
          iceServers: options.iceServers.map((s) => {
            return { ...s, credential: '' };
          }),
        };
      };
    }
    peer._pc.onaddstream = function (e) {
      peer._onTrack({ streams: [e.stream] });
      // remoteStream.setRemoteStream(e.stream);
    };
    return peer;
  }

  private onConnectionStateChange = (e) => {
    if (this.isDestroyed) {
      return;
    }
    const state: RTCPeerConnectionState = e.target.connectionState;
    if (state === 'disconnected') {
      this.stateChanged('reconnecting');
    } else if (state === 'closed' || state === 'failed') {
      store.dispatch(actionClearCall());
    } else if (state === 'connecting') {
      this.stateChanged('connecting');
    } else {
      this.stateChanged('connected');
    }
    console.log('connection state change', e);
  };

  private onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
    Analytics.send(new CallAnalytics.RTCIceCandidate(this.options.conferenceId, { candidate: e.candidate }));
  };

  private onIceCandidateError = (e: RTCPeerConnectionIceErrorEvent) => {
    Analytics.send(new CallAnalytics.RTCIceCandidateError(this.options.conferenceId, { errorCode: e.errorCode, errorText: e.errorText, hostCandidate: e.hostCandidate, url: e.url }));
  };

  private onIceCandidateStateChange = (e) => {
    Analytics.send(new CallAnalytics.RTCIceConnectionStateChange(this.options.conferenceId, e.target.iceConnectionState));
  };

  private onIceGatheringStateChange = (e) => {
    Analytics.send(new CallAnalytics.RTCIceGatheringStateChange(this.options.conferenceId, e.target.iceGatheringState));
  };

  private onSignalingStateChanged = (e) => {
    Analytics.send(new CallAnalytics.RTCSignalingStateChanged(this.options.conferenceId, e.target.signalingState));
  };

  private onTrack = (event: RTCTrackEvent) => {
    this.remoteStream.setRemoteStream(event.streams[0]);
  };

  /**
   * The negotiationneeded event is fired whenever we add the media on the
   * RTCPeerConnection object.
   */
  private onNegotiationNeeded = async () => {
    Analytics.send(new CallAnalytics.RTCNegotiationNeeded(this.options.conferenceId));
    /* const { pc, userId, options } = this;
    let description;
    if (options.isInitiator) {
      description = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: options.type === 'video/audio' });
    } else {
      description = await pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: options.type === 'video/audio' });
    }
    await pc.setLocalDescription(description);
    this.socket.emit(new SDP({ userId, conferenceId: options.conferenceId, description })); */
  };

  public addListener(cb: () => void) {
    this.on('change', cb);
    cb();
  }

  public removeListener(cb: (peers: P2PPeer[]) => void) {
    this.off('change', cb);
  }

  private emitSignal(sdp: SDP) {
    if (!this.isStarted) {
      this.outgoingQueue.push(sdp);
      return;
    }
    this.socket.emit(sdp);
  }

  public onSignal(sdp: SDP) {
    if (this.isDestroyed) {
      return;
    }
    if (this.initializer && this.initializer.handleSdp(sdp)) {
      return;
    }
    if (!this.isStarted) {
      this.incomingQueue.push(sdp);
      return;
    }
    this.peer.signal(sdp);
  }

  public getPeerRemoteStream() {
    return this.remoteStream;
  }

  public getPC(): RTCPeerConnection {
    return this.peer._pc;
  }

  private onAddStream(event: any) {
    this.remoteStream.setRemoteStream(event.stream.toURL());
  }

  public close(): void {
    super.close();
    this.removeListeners();
    this.localStream.removeListener(this.mLocalStreamListener);
    this.socket.close();
    this.peer.destroy();
    this.localStream.close();
    this.remoteStream.close();
  }

  private addListeners() {
    const pc = this.getPC();
    if (!pc) {
      return;
    }
    pc.addEventListener('connectionstatechange', this.onConnectionStateChange);
    pc.addEventListener('icecandidate', this.onIceCandidate);
    pc.addEventListener('icecandidateerror', this.onIceCandidateError);
    pc.addEventListener('iceconnectionstatechange', this.onIceCandidateStateChange);
    pc.addEventListener('icegatheringstatechange', this.onIceGatheringStateChange);
    pc.addEventListener('negotiationneeded', this.onNegotiationNeeded);
    pc.addEventListener('signalingstatechange', this.onSignalingStateChanged);
    pc.addEventListener('track', this.onTrack);
  }

  private removeListeners() {
    const pc = this.getPC();
    if (!pc) {
      return;
    }
    pc.removeEventListener('connectionstatechange', this.onConnectionStateChange);
    pc.removeEventListener('icecandidate', this.onIceCandidate);
    pc.removeEventListener('icecandidateerror', this.onIceCandidateError);
    pc.removeEventListener('iceconnectionstatechange', this.onIceCandidateStateChange);
    pc.removeEventListener('icegatheringstatechange', this.onIceGatheringStateChange);
    pc.removeEventListener('negotiationneeded', this.onNegotiationNeeded);
    pc.removeEventListener('signalingstatechange', this.onSignalingStateChanged);
    pc.removeEventListener('track', this.onTrack);
  }
}
