import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '../theme';
import { useAuthStore } from '../store/authStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { t } from '../i18n';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  nationality: string;
  medicalNotes: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export function EditProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isLoading = useAuthStore((s) => s.isLoading);

  const { control, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      nationality: user?.nationality || '',
      medicalNotes: user?.medicalNotes || '',
      emergencyContactName: user?.emergencyContact?.name || '',
      emergencyContactPhone: user?.emergencyContact?.phone || '',
      emergencyContactRelationship: user?.emergencyContact?.relationship || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        nationality: data.nationality || undefined,
        medicalNotes: data.medicalNotes || undefined,
        emergencyContact: data.emergencyContactName
          ? {
              name: data.emergencyContactName,
              phone: data.emergencyContactPhone,
              relationship: data.emergencyContactRelationship,
            }
          : undefined,
      });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.firstName')}
              value={value}
              onChangeText={onChange}
              icon="person-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.lastName')}
              value={value}
              onChangeText={onChange}
              icon="person-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="nationality"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.nationality')}
              value={value}
              onChangeText={onChange}
              icon="flag-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="medicalNotes"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('profile.medicalNotes')}
              value={value}
              onChangeText={onChange}
              icon="document-text-outline"
              multiline
              numberOfLines={4}
            />
          )}
        />

        <View style={styles.sectionHeader}>
          <View style={[styles.sectionLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <Controller
          control={control}
          name="emergencyContactName"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.contactName')}
              value={value}
              onChangeText={onChange}
              icon="person-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="emergencyContactPhone"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.contactPhone')}
              value={value}
              onChangeText={onChange}
              icon="call-outline"
              keyboardType="phone-pad"
            />
          )}
        />
        <Controller
          control={control}
          name="emergencyContactRelationship"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.relationship')}
              value={value}
              onChangeText={onChange}
              icon="people-outline"
            />
          )}
        />

        <Button
          title={t('common.save')}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          size="lg"
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginVertical: 16,
  },
  sectionLine: {
    height: StyleSheet.hairlineWidth,
  },
  saveButton: {
    marginTop: 16,
  },
});
