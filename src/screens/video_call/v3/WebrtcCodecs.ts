const preferSelectedCodec = (sdp: string, codec: 'vp8' | 'vp9' | 'h264') => {
  const info = splitLines(sdp);

  if (codec === 'vp8' && info.vp8LineNumber === info.videoCodecNumbers[0]) {
    return sdp;
  }

  if (codec === 'vp9' && info.vp9LineNumber === info.videoCodecNumbers[0]) {
    return sdp;
  }

  if (codec === 'h264' && info.h264LineNumber === info.videoCodecNumbers[0]) {
    return sdp;
  }

  sdp = preferCodec(sdp, codec, info);

  return sdp;
};

const preferCodec = (sdp: string, codec: string, info) => {
  let preferCodecNumber = '';

  if (codec === 'vp8') {
    if (!info.vp8LineNumber) {
      return sdp;
    }
    preferCodecNumber = info.vp8LineNumber;
  }

  if (codec === 'vp9') {
    if (!info.vp9LineNumber) {
      return sdp;
    }
    preferCodecNumber = info.vp9LineNumber;
  }

  if (codec === 'h264') {
    if (!info.h264LineNumber) {
      return sdp;
    }

    preferCodecNumber = info.h264LineNumber;
  }

  let newLine = info.videoCodecNumbersOriginal.split('SAVPF')[0] + 'SAVPF ';

  const newOrder = [preferCodecNumber];
  info.videoCodecNumbers.forEach(function (codecNumber) {
    if (codecNumber === preferCodecNumber) return;
    newOrder.push(codecNumber);
  });

  newLine += newOrder.join(' ');

  sdp = sdp.replace(info.videoCodecNumbersOriginal, newLine);
  return sdp;
};

const splitLines = (sdp: string) => {
  const info: any = {};
  sdp.split('\n').forEach(function (line) {
    if (line.indexOf('m=video') === 0) {
      info.videoCodecNumbers = [];
      line
        .split('SAVPF')[1]
        .split(' ')
        .forEach(function (codecNumber) {
          codecNumber = codecNumber.trim();
          if (!codecNumber || !codecNumber.length) return;
          info.videoCodecNumbers.push(codecNumber);
          info.videoCodecNumbersOriginal = line;
        });
    }

    if (line.indexOf('VP8/90000') !== -1 && !info.vp8LineNumber) {
      info.vp8LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
    }

    if (line.indexOf('VP9/90000') !== -1 && !info.vp9LineNumber) {
      info.vp9LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
    }

    if (line.indexOf('H264/90000') !== -1 && !info.h264LineNumber) {
      info.h264LineNumber = line.replace('a=rtpmap:', '').split(' ')[0];
    }
  });

  return info;
};

export default {
  preferSelectedCodec,
};
