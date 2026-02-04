import { StateStorage } from 'zustand/middleware';
import { StorageService } from './StorageService';

export const zustandStorageAdapter = (storageService: StorageService): StateStorage => ({
  getItem: async (name: string): Promise<string | null> => {
    return storageService.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await storageService.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await storageService.removeItem(name);
  },
});
