interface SDPProps {
  type?: 'offer' | 'pranswer' | 'answer' | 'rollback';
  sdp?: any;
  candidate?: any;
  readyAcknowledged?: boolean;
  ready?: boolean;
}
export default class SDP {
  public candidate?: any;
  public sdp?: any;
  public to!: string;
  public from!: string;
  public offerId!: string;
  public type?: 'offer' | 'pranswer' | 'answer' | 'rollback';

  constructor(props: SDPProps) {
    Object.assign(this, props);
  }
}
