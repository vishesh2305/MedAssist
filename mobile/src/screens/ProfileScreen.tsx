import React from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileField } from '../components/profile/ProfileField';
import { SettingsItem } from '../components/profile/SettingsItem';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { t } from '../i18n';
import { formatDate } from '../lib/utils';

type ProfileNavProp = StackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ProfileNavProp>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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

  if (!user) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader user={user} />

      <View style={styles.section}>
        <Button
          title={t('profile.editProfile')}
          onPress={() => navigation.navigate('EditProfile')}
          variant="outline"
          fullWidth
          style={styles.editButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('profile.personalInfo')}
        </Text>
        <Card>
          <ProfileField label={t('auth.email')} value={user.email} />
          <ProfileField label={t('auth.firstName')} value={user.firstName} />
          <ProfileField label={t('auth.lastName')} value={user.lastName} />
          <ProfileField label={t('auth.nationality')} value={user.nationality} />
          <ProfileField label={t('auth.preferredLanguage')} value={user.preferredLanguage} />
        </Card>
      </View>

      {user.emergencyContact && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('profile.emergencyContact')}
          </Text>
          <Card>
            <ProfileField label={t('auth.contactName')} value={user.emergencyContact.name} />
            <ProfileField label={t('auth.contactPhone')} value={user.emergencyContact.phone} />
            <ProfileField label={t('auth.relationship')} value={user.emergencyContact.relationship} />
          </Card>
        </View>
      )}

      {user.medicalNotes && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('profile.medicalNotes')}
          </Text>
          <Card>
            <Text style={[styles.notesText, { color: theme.colors.textSecondary }]}>
              {user.medicalNotes}
            </Text>
          </Card>
        </View>
      )}

      {user.travelStatus && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('profile.travelStatus')}
          </Text>
          <Card>
            <ProfileField label={t('profile.country')} value={user.travelStatus.country} />
            <ProfileField label={t('profile.city')} value={user.travelStatus.city} />
            <ProfileField
              label={t('profile.arrivalDate')}
              value={user.travelStatus.arrivalDate ? formatDate(user.travelStatus.arrivalDate) : undefined}
            />
            <ProfileField
              label={t('profile.departureDate')}
              value={user.travelStatus.departureDate ? formatDate(user.travelStatus.departureDate) : undefined}
            />
            <ProfileField label={t('profile.insurance')} value={user.travelStatus.insuranceProvider} />
          </Card>
        </View>
      )}

      <View style={styles.section}>
        <SettingsItem
          icon="heart-outline"
          label={t('profile.favorites')}
          onPress={() => navigation.navigate('Favorites')}
        />
        <SettingsItem
          icon="settings-outline"
          label={t('profile.settings')}
          onPress={() => navigation.navigate('Settings')}
        />
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  editButton: {
    marginBottom: 0,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
