import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

let netInfo: NetInfoState | undefined;
let initialized = false;
const listeners: ((connected: boolean) => void)[] = [];

const init = async () => {
  if (initialized) {
    return;
  }
  initialized = true;

  NetInfo.addEventListener((connInfo: NetInfoState) => {
    if (netInfo && netInfo.isConnected === connInfo.isConnected) {
      netInfo = connInfo;
      return;
    }
    netInfo = connInfo;

    listeners.forEach((listener) => {
      try {
        listener(netInfo.isConnected);
      } catch (e) {
        console.log(e);
      }
    });
  });

  return NetInfo.fetch()
    .then((res) => {
      netInfo = res;
    })
    .catch((e) => {
      console.log(e);
    });
};

const isConnected = () => {
  return netInfo && netInfo.isConnected;
};

const isInternetAvailable = () => {
  return netInfo && netInfo.isInternetReachable;
};

const getNetInfo = () => {
  return netInfo;
};

const addListener = (listener: (isConnected: boolean) => void) => {
  listeners.push(listener);
};

const removeListener = (listener: (isConnected: boolean) => void) => {
  listeners.splice(listeners.indexOf(listener), 1);
};

export default {
  init,
  isConnected,
  isInternetAvailable,
  getNetInfo,
  addListener,
  removeListener,
};
