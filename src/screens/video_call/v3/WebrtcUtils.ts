import WebrtcBandwidth from './WebrtcBandwidth';
import WebrtcCodecs from './WebrtcCodecs';
import { Conference, ConferenceType } from 'api';
import { P2PPeerOptions } from './P2PPeer';

const morphSDP = (sdp: string, options: P2PPeerOptions) => {
  const { videoMaxBitrate, audioMaxBitrate, preferredCodecs } = options;
  if (options.type === ConferenceType.video_audio && videoMaxBitrate && videoMaxBitrate !== 'unlimited') {
    sdp = WebrtcBandwidth.setMediaBitrate(sdp, 'video', videoMaxBitrate);
  }
  if (audioMaxBitrate && audioMaxBitrate !== 'unlimited') {
    sdp = WebrtcBandwidth.setMediaBitrate(sdp, 'audio', audioMaxBitrate);
  }
  if (preferredCodecs && ConferenceType.video_audio) {
    preferredCodecs.forEach((codec) => {
      sdp = WebrtcCodecs.preferSelectedCodec(sdp, codec);
    });
  }
  return sdp;
};

const getDevices = async () => {
  // Handles being called several times to update labels. Preserve values.
  const audioInputs: { label: string; deviceInfo: MediaDeviceInfo }[] = [];
  const audioOutputs: { label: string; deviceInfo: MediaDeviceInfo }[] = [];
  const videoInputs: { label: string; deviceInfo: MediaDeviceInfo }[] = [];
  const deviceInfos = await navigator.mediaDevices.enumerateDevices().catch(console.log);
  if (!deviceInfos) {
    return {
      audioInputs,
      audioOutputs,
      videoInputs,
    };
  }

  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === 'audioinput') {
      audioInputs.push({ label: deviceInfo.label || `microphone ${audioInputs.length + 1}`, deviceInfo });
    } else if (deviceInfo.kind === 'audiooutput') {
      audioOutputs.push({ label: deviceInfo.label || `microphone ${audioOutputs.length + 1}`, deviceInfo });
    } else if (deviceInfo.kind === 'videoinput') {
      videoInputs.push({ label: deviceInfo.label || `microphone ${videoInputs.length + 1}`, deviceInfo });
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  return {
    audioInputs,
    audioOutputs,
    videoInputs,
  };
};

// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/restart-ice/js/main.js
/*const iceRestart = (pc: RTCPeerConnection) => {
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };
  offerOptions.iceRestart = true;
  pc.createOffer(offerOptions).then(onCreateOfferSuccess, onCreateSessionDescriptionError);
};*/

export default {
  getDevices,
  morphSDP,
};
