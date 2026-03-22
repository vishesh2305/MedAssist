import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../../theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const theme = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.8]),
  }));

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.colors.skeleton,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.colors.skeletonHighlight },
          animatedStyle,
        ]}
      />
    </View>
  );
}

export function HospitalCardSkeleton() {
  return (
    <View style={skeletonStyles.card}>
      <Skeleton width="100%" height={160} borderRadius={12} />
      <View style={skeletonStyles.content}>
        <Skeleton width="70%" height={18} style={skeletonStyles.mb8} />
        <Skeleton width="50%" height={14} style={skeletonStyles.mb8} />
        <View style={skeletonStyles.row}>
          <Skeleton width={60} height={24} borderRadius={12} />
          <Skeleton width={60} height={24} borderRadius={12} style={skeletonStyles.ml8} />
          <Skeleton width={60} height={24} borderRadius={12} style={skeletonStyles.ml8} />
        </View>
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  mb8: {
    marginBottom: 8,
  },
  ml8: {
    marginLeft: 8,
  },
});
