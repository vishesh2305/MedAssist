import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { RootStackParamList, Hospital } from '../types';
import { useHospitals } from '../hooks/useHospitals';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { EmptyState } from '../components/ui/EmptyState';
import { t } from '../i18n';

type FavoritesNavProp = StackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const theme = useTheme();
  const navigation = useNavigation<FavoritesNavProp>();
  const { favorites, fetchFavorites, toggleFavorite } = useHospitals();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFavorites();
    setRefreshing(false);
  }, [fetchFavorites]);

  const renderHospital = ({ item }: { item: Hospital }) => (
    <HospitalCard
      hospital={{ ...item, isFavorite: true }}
      onPress={() => {
        navigation.navigate('Main', {
          screen: 'Hospitals',
          params: {
            screen: 'HospitalDetail',
            params: { hospitalId: item.id },
          },
        } as any);
      }}
      onFavorite={() => toggleFavorite(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title={t('favorites.noFavorites')}
          message={t('favorites.addFavorites')}
        />
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderHospital}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
});
