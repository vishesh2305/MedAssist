import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../i18n';

interface SOSButtonProps {
  onPress: () => void;
  size?: number;
  isActive?: boolean;
}

export function SOSButton({ onPress, size = 140, isActive = false }: SOSButtonProps) {
  const theme = useTheme();
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const ring1Scale = useSharedValue(1);
  const ring2Scale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.3);
  const ring2Opacity = useSharedValue(0.15);

  useEffect(() => {
    ring1Scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200, easing: Easing.ease }),
        withTiming(1, { duration: 1200, easing: Easing.ease })
      ),
      -1,
      false
    );
    ring2Scale.value = withRepeat(
      withSequence(
        withTiming(1.6, { duration: 1500, easing: Easing.ease }),
        withTiming(1, { duration: 1500, easing: Easing.ease })
      ),
      -1,
      false
    );
    ring1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 })
      ),
      -1,
      false
    );
    ring2Opacity.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 1500 }),
        withTiming(0.15, { duration: 1500 })
      ),
      -1,
      false
    );
  }, [ring1Scale, ring2Scale, ring1Opacity, ring2Opacity]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring1Scale.value }],
    opacity: ring1Opacity.value,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ring2Scale.value }],
    opacity: ring2Opacity.value,
  }));

  const handlePress = () => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    onPress();
  };

  return (
    <View style={[styles.container, { width: size * 1.8, height: size * 1.8 }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: size * 0.8,
            backgroundColor: isActive ? theme.colors.warning : theme.colors.emergency,
          },
          ring2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size * 1.3,
            height: size * 1.3,
            borderRadius: size * 0.65,
            backgroundColor: isActive ? theme.colors.warning : theme.colors.emergency,
          },
          ring1Style,
        ]}
      />
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: isActive ? theme.colors.warning : theme.colors.emergency,
          },
        ]}
      >
        <Text style={[styles.sosText, { fontSize: size * 0.28 }]}>
          {t('emergency.sosButton')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 3,
  },
});
