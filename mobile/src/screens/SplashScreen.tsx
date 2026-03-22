import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { AuthStackParamList } from '../types';
import { useAuthStore } from '../store/authStore';

type SplashScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export function SplashScreen({ navigation }: Props) {
  const theme = useTheme();
  const { initialize, isAuthenticated } = useAuthStore();
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 500, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 200 })
    );
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    const timer = setTimeout(async () => {
      await initialize();
    }, 1500);

    return () => clearTimeout(timer);
  }, [initialize, logoOpacity, logoScale, textOpacity]);

  useEffect(() => {
    const { isInitialized, isAuthenticated: isAuth } = useAuthStore.getState();
    if (isInitialized) {
      if (!isAuth) {
        navigation.replace('Onboarding');
      }
    }
  }, [isAuthenticated, navigation]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.iconWrapper}>
          <Ionicons name="medical" size={56} color="#FFFFFF" />
        </View>
      </Animated.View>
      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.title}>MedAssist</Text>
        <Text style={styles.subtitle}>Global</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: 2,
  },
});
