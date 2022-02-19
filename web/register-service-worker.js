/* eslint-env browser */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function () {
    /* await navigator.serviceWorker.register('SW_PUBLIC_URL/expo-service-worker.js', { scope: 'SW_PUBLIC_SCOPE' }).then((reg) => {
      console.log('expo-service-worker.js', 'registered at scope ' + reg.scope);
    }).catch(console.log); */

    /* await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: 'SW_PUBLIC_SCOPE' }).then((reg)=>{
      console.log('firebase-messaging-sw.js', 'registered at scope ' + reg.scope);
    }).catch(console.log); */
  });
}
