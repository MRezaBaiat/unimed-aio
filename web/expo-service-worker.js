/* eslint-env serviceworker */

/**
 * Store notification icon string in service worker.
 * Ref: https://stackoverflow.com/a/35729334/2603230
 */
const SW_VERSION = '1.0.1';
const TAG = '[service-worker]';
console.log(TAG, 'service worker started with version ' + SW_VERSION);

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage(SW_VERSION);
  }
});

// TODO: Consider cache: https://github.com/expo/expo-cli/pull/844#issuecomment-515619883
// Import the script generated by workbox.
self.importScripts('service-worker.js');
self.importScripts('firebase-messaging-sw.js');
