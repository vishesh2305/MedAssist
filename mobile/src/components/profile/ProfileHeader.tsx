import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { User } from '../../types';
import { Avatar } from '../ui/Avatar';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Avatar
        uri={user.avatar}
        firstName={user.firstName}
        lastName={user.lastName}
        size={80}
      />
      <Text style={[styles.name, { color: theme.colors.text }]}>
        {user.firstName} {user.lastName}
      </Text>
      {user.nationality && (
        <Text style={[styles.nationality, { color: theme.colors.textSecondary }]}>
          {user.nationality}
        </Text>
      )}
      <Text style={[styles.email, { color: theme.colors.textTertiary }]}>{user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  nationality: {
    fontSize: 15,
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
});
