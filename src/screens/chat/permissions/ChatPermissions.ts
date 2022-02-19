import { Audio } from 'expo-av';
import AppPermissions from '../../../helpers/AppPermissions';
import * as Permissions from 'expo-permissions';

const initialize = async () => {
  AppPermissions.checkPermissions();
  /* return Permissions.askAsync(
    Permissions.AUDIO_RECORDING
  ); */
  // await Audio.requestPermissionsAsync();
};

export default {
  initialize,
};
