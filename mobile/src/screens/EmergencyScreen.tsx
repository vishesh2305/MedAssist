import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { EmergencyRequest, Hospital } from '../types';
import { useLocation } from '../hooks/useLocation';
import { useHospitals } from '../hooks/useHospitals';
import { useAuthStore } from '../store/authStore';
import { SOSButton } from '../components/emergency/SOSButton';
import { EmergencyStatusCard } from '../components/emergency/EmergencyStatusCard';
import { NearestHospitalCard } from '../components/emergency/NearestHospitalCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import api from '../lib/api';
import { t } from '../i18n';

export function EmergencyScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { location, refreshLocation } = useLocation();
  const { nearbyHospitals, fetchNearbyHospitals } = useHospitals();
  const user = useAuthStore((s) => s.user);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (location) {
      fetchNearbyHospitals(location.latitude, location.longitude);
    }
  }, [location, fetchNearbyHospitals]);

  const handleSOS = useCallback(() => {
    if (activeEmergency) {
      Alert.alert(
        t('emergency.cancel'),
        t('emergency.cancelConfirm'),
        [
          { text: t('common.no'), style: 'cancel' },
          {
            text: t('common.yes'),
            style: 'destructive',
            onPress: async () => {
              try {
                await api.post(`/emergency/${activeEmergency.id}/cancel`);
                setActiveEmergency(null);
              } catch {
                // Handle error
              }
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      t('emergency.sosButton'),
      'Are you sure you need emergency assistance?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: 'Yes, I need help',
          style: 'destructive',
          onPress: activateEmergency,
        },
      ]
    );
  }, [activeEmergency]);

  const activateEmergency = async () => {
    setIsActivating(true);
    try {
      await refreshLocation();
      const currentLocation = location || { latitude: 0, longitude: 0 };
      const response = await api.post('/emergency', {
        location: currentLocation,
      });
      setActiveEmergency(response.data.data);
    } catch {
      Alert.alert('Error', 'Failed to activate emergency services. Please call local emergency services directly.');
    }
    setIsActivating(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLocation();
    if (location) {
      await fetchNearbyHospitals(location.latitude, location.longitude);
    }
    setRefreshing(false);
  }, [location, refreshLocation, fetchNearbyHospitals]);

  const handleCallHospital = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom + 20,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('emergency.title')}
      </Text>

      <View style={styles.sosContainer}>
        <SOSButton
          onPress={handleSOS}
          isActive={!!activeEmergency}
          size={activeEmergency ? 110 : 140}
        />
        <Text style={[styles.sosHint, { color: theme.colors.textSecondary }]}>
          {isActivating
            ? t('emergency.activating')
            : activeEmergency
            ? t('emergency.active')
            : t('emergency.tapForHelp')}
        </Text>
      </View>

      {activeEmergency && (
        <View style={styles.section}>
          <EmergencyStatusCard emergency={activeEmergency} />
          <Button
            title={t('emergency.cancel')}
            onPress={handleSOS}
            variant="danger"
            fullWidth
            style={styles.cancelButton}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('emergency.nearestHospitals')}
        </Text>
        {nearbyHospitals.length > 0 ? (
          nearbyHospitals.slice(0, 5).map((hospital) => (
            <NearestHospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() => {}}
              onCall={() => handleCallHospital(hospital.phone)}
            />
          ))
        ) : (
          <Card>
            <View style={styles.emptyNearby}>
              <Ionicons name="location-outline" size={28} color={theme.colors.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {t('home.enableLocation')}
              </Text>
            </View>
          </Card>
        )}
      </View>

      {user?.emergencyContact && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('emergency.emergencyContacts')}
          </Text>
          <Card>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name="person" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: theme.colors.text }]}>
                  {user.emergencyContact.name}
                </Text>
                <Text style={[styles.contactDetail, { color: theme.colors.textSecondary }]}>
                  {user.emergencyContact.relationship} - {user.emergencyContact.phone}
                </Text>
              </View>
              <Button
                title={t('common.call')}
                onPress={() => Linking.openURL(`tel:${user.emergencyContact!.phone}`)}
                variant="primary"
                size="sm"
              />
            </View>
          </Card>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('emergency.history')}
        </Text>
        <EmptyState
          icon="time-outline"
          title={t('emergency.noHistory')}
          message="Past emergency requests will appear here."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sosContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  sosHint: {
    fontSize: 15,
    marginTop: 16,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 12,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
  },
  contactDetail: {
    fontSize: 13,
    marginTop: 2,
  },
});
