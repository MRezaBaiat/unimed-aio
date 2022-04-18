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

const saveLanguage = (lang: 'az' | 'en') => {
  lang && Storage.set('language', lang);
};

const readLanguage = (): 'az' | 'en' => {
  return Storage.get('language');
};

const isLanguageSet = () => {
  return Boolean(Storage.get('language'));
};

export default {
  setNewPatientVoiceMode,
  getNewPatientVoiceMode,
  saveLanguage,
  readLanguage,
  isLanguageSet,
};
