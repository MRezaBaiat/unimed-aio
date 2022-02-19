self.importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
self.importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');

const FB_TAG = '[firebase-messaging-sw]';
self.firebase.initializeApp({
  apiKey: "AIzaSyCtQj_j2i44jayQ6_rqx0SE4rPe_E7IQIA",
  authDomain: "unimed-8d288.firebaseapp.com",
  projectId: "unimed-8d288",
  storageBucket: "unimed-8d288.appspot.com",
  messagingSenderId: "1070287198148",
  appId: "1:1070287198148:web:d0ef93c07f9591b1763691",
  measurementId: "G-TXBFTKXN52"
});

let messaging;

if (self.firebase.messaging.isSupported()) {
  messaging = self.firebase.messaging();
}
const getToken = async () => {
  if (!messaging) {
    return undefined;
  }
  if (Notification.permission !== 'granted') {
    console.log(FB_TAG, 'no permission was granted to generate a token');
    return undefined;
  }
  return messaging.getToken({
    vapidKey: 'BAximMMYnCN0FwZYO5oCLoe1Nr1WIJ3ELzjbNadGEJEH6dJZGSRp2nzNpScTTz8fwrXvR5ZR19xbH5ysSWubfSM',
    serviceWorkerRegistration: self.registration
  }).then((token) => {
    return token;
  }).catch((e) => {
    console.log(e);
    return undefined;
  });
};

self.addEventListener('error', (e) => {
  console.log(FB_TAG, 'unregistered due to an error');
  console.log(e);
  getClient().then((client) => {
    return client && client.postMessage({ type: 'error', payload: { message: e.message } });
  }).finally(() => {
    // self.registration && self.registration.unregister();
  });
});

let client;
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  const port = event.ports[0];
  console.log(FB_TAG, event);
  if (type === 'ping') {
    console.log('ping', 'got client');
    // getToken();
    client = event.source;
    self.registration && self.registration.active && event.waitUntil(self.clients.claim());
    port.postMessage({});
  } else if (type === 'SKIP_WAITING') {
    self.skipWaiting();
    port.postMessage({});
  } else if (type === 'GET_TOKEN') {
    getToken().then((token) => {
      console.log('responding with ', token);
      port.postMessage(token);
    }).catch(console.log);
  } else {
    console.log(FB_TAG, 'Unknown mesage type :' + type);
  }
});

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('notificationclick', event => {
  console.log('on notification click');
  console.log(event);
  // event.notification.close();
  return event;
});

self.addEventListener('push', function (event) { // : PushEvent
  console.log(event);
  const payload = event.data.json();
  if (payload.data && payload.data.notification) {
    const notifData = JSON.parse(payload.data.notification);
    if (notifData.soundName) {
      getClient().then((client) => {
        client && client.postMessage({ type: 'play-sound', soundName: notifData.soundName });
      });
    }
  }

  isForeground().then((foreground) => {
    if (foreground) {
      console.log('was foreground');
      foreground && self.registration.showNotification(payload.notification.title, {
        ...payload.notification
      });
    }
  });
  // console.log('Received push in firebase-service version ' + SW_VERSION, payload);
  /* event.waitUntil(self.registration.getNotifications().then((notifications) => {
      notifications.forEach(function (notification) {
        notification.close();
      });
      return self.registration.showNotification(payload.notification.title, {
        ...payload.notification
      });
    })); */
});

const getClient = async () => {
  return self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((clients) => {
    return clients[0];
  });
};

const isForeground = () => {
  return self.clients.matchAll({
    type: 'window'
  })
    .then(function (windowClients) {
      let clientIsVisible = false;

      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        console.log(client);
        if (client.visibilityState === 'visible') { // if (client.url === '/' && client.visibilityState === 'visible' && client.focused) {
          clientIsVisible = true;
          break;
        }
      }

      return clientIsVisible;
    });
};

// only show on foreground = https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#when_to_show_notifications
// get all notifications and close = https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications#serviceworkerjs_8
