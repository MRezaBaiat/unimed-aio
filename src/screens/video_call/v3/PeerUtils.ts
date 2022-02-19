//@ts-nocheck
import SDP from './SDP';

async function _renegotiate(pc: RTCPeerConnection, isInitiator: boolean, optionalRemoteSdp?: string) {
  if (pc.signalingState === 'closed') {
    return Promise.reject(new Error('Attempted to renegotiate in state closed'));
  }

  const remoteSdp = optionalRemoteSdp || pc.remoteDescription.sdp;

  const remoteDescription = new RTCSessionDescription({
    type: isInitiator ? 'answer' : 'offer',
    sdp: remoteSdp,
  });

  if (this.isInitiator) {
    return this._initiatorRenegotiate(remoteDescription);
  }

  return this._responderRenegotiate(remoteDescription);
}

/**
 * Renegotiate cycle implementation for the initiator's case.
 * @param {object} remoteDescription the SDP object as defined by the WebRTC
 * which will be used as remote description in the cycle.
 * @private
 */
function _initiatorRenegotiate(pc, remoteDescription) {
  return pc.createOffer(mediaConstraints).then((offer) => {
    logger.debug('Renegotiate: setting local description');

    return this.peerconnection.setLocalDescription(offer).then(() => {
      logger.debug('Renegotiate: setting remote description');

      // eslint-disable-next-line max-len
      return this.peerconnection.setRemoteDescription(remoteDescription);
    });
  });
}

export default {
  _renegotiate,
};
