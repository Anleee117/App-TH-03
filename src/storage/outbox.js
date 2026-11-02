import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';

export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function enqueue(action) {
  try {
    const list = await getAll();
    const item = {
      id: action.id || Date.now().toString(),
      method: action.method,
      url: action.url,
      body: action.body || null,
      createdAt: action.createdAt || new Date().toISOString(),
    };
    list.push(item);
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(list));
    return item;
  } catch (err) {
    return null;
  }
}

export async function remove(id) {
  try {
    const list = await getAll();
    const nextList = list.filter(item => item.id !== id);
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(nextList));
    return nextList;
  } catch (err) {
    return [];
  }
}
