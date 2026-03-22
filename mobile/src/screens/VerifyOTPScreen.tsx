import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AuthStackParamList } from '../types';
import { OTPInput } from '../components/auth/OTPInput';
import { useAuth } from '../hooks/useAuth';
import { t } from '../i18n';

type VerifyOTPNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyOTP'>;
type VerifyOTPRouteProp = RouteProp<AuthStackParamList, 'VerifyOTP'>;

interface Props {
  navigation: VerifyOTPNavigationProp;
  route: VerifyOTPRouteProp;
}

export function VerifyOTPScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { email } = route.params;
  const { verifyOTP, isLoading } = useAuth();

  const handleComplete = async (code: string) => {
    try {
      await verifyOTP(email, code);
    } catch {
      // Error handled in store
    }
  };

  const handleResend = () => {
    // Resend OTP logic
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryFaded }]}>
        <Ionicons name="mail-outline" size={40} color={theme.colors.primary} />
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('auth.verifyEmail')}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {t('auth.enterCode')}
      </Text>
      <Text style={[styles.email, { color: theme.colors.primary }]}>{email}</Text>

      <View style={styles.otpContainer}>
        <OTPInput onComplete={handleComplete} onResend={handleResend} />
      </View>

      {isLoading && (
        <Text style={[styles.verifying, { color: theme.colors.textTertiary }]}>
          Verifying...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  otpContainer: {
    marginBottom: 24,
  },
  verifying: {
    textAlign: 'center',
    fontSize: 14,
  },
});
