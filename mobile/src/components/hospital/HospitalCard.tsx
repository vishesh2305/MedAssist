import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme';
import { Hospital } from '../../types';
import { formatDistance } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { useSettingsStore } from '../../store/settingsStore';

interface HospitalCardProps {
  hospital: Hospital;
  onPress: () => void;
  onFavorite?: () => void;
  compact?: boolean;
}

export function HospitalCard({ hospital, onPress, onFavorite, compact = false }: HospitalCardProps) {
  const theme = useTheme();
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);

  const handleFavorite = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onFavorite?.();
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.compactCard,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
            shadowColor: theme.colors.shadow,
          },
        ]}
      >
        <Image
          source={{
            uri: hospital.coverImage || 'https://via.placeholder.com/200x120',
          }}
          style={styles.compactImage}
        />
        <View style={styles.compactContent}>
          <Text
            style={[styles.compactName, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {hospital.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={theme.colors.star} />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {hospital.rating.toFixed(1)}
            </Text>
          </View>
          {hospital.distance !== undefined && (
            <Text style={[styles.distanceText, { color: theme.colors.textTertiary }]}>
              {formatDistance(hospital.distance)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: hospital.coverImage || 'https://via.placeholder.com/400x200',
          }}
          style={styles.image}
        />
        {onFavorite && (
          <TouchableOpacity
            onPress={handleFavorite}
            style={[styles.favoriteButton, { backgroundColor: theme.colors.surface }]}
          >
            <Ionicons
              name={hospital.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={hospital.isFavorite ? theme.colors.danger : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        {hospital.hasEmergency && (
          <View style={styles.emergencyBadge}>
            <Badge label="Emergency" variant="danger" size="sm" />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
            {hospital.name}
          </Text>
          {hospital.isVerified && (
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
          )}
        </View>

        <View style={styles.ratingRow}>
          <Rating value={hospital.rating} size={14} />
          <Text style={[styles.ratingCount, { color: theme.colors.textSecondary }]}>
            ({hospital.reviewCount})
          </Text>
          {hospital.distance !== undefined && (
            <>
              <View style={[styles.dot, { backgroundColor: theme.colors.textTertiary }]} />
              <Ionicons name="location-outline" size={14} color={theme.colors.textTertiary} />
              <Text style={[styles.distanceText, { color: theme.colors.textTertiary }]}>
                {formatDistance(hospital.distance)}
              </Text>
            </>
          )}
        </View>

        <View style={styles.tagsRow}>
          {hospital.languages.slice(0, 3).map((lang) => (
            <Badge key={lang} label={lang} variant="neutral" size="sm" style={styles.tag} />
          ))}
          {hospital.is24Hours && (
            <Badge label="24h" variant="success" size="sm" style={styles.tag} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  content: {
    padding: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingCount: {
    fontSize: 13,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  distanceText: {
    fontSize: 13,
    marginLeft: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    marginRight: 0,
  },
  compactCard: {
    width: 180,
    borderRadius: 14,
    borderWidth: 1,
    marginRight: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  compactContent: {
    padding: 10,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 3,
  },
});
