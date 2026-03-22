import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { EmergencyRequest, EmergencyStatus } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { t } from '../../i18n';

interface EmergencyStatusCardProps {
  emergency: EmergencyRequest;
}

const STATUS_CONFIG: Record<
  EmergencyStatus,
  { icon: keyof typeof Ionicons.glyphMap; variant: 'warning' | 'info' | 'success' | 'danger' | 'neutral'; key: string }
> = {
  pending: { icon: 'hourglass-outline', variant: 'warning', key: 'pending' },
  acknowledged: { icon: 'checkmark-circle-outline', variant: 'info', key: 'acknowledged' },
  dispatched: { icon: 'car-outline', variant: 'info', key: 'dispatched' },
  en_route: { icon: 'navigate-outline', variant: 'warning', key: 'enRoute' },
  arrived: { icon: 'location', variant: 'success', key: 'arrived' },
  completed: { icon: 'checkmark-done-circle', variant: 'success', key: 'completed' },
  cancelled: { icon: 'close-circle-outline', variant: 'danger', key: 'cancelled' },
};

export function EmergencyStatusCard({ emergency }: EmergencyStatusCardProps) {
  const theme = useTheme();
  const config = STATUS_CONFIG[emergency.status];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.dangerLight }]}>
          <Ionicons name={config.icon} size={24} color={theme.colors.danger} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {t('emergency.active')}
          </Text>
          <Badge
            label={t(`emergency.${config.key}`)}
            variant={config.variant}
            size="sm"
          />
        </View>
      </View>

      {emergency.eta && (
        <View style={[styles.etaRow, { backgroundColor: theme.colors.backgroundTertiary }]}>
          <Ionicons name="time-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.etaText, { color: theme.colors.text }]}>
            {t('emergency.eta', { minutes: emergency.eta })}
          </Text>
        </View>
      )}

      {emergency.nearestHospital && (
        <View style={styles.hospitalRow}>
          <Ionicons name="medkit-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.hospitalName, { color: theme.colors.textSecondary }]}>
            {emergency.nearestHospital.name}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  etaText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 14,
    marginLeft: 8,
  },
});
