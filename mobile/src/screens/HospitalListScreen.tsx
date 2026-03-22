import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { HospitalStackParamList, Hospital } from '../types';
import { useHospitals } from '../hooks/useHospitals';
import { SearchBar } from '../components/ui/SearchBar';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { HospitalFiltersSheet } from '../components/hospital/HospitalFilters';
import { EmptyState } from '../components/ui/EmptyState';
import { HospitalCardSkeleton } from '../components/ui/Skeleton';
import { t } from '../i18n';

type HospitalListNavProp = StackNavigationProp<HospitalStackParamList, 'HospitalList'>;

interface Props {
  navigation: HospitalListNavProp;
}

const FILTER_CHIPS = ['Emergency', '24h', 'English', 'Verified', 'Top Rated'];

export function HospitalListScreen({ navigation }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    hospitals,
    filters,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    refresh,
    loadMore,
    updateFilters,
    clearFilters,
    toggleFavorite,
    clearError,
  } = useHospitals();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.query) {
        updateFilters({ query: searchQuery || undefined });
        refresh();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filters.query, updateFilters, refresh]);

  const handleChipPress = (chip: string) => {
    switch (chip) {
      case 'Emergency':
        updateFilters({ hasEmergency: !filters.hasEmergency });
        break;
      case '24h':
        updateFilters({ is24Hours: !filters.is24Hours });
        break;
      case 'English':
        updateFilters({ language: filters.language === 'English' ? undefined : 'English' });
        break;
      case 'Verified':
        break;
      case 'Top Rated':
        updateFilters({ minRating: filters.minRating === 4 ? undefined : 4 });
        break;
    }
    refresh();
  };

  const isChipActive = (chip: string): boolean => {
    switch (chip) {
      case 'Emergency':
        return !!filters.hasEmergency;
      case '24h':
        return !!filters.is24Hours;
      case 'English':
        return filters.language === 'English';
      case 'Top Rated':
        return filters.minRating === 4;
      default:
        return false;
    }
  };

  const renderHospital = useCallback(
    ({ item }: { item: Hospital }) => (
      <HospitalCard
        hospital={item}
        onPress={() => navigation.navigate('HospitalDetail', { hospitalId: item.id })}
        onFavorite={() => toggleFavorite(item.id)}
      />
    ),
    [navigation, toggleFavorite]
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('hospitals.title')}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            style={[styles.viewToggle, { backgroundColor: theme.colors.surfaceSecondary }]}
          >
            <Ionicons
              name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
              size={18}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={[styles.filterButton, { backgroundColor: theme.colors.surfaceSecondary }]}
          >
            <Ionicons name="options-outline" size={18} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('home.searchPlaceholder')}
        style={styles.searchBar}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        style={styles.chipsScroll}
      >
        {FILTER_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip}
            onPress={() => handleChipPress(chip)}
            style={[
              styles.chip,
              {
                backgroundColor: isChipActive(chip)
                  ? theme.colors.primary
                  : theme.colors.surfaceSecondary,
                borderColor: isChipActive(chip)
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isChipActive(chip) ? '#FFFFFF' : theme.colors.textSecondary,
                },
              ]}
            >
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && hospitals.length === 0 ? (
        <View style={styles.skeletonContainer}>
          <HospitalCardSkeleton />
          <HospitalCardSkeleton />
          <HospitalCardSkeleton />
        </View>
      ) : hospitals.length === 0 ? (
        <EmptyState
          icon="medkit-outline"
          title={t('hospitals.noHospitals')}
          message={t('hospitals.tryDifferentFilters')}
          actionLabel={t('hospitals.clearFilters')}
          onAction={() => {
            clearFilters();
            setSearchQuery('');
            refresh();
          }}
        />
      ) : (
        <FlatList
          data={hospitals}
          renderItem={renderHospital}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
        />
      )}

      <HospitalFiltersSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={(f) => {
          updateFilters(f);
          refresh();
        }}
        onClear={() => {
          clearFilters();
          refresh();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  chipsScroll: {
    maxHeight: 44,
    marginBottom: 8,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
