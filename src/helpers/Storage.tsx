import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
  static map = {};

  static async initialize(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    for (const key of keys) {
      await this.readFromDB(key);
    }
  }

  static get(key: string): string {
    if (!Storage.map[key]) {
      return null;
    }
    return Storage.map[key];
  }

  static set(key: string, value: string) {
    Storage.map[key] = value;
    if (value === 'undefined' || value === null) {
      AsyncStorage.removeItem(key);
    } else {
      AsyncStorage.setItem(key, value);
    }
  }

  static remove(key: string) {
    AsyncStorage.removeItem(key);
    delete Storage.map[key];
  }

  static async readFromDB(key: string): Promise<void> {
    const value = await AsyncStorage.getItem(key);
    Storage.map[key] = value;
  }
}
