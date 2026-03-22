import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../../theme';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { t } from '../../i18n';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    nationality: z.string().optional(),
    preferredLanguage: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  onLogin: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function SignupForm({ onSubmit, onLogin, isLoading, error }: SignupFormProps) {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      nationality: '',
      preferredLanguage: 'en',
    },
  });

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(['email', 'password', 'confirmPassword']);
    } else if (step === 2) {
      valid = await trigger(['firstName', 'lastName']);
    }
    if (valid && step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.stepText, { color: theme.colors.textTertiary }]}>
        {t('auth.step', { current: step, total: totalSteps })}
      </Text>

      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  i < step ? theme.colors.primary : theme.colors.border,
                flex: 1,
              },
            ]}
          />
        ))}
      </View>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.dangerLight }]}>
          <Text style={[styles.errorText, { color: theme.colors.danger }]}>{error}</Text>
        </View>
      )}

      {step === 1 && (
        <>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.email')}
                value={value}
                onChangeText={onChange}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
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
                isPassword
                error={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.confirmPassword')}
                value={value}
                onChangeText={onChange}
                icon="lock-closed-outline"
                isPassword
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.firstName')}
                value={value}
                onChangeText={onChange}
                icon="person-outline"
                error={errors.firstName?.message}
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
                error={errors.lastName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="nationality"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.nationality')}
                value={value || ''}
                onChangeText={onChange}
                icon="flag-outline"
              />
            )}
          />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('auth.emergencyContact')} (Optional)
          </Text>
          <Controller
            control={control}
            name="emergencyContactName"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.contactName')}
                value={value || ''}
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
                value={value || ''}
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
                value={value || ''}
                onChangeText={onChange}
                icon="people-outline"
              />
            )}
          />
        </>
      )}

      <View style={styles.buttonRow}>
        {step > 1 && (
          <Button title={t('common.back')} onPress={prevStep} variant="outline" style={styles.backButton} />
        )}
        {step < totalSteps ? (
          <Button title={t('onboarding.next')} onPress={nextStep} style={styles.nextButton} />
        ) : (
          <Button
            title={t('auth.signup')}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.nextButton}
          />
        )}
      </View>

      <View style={styles.loginRow}>
        <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
          {t('auth.hasAccount')}{' '}
        </Text>
        <TouchableOpacity onPress={onLogin}>
          <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
            {t('auth.login')}
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
  stepText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    flex: 0.4,
  },
  nextButton: {
    flex: 1,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
