import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export async function setCache(key, data) {
  try {
    const val = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(val));
    return val;
  } catch (err) {
    return null;
  }
}
