import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../theme';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { ChatScreen } from '../screens/ChatScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const theme = useTheme();

  if (!isInitialized) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              headerTitle: 'Settings',
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text,
            }}
          />
          <Stack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              headerShown: true,
              headerTitle: 'Favorites',
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              headerTitle: 'Edit Profile',
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text,
            }}
          />
          <Stack.Screen
            name="LanguageSelect"
            component={LanguageScreen}
            options={{
              headerShown: true,
              headerTitle: 'Language',
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text,
            }}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: theme.colors.surface },
              headerTintColor: theme.colors.text,
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
