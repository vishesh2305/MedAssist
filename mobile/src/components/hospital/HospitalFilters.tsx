import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { HospitalFilters as HospitalFiltersType } from '../../types';
import { t } from '../../i18n';

const SPECIALTIES = [
  'General', 'Cardiology', 'Orthopedics', 'Dermatology', 'Pediatrics',
  'Ophthalmology', 'Dentistry', 'ENT', 'Neurology', 'Gynecology',
];

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Arabic',
  'Chinese', 'Hindi', 'Japanese', 'Korean', 'Portuguese',
];

const RATINGS = [4.5, 4.0, 3.5, 3.0];

interface HospitalFiltersProps {
  visible: boolean;
  onClose: () => void;
  filters: HospitalFiltersType;
  onApply: (filters: Partial<HospitalFiltersType>) => void;
  onClear: () => void;
}

export function HospitalFiltersSheet({
  visible,
  onClose,
  filters,
  onApply,
  onClear,
}: HospitalFiltersProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<HospitalFiltersType>(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={t('hospitals.filters')}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('hospitals.specialty')}
        </Text>
        <View style={styles.chipContainer}>
          {SPECIALTIES.map((spec) => (
            <TouchableOpacity
              key={spec}
              onPress={() =>
                setLocalFilters((f) => ({
                  ...f,
                  specialty: f.specialty === spec ? undefined : spec,
                }))
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    localFilters.specialty === spec
                      ? theme.colors.primary
                      : theme.colors.backgroundTertiary,
                  borderColor:
                    localFilters.specialty === spec
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      localFilters.specialty === spec
                        ? '#FFFFFF'
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('hospitals.languages')}
        </Text>
        <View style={styles.chipContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() =>
                setLocalFilters((f) => ({
                  ...f,
                  language: f.language === lang ? undefined : lang,
                }))
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    localFilters.language === lang
                      ? theme.colors.primary
                      : theme.colors.backgroundTertiary,
                  borderColor:
                    localFilters.language === lang
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      localFilters.language === lang
                        ? '#FFFFFF'
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('hospitals.rating')}
        </Text>
        <View style={styles.chipContainer}>
          {RATINGS.map((rating) => (
            <TouchableOpacity
              key={rating}
              onPress={() =>
                setLocalFilters((f) => ({
                  ...f,
                  minRating: f.minRating === rating ? undefined : rating,
                }))
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    localFilters.minRating === rating
                      ? theme.colors.primary
                      : theme.colors.backgroundTertiary,
                  borderColor:
                    localFilters.minRating === rating
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color:
                      localFilters.minRating === rating
                        ? '#FFFFFF'
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {rating}+ Stars
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
            {t('hospitals.emergency')}
          </Text>
          <Switch
            value={localFilters.hasEmergency || false}
            onValueChange={(val) =>
              setLocalFilters((f) => ({ ...f, hasEmergency: val || undefined }))
            }
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
            {t('hospitals.open24h')}
          </Text>
          <Switch
            value={localFilters.is24Hours || false}
            onValueChange={(val) =>
              setLocalFilters((f) => ({ ...f, is24Hours: val || undefined }))
            }
            trackColor={{ false: theme.colors.border, true: theme.colors.primaryLight }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            title={t('hospitals.clearFilters')}
            onPress={handleClear}
            variant="outline"
            style={styles.filterButton}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            style={styles.filterButton}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: {
    maxHeight: 500,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
  },
});
