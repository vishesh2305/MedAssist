import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface RatingProps {
  value: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  style?: ViewStyle;
}

export function Rating({
  value,
  maxStars = 5,
  size = 18,
  interactive = false,
  onChange,
  style,
}: RatingProps) {
  const theme = useTheme();

  const renderStar = (index: number) => {
    const filled = index < Math.floor(value);
    const halfFilled = !filled && index < value;

    const iconName = filled
      ? 'star'
      : halfFilled
      ? 'star-half'
      : 'star-outline';

    const color = filled || halfFilled ? theme.colors.star : theme.colors.starEmpty;

    const star = (
      <Ionicons name={iconName} size={size} color={color} style={styles.star} />
    );

    if (interactive && onChange) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onChange(index + 1)}
          activeOpacity={0.7}
        >
          {star}
        </TouchableOpacity>
      );
    }

    return <View key={index}>{star}</View>;
  };

  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
});
