import Storage from '../helpers/Storage';
import { Platform } from 'react-native';

export const maxAppWidth = Platform.OS === 'web' ? 700 : Number.MAX_SAFE_INTEGER;
export const maxAppHeight = Platform.OS === 'web' ? 1200 : Number.MAX_SAFE_INTEGER;
export const videoCallVersion = '2';

const setNewPatientVoiceMode = (mode: 'notification' | 'voice') => {
  Storage.set('voice_mode_2', mode);
};

const getNewPatientVoiceMode = (): 'notification' | 'voice' => {
  return Storage.get('voice_mode_2') || 'voice';
};

const saveLanguage = (lang: 'fa' | 'en') => {
  Storage.set('language', lang);
};

const readLanguage = (): 'fa' | 'en' => {
  return Storage.get('language') || 'fa';
};

export default {
  setNewPatientVoiceMode,
  getNewPatientVoiceMode,
  saveLanguage,
  readLanguage,
};
