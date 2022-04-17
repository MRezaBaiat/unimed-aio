import React, { useLayoutEffect, useState } from 'react';
import Storage from './src/helpers/Storage';
import NetUtils from './src/helpers/NetUtils';
import R from './src/assets/R';
import ServiceWorker from './src/web-only/ServiceWorker';
import ResizeObserver from 'resize-observer-polyfill';
import AuthService from './src/services/AuthService';
import PushNotificationService from './src/services/PushNotificationService';
import { Provider, useSelector } from 'react-redux';
import config from './src/config/config';
import { actionSetLang } from './src/redux/actions/users_actions';
import store from './src/redux/Store';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import { getActionFromState, getFocusedRouteNameFromRoute, getPathFromState, getStateFromPath, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import RootStack, { PreloadFallback } from './src/navigation/Routes';
import AppTextView from './src/components/base/app-text-view/AppTextView';
import FileSystem from './src/cache/file-system/FileSystem';
import { Audio } from 'expo-av';
import { Howl } from 'howler';
import Analytics from './src/analytics/analytics';

Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
});
/*
to implement:
https://github.com/expo/expo/tree/master/packages/expo-analytics-amplitude
https://github.com/xcarpentier/rn-tourguide
https://github.com/onubo/react-native-logs
https://github.com/seniv/react-native-notifier
*/

/*
AudioRecorder.encoder = mpegEncoder;
AudioRecorder.prototype.mimeType = 'audio/mp3';
window.MediaRecorder = AudioRecorder;
*/

new ResizeObserver((entries, observer) => {}).observe(document.body);

const TAG = '[initializer]';

// Howler.autoSuspend = false;
// Howler.autoUnlock = true;
// Howler.usingWebAudio = true;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('error', (err) => {
    console.log(TAG, 'unregistering serviceworker due to an error');
    console.log(TAG, err);
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => {
        reg.unregister().catch(console.log);
      });
      alert('App reloaded due to an error');
      window.location.reload();
    });
  });
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        console.log(TAG, 'update found');
        const installingWorker = reg.installing;
        installingWorker &&
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log(TAG, 'should be auto refreshing now due to update');
              let refreshing;
              navigator.serviceWorker.addEventListener('controllerchange', function () {
                !refreshing && window.location.reload();
                refreshing = true;
              });
              installingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
      });
    });
  }

  navigator.serviceWorker.addEventListener('message', async (event) => {
    const { data } = event;
    console.log(TAG, 'on message', event);
    if (data === 'cacheDidUpdate') {
      console.log('cacheDidUpdate', event);
    } else if (data.type === 'play-sound') {
      console.log(TAG, 'playing sound ' + data.soundName);
      playLocalSound(data.soundName.replace('.mp3', '')).catch(console.log);
    } else if (data.meta === 'workbox-broadcast-update') {
      const { cacheName, updatedUrl } = event.data.payload;
      console.log(TAG, 'workbox-broadcast-update received');
      const cache = await caches.open(cacheName);
      const updatedResponse = await cache.match(updatedUrl);
      const updatedText = await updatedResponse.text();
    } else if (data.type === 'token-refresh') {
      AuthService.renewAuth();
    } else if (data.type === 'error') {
      console.error(data.payload.message);
    }
  });
}

global.playLocalSound = async (soundName: 'voice_visit_time_ended' | 'dial_tone') => {
  const sound = new Howl({
    src: [R.sounds[soundName]],
  });
  sound.play();
  const endListeners: any[] = [];
  sound.on('end', () => {
    sound.unload();
    endListeners.forEach((l) => l());
  });
  // const { sound } = await Audio.Sound.createAsync(soundName === 'voice_visit_time_ended' ? R.sounds.voice_visit_time_ended : R.sounds.dial_tone);
  // await sound.playAsync();
  return {
    setOnEndListener: (cb) => {
      endListeners.push(cb);
      /* sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.positionMillis === status.durationMillis) {
          cb();
        }
      }); */
    },
    stop: () => {
      sound.unload();
      // sound.unloadAsync();
    },
  };
  /* const sound = new Howl({
    src: [R.sounds[soundName]]
  });
  sound.play();
  return {
    setOnEndListener: (cb) => {
      sound.once('end', cb);
    },
    stop: () => {
      sound.stop();
    }
  }; */
};

const staticPaths = ['/payment-done'];

const isStatic = () =>
  Boolean(
    staticPaths.find((p) => {
      return window.location.hash.startsWith('#' + p);
    })
  );

export default function App() {
  const [ready, setReady] = useState(isStatic());

  useLayoutEffect(() => {
    if (ready) {
      return;
    }
    const init = async () => {
      await Storage.initialize();
      await NetUtils.init();
      await ServiceWorker.register();
      await PushNotificationService.initialize();
      await AuthService.initialize();
      await FileSystem.getFileSystem(true).initialize();
      await FileSystem.getFileSystem(false).initialize();
      await Analytics.initialize();
      store.dispatch(actionSetLang(config.readLanguage()));
      await Font.loadAsync({
        Shabnam: {
          uri: require('./src/assets/fonts/Shabnam.ttf'),
          display: Font.FontDisplay.BLOCK,
        },
        'Shabnam-Bold': {
          uri: require('./src/assets/fonts/Shabnam-Bold.ttf'),
          display: Font.FontDisplay.BLOCK,
        },
        'Shabnam-FD': {
          uri: require('./src/assets/fonts/Shabnam-FD.ttf'),
          display: Font.FontDisplay.BLOCK,
        },
        'Shabnam-Bold-FD': {
          uri: require('./src/assets/fonts/Shabnam-Bold-FD.ttf'),
          display: Font.FontDisplay.BLOCK,
        },
      });
      console.log('initialized');
      setReady(true);
    };
    init().catch(console.error);
  }, [ready]);

  return ready ? <Render /> : null;
}

const linking = {
  prefixes: [Linking.createURL('/')],
  getFocusedRouteNameFromRoute,
  getActionFromState,
  getStateFromPath: (path, options) => {
    if (window.location.hash) {
      path = window.location.hash.replace('#/', '');
      return getStateFromPath(path, options);
    }
    if (path === '') {
      path = '/SplashScreen';
    }
    return getStateFromPath(path, options);
  },
  getPathFromState: (state, options) => {
    if (!window.location.hash && window.location.pathname !== '/' && window.location.pathname !== '') {
      location.href = location.origin + '/#' + window.location.pathname + window.location.search;
    }
    const res = getPathFromState(state, options);
    /* if (isStatic()) {
          return '#' + getPathFromState(state, options);
        } */
    return '#' + res;
  },
};

function WaterMark() {
  const version = useSelector((s) => s.global.version);
  return <AppTextView style={{ position: 'absolute', zIndex: Number.MAX_SAFE_INTEGER, top: 5, left: 5 }} textColor={'grey'} text={version ? `v${version}` : ''} />;
}

const Render = () => (
  <Provider store={store}>
    <NavigationContainer
      linking={linking}
      onReady={() => {
        if (!isStatic()) {
          if (window.location.hash && window.location.hash !== '#/SplashScreen') {
            window.location.replace(window.origin);
          }
        }
      }}
      ref={AppNavigator.setTopLevelNavigator}
      fallback={<PreloadFallback />}
    >
      <WaterMark />
      <RootStack initial={'SplashScreen'} />
    </NavigationContainer>
  </Provider>
);
