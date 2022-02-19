import OfflineStorage from './OfflineStorage';
import { AbstractCallMetric } from 'api';
import ChatService from '../services/ChatService';
const initialize = async () => {
  await OfflineStorage.initialize();
  ChatService.addListener(async (state) => {
    if (state === 'connected') {
      const offlines = await OfflineStorage.getAll();
      console.log('offlines size ' + offlines.length);
      offlines.forEach((r) => send(r));
    }
  });
};

const send = async (analytic: AbstractCallMetric<any>) => {
  console.log(analytic);
  await OfflineStorage.insert(analytic);
  if (ChatService.isConnected()) {
    ChatService.socket.emit('call-analytics', analytic, () => {
      OfflineStorage.remove(analytic);
    });
  }
};

export default {
  initialize,
  send,
};
