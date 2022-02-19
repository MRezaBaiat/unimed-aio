import webrtcStats from 'getstats';
import StreamStats from './StreamStats';
import { isSafari } from '../../../helpers';

export default class WebrtcStats {
  private cache: any = {};
  private pc?: RTCPeerConnection;
  private started = false;
  public start = (pc: RTCPeerConnection, interval: number, cb: (stats: StreamStats) => void) => {
    if (this.started || !pc) {
      return;
    }
    if (isSafari) {
      return;
    }
    this.started = true;
    this.pc = pc;
    webrtcStats(
      pc,
      async (result) => {
        const stats = new StreamStats(result);
        // await this.inboundBytesPS(result, stats);
        // await this.outboundBytesPS(result, stats);
        cb(stats);
      },
      interval
    );
  };

  private inboundBytesPS = async (result, stats: StreamStats) => {
    const { cache, pc } = this;
    if (!pc) {
      return;
    }
    let bytesPS = 0;
    for (const receiver of pc.getReceivers()) {
      const reportStats = await receiver.getStats();
      reportStats.forEach((report) => {
        if (report.type !== 'outbound-rtp') {
          return;
        }
        const key = 'last-inbound-rtp-' + report.mediaType;
        const prevReport = cache[key];

        if (prevReport) {
          bytesPS += (report.bytesReceived - prevReport.bytesReceived) / ((report.timestamp - prevReport.timestamp) / 1000);
        }
        cache[key] = report;
      });
    }
    stats.receivedBytesPerSecond = bytesPS;
  };

  private outboundBytesPS = async (result, stats: StreamStats) => {
    const { cache, pc } = this;
    if (!pc) {
      return;
    }
    let bytesPS = 0;
    for (const sender of pc.getSenders()) {
      const reportStats = await sender.getStats();
      reportStats.forEach((report) => {
        if (report.type !== 'outbound-rtp') {
          return;
        }
        const key = 'last-outbound-rtp-' + report.mediaType;
        const prevReport = cache[key];

        if (prevReport) {
          bytesPS += (report.headerBytesSent - prevReport.headerBytesSent) / ((report.timestamp - prevReport.timestamp) / 1000);
        }
        cache[key] = report;
      });
    }
    stats.sentBytesPerSecond = bytesPS;

    /* const now = report.timestamp;
    const headerBytes = report.headerBytesSent;
    const packets = report.packetsSent;

    if (lastResult && lastResult.has(report.id)) {
      const headerrate = 8 * (headerBytes - lastResult.get(report.id).headerBytesSent) /
        (now - lastResult.get(report.id).timestamp);

      return packets; */
  };
}
