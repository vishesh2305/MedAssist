import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../i18n';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onPhoneLogin: () => void;
  onForgotPassword: () => void;
  onSignup: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  onPhoneLogin,
  onForgotPassword,
  onSignup,
  isLoading,
  error,
}: LoginFormProps) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <View style={styles.container}>
      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.dangerLight }]}>
          <Ionicons name="alert-circle" size={18} color={theme.colors.danger} />
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
        </View>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t('auth.email')}
            value={value}
            onChangeText={onChange}
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label={t('auth.password')}
            value={value}
            onChangeText={onChange}
            icon="lock-closed-outline"
            placeholder="Enter your password"
            isPassword
            error={errors.password?.message}
          />
        )}
      />

      <TouchableOpacity onPress={onForgotPassword} style={styles.forgotButton}>
        <Text style={[styles.forgotText, { color: theme.colors.primary }]}>
          {t('auth.forgotPassword')}
        </Text>
      </TouchableOpacity>

      <Button
        title={t('auth.login')}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        fullWidth
        style={styles.loginButton}
      />

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>
          {t('auth.orContinueWith')}
        </Text>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
      </View>

      <Button
        title={t('auth.phoneLogin')}
        onPress={onPhoneLogin}
        variant="outline"
        fullWidth
        icon={<Ionicons name="phone-portrait-outline" size={18} color={theme.colors.primary} />}
      />

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: theme.colors.backgroundTertiary }]}
        >
          <Ionicons name="logo-google" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: theme.colors.backgroundTertiary }]}
        >
          <Ionicons name="logo-apple" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.signupRow}>
        <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>
          {t('auth.noAccount')}{' '}
        </Text>
        <TouchableOpacity onPress={onSignup}>
          <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
            {t('auth.signup')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    flex: 1,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
