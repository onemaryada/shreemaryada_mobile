import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'shreemaryada-ems-storage',
  encryptionKey: 'shreemaryada-secure-key',
});

export const STORAGE_KEYS = {
  HAS_LAUNCHED: 'HAS_LAUNCHED',
  USER_THEME: 'USER_THEME',
};
