import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { AuthStackParamList } from '../types';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';
import { t } from '../i18n';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

export function SignupScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signup, isLoading, error, clearError } = useAuth();

  const handleSignup = async (data: any) => {
    clearError();
    try {
      await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        nationality: data.nationality,
        preferredLanguage: data.preferredLanguage,
        emergencyContact: data.emergencyContactName
          ? {
              name: data.emergencyContactName,
              phone: data.emergencyContactPhone || '',
              relationship: data.emergencyContactRelationship || '',
            }
          : undefined,
      });
      navigation.navigate('VerifyOTP', { email: data.email, type: 'signup' });
    } catch {
      // Error is handled in store
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('auth.signup')}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Create your MedAssist Global account
        </Text>

        <SignupForm
          onSubmit={handleSignup}
          onLogin={() => navigation.navigate('Login')}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
  },
});
