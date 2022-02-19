import messaging from '@react-native-firebase/messaging';
import AuthService from './AuthService';
import Notifications from 'react-native-push-notification';
import { Platform } from 'react-native';
import { getMyUserType } from '../helpers';
import { UserType } from 'api';

const subscribeToTopics = () => {
  if (AuthService.isAuthenticated()) {
    if (getMyUserType() === UserType.DOCTOR) {
      Notifications.subscribeToTopic('doctor'); // .catch(console.log);
    } else if (getMyUserType() === UserType.PATIENT) {
      Notifications.subscribeToTopic('patient'); // .catch(console.log);
    }
  }
};

const unsubscribeFromTopics = () => {
  Notifications.unsubscribeFromTopic('doctor'); // .catch(console.log);
  Notifications.unsubscribeFromTopic('patient'); // .catch(console.log);
};

const resetBadgeNumber = () => {
  try {
    Notifications.setApplicationIconBadgeNumber(0);
  } catch (e) {
    console.log(e);
  }
};

const initialize = () => {
  messaging().onMessage(async (message) => onMessageReceived('foreground', message));
  messaging().setBackgroundMessageHandler(async (message) => onMessageReceived('background', message));

  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    messaging().registerDeviceForRemoteMessages().catch(console.log);
  }

  /* messaging().onTokenRefresh(fcmToken => {
    AuthService.renewAuth();
  }); */

  Notifications.subscribeToTopic('all-devices'); // .catch(console.log);

  if (Platform.OS === 'android') {
    Notifications.subscribeToTopic('android'); // .catch(console.log);
  } else {
    Notifications.subscribeToTopic('ios'); // .catch(console.log);
  }

  if (AuthService.isAuthenticated()) {
    subscribeToTopics();
  }

  Notifications.configure({
    onRegister: function (token) {
      AuthService.renewAuth();
      console.log('TOKEN:', token);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
    onRemoteFetch: function (notification) {
      console.log('onRemoteFetch');
    },

    onNotification: function (notification) {
      // onMessageReceived('foreground', notification); // this will not show if packet contains notification and app is in the background , because the app itself should be handling it
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  });

  /* AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => async (taskData) => {
    onMessageReceived(true, taskData);
    // (required) Called when a remote is received or opened, or local notification is opened
  }); */

  Notifications.createChannel(
    {
      channelId: 'default',
      channelName: 'default',
      channelDescription: 'default',
      soundName: 'default',
      vibrate: true,
      importance: 4,
    },
    () => {}
  );
  Notifications.createChannel(
    {
      channelId: 'visit-started',
      channelName: 'visit-started',
      channelDescription: 'visit-started',
      importance: 4,
      vibrate: true,
      soundName: 'voice_mode_1.mp3',
    },
    () => {}
  );
  Notifications.createChannel(
    {
      channelId: 'patient-in-queue',
      channelName: 'patient-in-queue',
      channelDescription: 'patient-in-queue',
      importance: 4,
      vibrate: true,
      soundName: 'voice_mode_2.mp3',
    },
    () => {}
  );
  Notifications.createChannel(
    {
      channelId: 'visit-time-ended',
      channelName: 'visit-time-ended',
      channelDescription: 'visit-time-ended',
      importance: 4,
      vibrate: true,
      soundName: 'voice_visit_time_ended.mp3',
    },
    () => {}
  );
};

const requestUserPermission = async () => {
  // await messaging().requestPermission();

  await Notifications.requestPermissions(['sound', 'alert']);
};

// must be async
async function onMessageReceived(source, notification) {
  // Boolean(notification.invokeApp) && invokeApp();
  console.log('notification from ' + source, notification);
  /* const { tag } = notification;
  if (tag) {
    Linking.openURL(tag);
  } */
  if (notification.notification && source === 'background') {
    console.log('prevented replaying notification');
  } else {
    if (notification.data && notification.data.notification) {
      // changes for the new version
      if (source === 'background' && notification.notification) {
        return;
      }
      const message = JSON.parse(notification.data.notification);
      if (source !== 'background' && message.ignoreInForeground) {
        return;
      }
      console.log('showing');
      Notifications.localNotification(message);
    }
  }
  /*
    if (config.getNewPatientVoiceMode() === 'voice') {
      invokeApp();
      soundName = 'voice_mode_2.mp3';
    }
    */

  // localNotif('voice_mode_2.mp3');
}

/* function localNotif (soundName) {
  Notifications.localNotification({
    /!* Android Only Properties *!/
    channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
    ticker: 'My Notification Ticker', // (optional)
    autoCancel: true, // (optional) default: true
    largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
    smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
    subText: 'This is a subText', // (optional) default: none
    color: 'red', // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: 'group', // (optional) add group to message
    groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
    usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
    timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

    /!* iOS only properties *!/
    category: '', // (optional) default: empty string

    /!* iOS and Android properties *!/
    title: 'Local Notification', // (optional)
    message: 'My Notification Message', // (required)
    userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: !!soundName, // (optional) default: true
    soundName: soundName || 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10 // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  });
} */

const getRegistrationToken = () => {
  return messaging()
    .requestPermission()
    .then(() => {
      return messaging()
        .getToken()
        .then((fcmToken) => {
          console.log(fcmToken);
          if (fcmToken) {
            // user has a device token
          } else {
            // user doesn't have a device token yet
          }
          return fcmToken;
        });
    });
};

export default {
  requestUserPermission,
  getRegistrationToken,
  initialize,
  subscribeToTopics,
  unsubscribeFromTopics,
  resetBadgeNumber,
};
