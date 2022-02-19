class Bandwidth {
  availableSendBandwidth!: string;
  encodedPerSecond!: number;
  googActualEncBitrate!: string;
  googAvailableReceiveBandwidth!: string;
  googAvailableSendBandwidth!: string;
  googBucketDelay!: string;
  googRetransmitBitrate!: string;
  googTargetEncBitrate!: string;
  googTransmitBitrate!: string;
  helper!: { audioBytesSent: number; videoBytesSent: number };
  sentPerSecond!: number;
  speed!: number; // bandwidth upload speed (bytes per second)
  systemBandwidth!: number;
}
class Connection {
  candidateType!: string[];
  ipAddress!: string[];
  networkType!: string[];
  transport!: string[];
}
class BandwidthTransfer {
  availableBandwidth!: number;
  bitrateMean!: number;
  codecs!: string[];
  framerateMean!: number;
  streams!: number;
  tracks!: string[];
}
class TrackerTransfer {
  bytesReceived!: number;
  bytesSent!: number;
  latency!: number;
  packetsLost!: string;
  recv!: BandwidthTransfer;
  send!: BandwidthTransfer;
}
class Resolution {
  width!: string;
  height!: string;
}
export default class StreamStats {
  private readonly nomore: () => void;
  private readonly resolutions: {
    recv: Resolution;
    send: Resolution;
  };

  private connectionType: {
    local: Connection;
    remote: Connection;
    systemIpAddress: string[];
    systemNetworkType: string;
    transport: string;
    encryption: string;
    ended: boolean;
  };

  private audio: TrackerTransfer;
  private video: TrackerTransfer;
  private bandwidth: Bandwidth;
  public receivedBytesPerSecond = 0;
  public sentBytesPerSecond = 0;

  constructor(stats) {
    this.resolutions = stats.resolutions;
    this.audio = stats.audio;
    this.video = stats.video;
    this.connectionType = stats.connectionType;
    this.bandwidth = stats.bandwidth;
    this.nomore = stats.nomore;
  }

  public stop() {
    return this.nomore();
  }

  public sendResolution() {
    if (!this.resolutions) {
      return 'Unknown';
    }
    return this.resolutions.send.width + 'x' + this.resolutions.send.height;
  }

  public receiveResolution() {
    if (!this.resolutions) {
      return 'Unknown';
    }
    return this.resolutions.recv.width + 'x' + this.resolutions.recv.height;
  }

  public audioBytesReceived() {
    return this.audio.bytesReceived;
  }

  public videoBytesReceived() {
    return this.video.bytesReceived;
  }

  public audioBytesSent() {
    return this.bandwidth.helper.audioBytesSent;
  }

  public videoBytesSent() {
    return this.bandwidth.helper.videoBytesSent;
  }

  public audioLatency() {
    return this.audio.latency;
  }

  public videoLatency() {
    return this.video.latency;
  }

  public videoPacketLoss() {
    return this.video.packetsLost;
  }

  public audioPacketLoss() {
    return this.audio.packetsLost;
  }

  public getSpeed() {
    return this.bandwidth.speed;
  }

  public totalSent() {
    return this.audio.bytesSent + this.video.bytesSent;
  }

  public totalReceived() {
    return this.audio.bytesReceived + this.video.bytesReceived;
  }

  public availableSendBandwidth() {
    return this.bandwidth.availableSendBandwidth;
  }

  public transportType() {
    return this.connectionType.transport;
  }

  public getLogs = () => {
    return {
      bandwidth: {
        speed: this.getSpeed(),
        available: this.availableSendBandwidth(),
      },
      latency: {
        video: this.videoLatency(),
        audio: this.audioLatency(),
      },
    };
  };

  /* ↑${bytesToSize(this.receivedBytesPerSecond)}/s
↓${bytesToSize(this.receivedBytesPerSecond)}/s */
  public getReports(): string {
    const { bytesToSize } = StreamStats;
    return ` (${this.transportType()})
bandwidth :  ↑${bytesToSize(this.getSpeed())} / ${bytesToSize(Number(this.availableSendBandwidth()))}
data:        ↑${bytesToSize(this.totalSent())} ↓${bytesToSize(this.totalReceived())}
latency:     video:${this.videoLatency()}ms, audio:${this.audioLatency()}ms
packet loss: video:${this.videoPacketLoss()}, audio:${this.audioPacketLoss()}
resolutions: ↑${this.sendResolution()} ↓${this.receiveResolution()}
codecs:      ↑${this.audio.send.codecs.concat(this.video.send.codecs).join(', ')} ↓${this.audio.recv.codecs.concat(this.video.recv.codecs).join(', ')}`;
  }

  // private static bytesToSize (bytes, decimals = 2) {
  //   if (bytes <= 0) {
  //     return '0 Bytes';
  //   }
  //
  //   const k = 1024;
  //   const dm = decimals < 0 ? 0 : decimals;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  //
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  // }

  private static bytesToSize(bytes: number) {
    const k = 1000;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes <= 0) {
      return '0 Bytes';
    }
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(k))), 10);

    if (!sizes[i]) {
      return '0 Bytes';
    }

    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
  }
}
