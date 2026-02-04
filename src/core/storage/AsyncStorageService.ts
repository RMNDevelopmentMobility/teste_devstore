import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from './StorageService';

export class AsyncStorageService implements StorageService {
  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }
}

export const asyncStorageService = new AsyncStorageService();
