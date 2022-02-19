/* const setMediaBitrates = (sdp: string) => {
  return setMediaBitrate(setMediaBitrate(sdp, 'video', 125), 'audio', 50);
}; */

const setMediaBitrate = (sdp: string, media: 'video' | 'audio', bitrate: number) => {
  const lines = sdp.split('\n');
  let line = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('m=' + media) === 0) {
      line = i;
      break;
    }
  }
  if (line === -1) {
    console.debug('Could not find the m line for', media);
    return sdp;
  }
  console.debug('Found the m line for', media, 'at line', line);

  // Pass the m line
  line++;

  // Skip i and c lines
  while (lines[line].indexOf('i=') === 0 || lines[line].indexOf('c=') === 0) {
    line++;
  }

  // If we're on a b line, replace it
  if (lines[line].indexOf('b') === 0) {
    console.debug('Replaced b line at line', line);
    lines[line] = 'b=AS:' + bitrate;
    return lines.join('\n');
  }

  // Add a new b line
  console.debug('Adding new b line before line', line);
  let newLines = lines.slice(0, line);
  newLines.push('b=AS:' + bitrate);
  newLines = newLines.concat(lines.slice(line, lines.length));
  return newLines.join('\n');
};

/* // bandwidth eg. 125 , 500 , 1000, 2000  https://webrtc.github.io/samples/src/content/peerconnection/bandwidth/
const limitBandwidth = async (pc: RTCPeerConnection, bandwidth : number | 'unlimited') => {
  // In Chrome, use RTCRtpSender.setParameters to change bandwidth without
  // (local) renegotiation. Note that this will be within the envelope of
  // the initial maximum bandwidth negotiated via SDP.
  if ((adapter.browserDetails.browser === 'chrome' ||
    adapter.browserDetails.browser === 'safari' ||
    (adapter.browserDetails.browser === 'firefox' &&
      adapter.browserDetails.version >= 64)) &&
    'RTCRtpSender' in window &&
    'setParameters' in window.RTCRtpSender.prototype) {
    const sender = pc.getSenders()[0];
    const parameters = sender.getParameters();
    if (!parameters.encodings || !parameters.encodings[0]) {
      parameters.encodings = [{}];
    }
    if (bandwidth === 'unlimited') {
      delete parameters.encodings[0].maxBitrate;
    } else {
      parameters.encodings[0].maxBitrate = bandwidth * 1000;
    }
    sender.setParameters(parameters).catch(console.log);
    return;
  }
  // Fallback to the SDP munging with local renegotiation way of limiting
  // the bandwidth.
  return pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(() => {
      const desc = {
        type: pc.remoteDescription.type,
        sdp: bandwidth === 'unlimited'
          ? removeBandwidthRestriction(pc.remoteDescription.sdp)
          : updateBandwidthRestriction(pc.remoteDescription.sdp, bandwidth)
      };
      console.log('Applying bandwidth restriction to setRemoteDescription:\n' +
        desc.sdp);
      return pc.setRemoteDescription(desc);
    })
    .catch(onSetSessionDescriptionError);
};

function removeBandwidthRestriction (sdp: string) {
  return sdp.replace(/b=AS:.*\r\n/, '').replace(/b=TIAS:.*\r\n/, '');
}

function updateBandwidthRestriction (sdp: string, bandwidth: number | 'unlimited') {
  if (bandwidth === 'unlimited') {
    return removeBandwidthRestriction(sdp);
  }
  let modifier = 'AS';
  if (adapter.browserDetails.browser === 'firefox') {
    bandwidth = (bandwidth >>> 0) * 1000;
    modifier = 'TIAS';
  }
  if (sdp.indexOf('b=' + modifier + ':') === -1) {
    // insert b= after c= line.
    sdp = sdp.replace(/c=IN (.*)\r\n/, 'c=IN $1\r\nb=' + modifier + ':' + bandwidth + '\r\n');
  } else {
    sdp = sdp.replace(new RegExp('b=' + modifier + ':.*\r\n'), 'b=' + modifier + ':' + bandwidth + '\r\n');
  }
  return sdp;
}

async function applyBandwidthLimit (pc: RTCPeerConnection, limit: 125 | 250 | 500 | 1000 | 2000 | 'unlimited') {
  return new Promise((resolve, reject) => {
    pc.getSenders().forEach((sender) => {
      const parameters = sender.getParameters();
      if (!parameters.encodings || !parameters.encodings[0]) {
        parameters.encodings = [{}];
      }

      if (limit === 'unlimited') {
        delete parameters.encodings[0];
      } else {
        parameters.encodings[0].maxBitrate = limit * 1000;
      }
      sender.setParameters(parameters).catch(console.log).finally(resolve);
    });
  });
}

function onSetSessionDescriptionError (error) {
  console.log('Failed to set session description: ' + error.toString());
} */

export default {
  setMediaBitrate,
};
