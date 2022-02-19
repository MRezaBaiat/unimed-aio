import initStore from '../config/initStore';
import { Chat, DoctorStatus, PatientStatus, TypingStatus, User, Visit } from 'api';
import P2PRoom from '../screens/video_call/v3/P2PRoom';

export const store = initStore();

export type StoreType = {
  global: { version: string | undefined; pip: { render: () => JSX.Element } | undefined };
  authReducer: {
    authorization: string;
    updateInfo: {
      available: boolean;
    };
  };
  userReducer: { user: User; status: PatientStatus | DoctorStatus; finalizableVisits: Visit[]; isIpAllowed: boolean; lang: string };
  chatsReducer: { chats: Chat[]; typingStatusExpirationTimerId: number; typingStatus: TypingStatus };
  callReducer: {
    activeCall?: {
      connection: P2PRoom;
    };
  };
  queueReducer: { queue: number; estimated: number };
};

export default store;
