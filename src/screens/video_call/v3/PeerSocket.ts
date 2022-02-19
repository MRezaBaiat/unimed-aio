import SDP from './SDP';
import { socket } from '../../../services/ChatService';
import Stream from './Stream';
import { getMyUserId } from '../../../helpers';

export default class PeerSocket extends Stream {
  private readonly conferenceId: string;
  private readonly userId: string;
  private readonly myUserId = getMyUserId();
  constructor(conferenceId: string, userId: string) {
    super();
    this.conferenceId = conferenceId;
    this.userId = userId;
  }

  public emit(sdp: SDP) {
    sdp.to = this.userId;
    sdp.from = this.myUserId;
    sdp.offerId = this.conferenceId;
    console.log('webrtc-socket', 'SENDING SDP');
    socket.emit('exchange-sdp', sdp);
  }
}
