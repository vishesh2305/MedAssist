import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { RootStackParamList, ThemeMode } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { SettingsItem } from '../components/profile/SettingsItem';
import { Divider } from '../components/ui/Divider';
import { t } from '../i18n';

type SettingsNavProp = StackNavigationProp<RootStackParamList>;

const THEME_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SettingsNavProp>();
  const settings = useSettingsStore();
  const logout = useAuthStore((s) => s.logout);

  const handleThemeChange = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(settings.theme);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    settings.setTheme(nextMode);
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), t('auth.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('settings.appearance')}
        </Text>
        <SettingsItem
          icon="contrast-outline"
          label={t('settings.theme')}
          value={THEME_LABELS[settings.theme]}
          onPress={handleThemeChange}
        />
        <SettingsItem
          icon="language-outline"
          label={t('settings.language')}
          value={settings.language.toUpperCase()}
          onPress={() => navigation.navigate('LanguageSelect')}
        />
      </View>

      <Divider spacing={8} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('settings.notifications')}
        </Text>
        <SettingsItem
          icon="notifications-outline"
          label={t('settings.notifications')}
          isToggle
          toggleValue={settings.notificationsEnabled}
          onToggle={settings.setNotificationsEnabled}
        />
      </View>

      <Divider spacing={8} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('settings.privacy')}
        </Text>
        <SettingsItem
          icon="location-outline"
          label={t('settings.locationServices')}
          isToggle
          toggleValue={settings.locationEnabled}
          onToggle={settings.setLocationEnabled}
        />
        <SettingsItem
          icon="phone-portrait-outline"
          label={t('settings.hapticFeedback')}
          isToggle
          toggleValue={settings.hapticEnabled}
          onToggle={settings.setHapticEnabled}
        />
      </View>

      <Divider spacing={8} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
          {t('settings.about')}
        </Text>
        <SettingsItem
          icon="information-circle-outline"
          label={t('settings.version')}
          value="1.0.0"
          onPress={() => {}}
        />
        <SettingsItem
          icon="document-text-outline"
          label={t('settings.termsOfService')}
          onPress={() => {}}
        />
        <SettingsItem
          icon="shield-outline"
          label={t('settings.privacyPolicy')}
          onPress={() => {}}
        />
        <SettingsItem
          icon="help-circle-outline"
          label={t('settings.contactSupport')}
          onPress={() => {}}
        />
      </View>

      <Divider spacing={8} />

      <View style={styles.section}>
        <SettingsItem
          icon="log-out-outline"
          label={t('auth.logout')}
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
});
