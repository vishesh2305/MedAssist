import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

export function SettingsItem({
  icon,
  label,
  value,
  isToggle = false,
  toggleValue = false,
  onToggle,
  onPress,
  danger = false,
}: SettingsItemProps) {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, { borderBottomColor: theme.colors.borderLight }]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: danger
              ? theme.colors.dangerLight
              : theme.colors.primaryFaded,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={danger ? theme.colors.danger : theme.colors.primary}
        />
      </View>
      <Text
        style={[
          styles.label,
          { color: danger ? theme.colors.danger : theme.colors.text },
        ]}
      >
        {label}
      </Text>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primaryLight,
          }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={styles.right}>
          {value && (
            <Text style={[styles.value, { color: theme.colors.textTertiary }]}>
              {value}
            </Text>
          )}
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textTertiary}
          />
        </View>
      )}
    </View>
  );

  if (onPress && !isToggle) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 14,
  },
});
