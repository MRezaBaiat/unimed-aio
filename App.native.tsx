import React, { useLayoutEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Storage from './src/helpers/Storage';
import NetUtils from './src/helpers/NetUtils';
import { Audio } from 'expo-av';
import R from './src/assets/R';
import PushNotificationService from './src/services/PushNotificationService';
import AuthService from './src/services/AuthService';
import config from './src/config/config';
import { actionSetLang } from './src/redux/actions/users_actions';
import store from './src/redux/Store';
import { Provider, useSelector } from 'react-redux';
import FileSystem from './src/cache/file-system/FileSystem';
import AppCenter from 'appcenter';
import SyncScreen from './src/screens/sync_screen/SyncScreen';
import { registerGlobals } from 'react-native-webrtc';
import Analytics from './src/analytics/analytics';
import 'react-native-url-polyfill/auto';
import queueMicrotask from 'queue-microtask';
import Crashes, { ErrorAttachmentLog } from 'appcenter-crashes';

registerGlobals();

/* RTCPeerConnection.prototype.addTrack = function (track, stream) {
  this.removeStream(stream);
  this.addStream(stream);
}; */
if (!process.nextTick) {
  process.nextTick = setImmediate;
}
if (!global.queueMicrotask) {
  global.queueMicrotask = queueMicrotask;
}
console.disableYellowBox = true;

// Sound.setCategory('Playback');

Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
});

global.playLocalSound = async (soundName: 'voice_visit_time_ended' | 'dial_tone') => {
  const { sound } = await Audio.Sound.createAsync(soundName === 'voice_visit_time_ended' ? R.sounds.voice_visit_time_ended : R.sounds.dial_tone);
  sound.playAsync();
  const endListeners: any[] = [];
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.positionMillis === status.durationMillis) {
      sound.unloadAsync();
      endListeners.forEach((l) => l());
    }
  });
  return {
    setOnEndListener: (cb) => {
      endListeners.push(cb);
    },
    stop: () => {
      sound.unloadAsync();
    },
  };
};

export default function App() {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const init = async () => {
      AppCenter.setEnabled(true);
      Crashes.setEnabled(true);
      Crashes.setListener({
        getErrorAttachments: async (report) => {
          const textAttachment = ErrorAttachmentLog.attachmentWithText('user', JSON.stringify(store.getState().userReducer.user || {}));
          return [textAttachment];
        },
      });
      await Storage.initialize();
      await NetUtils.init();
      await PushNotificationService.initialize();
      await AuthService.initialize();
      await FileSystem.getFileSystem(true).initialize();
      await FileSystem.getFileSystem(false).initialize();
      await FileSystem.getFileSystem(true).purge();
      await Analytics.initialize();
      store.dispatch(actionSetLang(config.readLanguage()));
      setReady(true);
    };
    init();
  }, []);

  return ready ? <Render /> : null;
}

const Render = () => (
  <React.StrictMode>
    <Provider store={store}>
      <SyncScreen />
    </Provider>
  </React.StrictMode>
);
