// Platform-agnostic storage wrapper
const isWeb = typeof window !== 'undefined' && window.localStorage;

export const storage = {
  getItem: async (key: string) => {
    try {
      if (isWeb) {
        return window.localStorage.getItem(key);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (isWeb) {
        window.localStorage.setItem(key, value);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('Storage setItem error:', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (isWeb) {
        window.localStorage.removeItem(key);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.error('Storage removeItem error:', e);
    }
  },
};