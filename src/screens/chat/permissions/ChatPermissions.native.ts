import { Audio } from 'expo-av';

const initialize = async () => {
  await Audio.requestPermissionsAsync();
  // InCallManager.checkRecordPermission();
};

export default {
  initialize,
};
