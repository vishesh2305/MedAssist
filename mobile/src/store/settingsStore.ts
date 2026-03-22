import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, Language, AppSettings } from '../types';

const SETTINGS_KEY = 'medassist_settings';

interface SettingsState extends AppSettings {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setLocationEnabled: (enabled: boolean) => Promise<void>;
  setHapticEnabled: (enabled: boolean) => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'en',
  notificationsEnabled: true,
  locationEnabled: true,
  hapticEnabled: true,
};

async function persistSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(SETTINGS_KEY);
    const current = existing ? JSON.parse(existing) : defaultSettings;
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {
    // Silently fail
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultSettings,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppSettings;
        set({ ...parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setTheme: async (theme: ThemeMode) => {
    set({ theme });
    await persistSettings({ theme });
  },

  setLanguage: async (language: Language) => {
    set({ language });
    await persistSettings({ language });
  },

  setNotificationsEnabled: async (enabled: boolean) => {
    set({ notificationsEnabled: enabled });
    await persistSettings({ notificationsEnabled: enabled });
  },

  setLocationEnabled: async (enabled: boolean) => {
    set({ locationEnabled: enabled });
    await persistSettings({ locationEnabled: enabled });
  },

  setHapticEnabled: async (enabled: boolean) => {
    set({ hapticEnabled: enabled });
    await persistSettings({ hapticEnabled: enabled });
  },
}));
