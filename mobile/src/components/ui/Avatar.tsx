import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { getInitials } from '../../lib/utils';

interface AvatarProps {
  uri?: string;
  firstName?: string;
  lastName?: string;
  size?: number;
  showOnline?: boolean;
  isOnline?: boolean;
}

export function Avatar({
  uri,
  firstName = '',
  lastName = '',
  size = 44,
  showOnline = false,
  isOnline = false,
}: AvatarProps) {
  const theme = useTheme();
  const initials = getInitials(firstName || '?', lastName || '?');

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.colors.primaryFaded,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                color: theme.colors.primary,
                fontSize: size * 0.38,
              },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}
      {showOnline && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isOnline ? theme.colors.online : theme.colors.offline,
              borderColor: theme.colors.background,
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: size * 0.14,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
  statusDot: {
    position: 'absolute',
    borderWidth: 2,
  },
});
