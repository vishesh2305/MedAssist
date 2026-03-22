import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme';
import { RootStackParamList, Hospital } from '../types';
import { useAuthStore } from '../store/authStore';
import { useHospitals } from '../hooks/useHospitals';
import { useLocation } from '../hooks/useLocation';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { t } from '../i18n';

type HomeNavProp = StackNavigationProp<RootStackParamList>;

const SPECIALTIES = [
  { id: '1', name: 'General', icon: 'medical-outline' as const },
  { id: '2', name: 'Cardiology', icon: 'heart-outline' as const },
  { id: '3', name: 'Orthopedics', icon: 'body-outline' as const },
  { id: '4', name: 'Pediatrics', icon: 'happy-outline' as const },
  { id: '5', name: 'Dentistry', icon: 'nutrition-outline' as const },
  { id: '6', name: 'Eye Care', icon: 'eye-outline' as const },
  { id: '7', name: 'Dermatology', icon: 'leaf-outline' as const },
  { id: '8', name: 'Neurology', icon: 'pulse-outline' as const },
];

export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNavProp>();
  const user = useAuthStore((s) => s.user);
  const { nearbyHospitals, recentlyViewed, fetchNearbyHospitals, isRefreshing } = useHospitals();
  const { location } = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (location) {
      fetchNearbyHospitals(location.latitude, location.longitude);
    }
  }, [location, fetchNearbyHospitals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (location) {
      await fetchNearbyHospitals(location.latitude, location.longitude);
    }
    setRefreshing(false);
  }, [location, fetchNearbyHospitals]);

  const navigateToHospital = (hospitalId: string) => {
    navigation.navigate('Main', {
      screen: 'Hospitals',
      params: {
        screen: 'HospitalDetail',
        params: { hospitalId },
      },
    } as any);
  };

  const renderNearbyHospital = ({ item }: { item: Hospital }) => (
    <HospitalCard
      hospital={item}
      onPress={() => navigateToHospital(item.id)}
      compact
    />
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
            {t('home.greeting', { name: user?.firstName || 'Traveler' })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Main', { screen: 'Profile' } as any)}
          style={[styles.avatarButton, { backgroundColor: theme.colors.primaryFaded }]}
        >
          <Ionicons name="person" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={t('home.searchPlaceholder')}
        style={styles.searchBar}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Main', { screen: 'Emergency' } as any)}
        activeOpacity={0.8}
      >
        <Card
          style={[
            styles.emergencyCard,
            { backgroundColor: theme.colors.dangerLight, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.emergencyContent}>
            <View style={[styles.emergencyIcon, { backgroundColor: theme.colors.danger }]}>
              <Ionicons name="warning" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.emergencyText}>
              <Text style={[styles.emergencyTitle, { color: theme.colors.danger }]}>
                {t('home.emergencyHelp')}
              </Text>
              <Text style={[styles.emergencySubtitle, { color: theme.colors.textSecondary }]}>
                {t('home.tapForHelp')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.danger} />
          </View>
        </Card>
      </TouchableOpacity>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('home.nearbyHospitals')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Main', { screen: 'Hospitals' } as any)}
          >
            <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
              {t('common.viewAll')}
            </Text>
          </TouchableOpacity>
        </View>
        {nearbyHospitals.length > 0 ? (
          <FlatList
            data={nearbyHospitals.slice(0, 5)}
            renderItem={renderNearbyHospital}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <Card>
            <View style={styles.emptyNearby}>
              <Ionicons name="location-outline" size={32} color={theme.colors.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {location ? t('home.noNearby') : t('home.enableLocation')}
              </Text>
            </View>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('home.specialties')}
        </Text>
        <View style={styles.specialtiesGrid}>
          {SPECIALTIES.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={[
                styles.specialtyItem,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
              activeOpacity={0.7}
            >
              <View style={[styles.specialtyIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name={spec.icon} size={22} color={theme.colors.primary} />
              </View>
              <Text
                style={[styles.specialtyName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {spec.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {recentlyViewed.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('home.recentlyViewed')}
          </Text>
          {recentlyViewed.slice(0, 3).map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() => navigateToHospital(hospital.id)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('home.quickActions')}
        </Text>
        <View style={styles.quickActions}>
          {[
            { icon: 'search-outline' as const, label: t('home.findDoctor'), screen: 'Hospitals' },
            { icon: 'warning-outline' as const, label: t('home.emergency'), screen: 'Emergency' },
            { icon: 'chatbubble-outline' as const, label: t('home.chatSupport'), screen: 'Chat' },
          ].map((action) => (
            <TouchableOpacity
              key={action.screen}
              onPress={() => navigation.navigate('Main', { screen: action.screen } as any)}
              style={[styles.quickAction, { backgroundColor: theme.colors.surfaceSecondary }]}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name={action.icon} size={22} color={theme.colors.primary} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  emergencyCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emergencySubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  emptyNearby: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  specialtyItem: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  specialtyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  specialtyName: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
