import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { t } from '../../i18n';

interface ProfileFieldProps {
  label: string;
  value?: string;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.borderLight }]}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          styles.value,
          {
            color: value ? theme.colors.text : theme.colors.textTertiary,
          },
        ]}
      >
        {value || t('profile.notSet')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
