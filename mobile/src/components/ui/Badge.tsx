import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', size = 'md', style }: BadgeProps) {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.colors.primaryFaded, text: theme.colors.primary };
      case 'success':
        return { bg: theme.colors.successLight, text: theme.colors.success };
      case 'warning':
        return { bg: theme.colors.warningLight, text: theme.colors.warning };
      case 'danger':
        return { bg: theme.colors.dangerLight, text: theme.colors.danger };
      case 'info':
        return { bg: theme.colors.infoLight, text: theme.colors.info };
      case 'neutral':
        return { bg: theme.colors.backgroundTertiary, text: theme.colors.textSecondary };
      default:
        return { bg: theme.colors.primaryFaded, text: theme.colors.primary };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: size === 'sm' ? 8 : 10,
          paddingVertical: size === 'sm' ? 2 : 4,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: size === 'sm' ? 10 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
