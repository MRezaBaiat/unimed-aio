import ServiceWorker from '../web-only/ServiceWorker';

// could try react-web-notification if audio or notification did not work

// TESTER GENERATOR = https://tests.peter.sh/notification-generator

// not that notification could be disabled from windows

const requestUserPermission = async () => {
  if ('Notification' in window) {
    try {
      return Notification.requestPermission()
        .then(() => {})
        .catch(console.log);
    } catch (e) {
      return new Promise<void>((resolve) => {
        Notification.requestPermission((status) => {
          resolve();
        });
      });
    }
  }
};
const getRegistrationToken = async () => {
  console.log('getting token');
  const token = await ServiceWorker.getToken();
  console.log('token', token);
  return token;
};
const initialize = async () => {
  /* return navigator.serviceWorker.register('firebase-messaging-sw.js', { scope: 'SW_PUBLIC_SCOPE' }).then((registration) => {
    swRegistration = registration;

  }).catch(console.log); */
};
const subscribeToTopics = () => {
  // registration.pushManager.subscribe()
};
const unsubscribeFromTopics = () => {};
const resetBadgeNumber = () => {};

export default {
  requestUserPermission,
  getRegistrationToken,
  initialize,
  subscribeToTopics,
  unsubscribeFromTopics,
  resetBadgeNumber,
};
