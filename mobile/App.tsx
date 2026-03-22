import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useTheme } from './src/theme';
import { useAuthStore } from './src/store/authStore';
import { useSettingsStore } from './src/store/settingsStore';
import { useNotifications } from './src/hooks/useNotifications';
import { setLocale } from './src/i18n';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function AppContent() {
  const theme = useTheme();
  const initialize = useAuthStore((s) => s.initialize);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const language = useSettingsStore((s) => s.language);

  useNotifications();

  useEffect(() => {
    loadSettings();
    initialize();
  }, [loadSettings, initialize]);

  useEffect(() => {
    setLocale(language);
  }, [language]);

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer
        theme={{
          dark: theme.isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.danger,
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
