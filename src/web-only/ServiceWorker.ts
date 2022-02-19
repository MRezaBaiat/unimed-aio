import { Workbox, messageSW } from 'workbox-window';
import AuthService from '../services/AuthService';
import store from '../redux/Store';
import { setVersion } from '../redux/actions/actions';
// all about workbox-window https://developers.google.com/web/tools/workbox/modules/workbox-window#advanced_bundling_concepts
const TAG = '[ServiceWorker-WB]';
const enabled = 'serviceWorker' in navigator;
console.log(TAG, 'service worker available ? ' + enabled);

const serviceWorker: Workbox | undefined = enabled ? (process.env.NODE_ENV === 'production' ? new Workbox('/expo-service-worker.js', { scope: '/' }) : new Workbox('/firebase-messaging-sw.js', { scope: '/' })) : undefined;
console.log(process.env.NODE_ENV);
if (enabled && serviceWorker) {
  serviceWorker.addEventListener('activated', (event) => {
    // `event.isUpdate` will be true if another version of the service
    // worker was controlling the page when this version was registered.
    if (!event.isUpdate) {
      console.log(TAG, 'Service worker activated for the first time!');

      if (event.isUpdate) {
        console.log(TAG, 'is update');
      }
      // If your service worker is configured to precache assets, those
      // assets should all be available now.
    }
  });
  serviceWorker.addEventListener('waiting', (event) => {
    console.log(TAG, "A new service worker has installed, but it can't activate" + 'until all tabs running the current version have fully unloaded.');
  });
  serviceWorker.addEventListener('activated', (event) => {
    initialize();
    AuthService.renewAuth();
    console.log(TAG, 'activated');
  });
  serviceWorker.addEventListener('activating', (event) => {
    console.log(TAG, 'activating');
  });
  serviceWorker.addEventListener('controlling', (event) => {
    console.log(TAG, 'controlling');
  });
  serviceWorker.addEventListener('installed', (event) => {
    console.log(TAG, 'installed');
  });
  serviceWorker.addEventListener('installing', (event) => {
    console.log(TAG, 'installing');
  });
  serviceWorker.addEventListener('redundant', (event) => {
    console.log(TAG, 'redundant');
  });
  serviceWorker.addEventListener('waiting', (event) => {
    // alert('a new update was found . please restart the app to apply changes');
    console.log(TAG, 'waiting');
  });
}

const getToken = async () => {
  if (!enabled) {
    return undefined;
  }
  return sendMessage('GET_TOKEN');
};

const getSW = () => {
  return navigator.serviceWorker.ready.then((service) => {
    console.log('ready');
    return service.active || service.installing || service.waiting;
  });
};

const skipWaiting = () => {
  return sendMessage('SKIP_WAITING');
};

const sendMessage = async (type: string, payload?: any) => {
  return getSW().then((sw) => {
    if (!sw) {
      return;
    }
    return messageSW(sw, { type, payload }).then((t) => {
      return t;
    });
  });
};

const logVersion = () => {
  if (!enabled) {
    return;
  }
  sendMessage('GET_VERSION').then((version) => {
    store.dispatch(setVersion(version));
    console.log(TAG, 'SW Version ' + version);
  });
};

const initialize = async () => {
  sendMessage('ping');
  logVersion();
  navigator.serviceWorker.ready.then((reg) => {
    reg.update();
  });
};

const register = async () => {
  if (!enabled || !serviceWorker) {
    return;
  }
  serviceWorker.update();
  serviceWorker.register();
  initialize();
};

export default {
  wb: serviceWorker,
  register,
  getToken,
  skipWaiting,
};
