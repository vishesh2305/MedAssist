import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Hospital } from '../../types';
import { formatDistance } from '../../lib/utils';
import { Card } from '../ui/Card';

interface NearestHospitalCardProps {
  hospital: Hospital;
  onPress: () => void;
  onCall: () => void;
}

export function NearestHospitalCard({ hospital, onPress, onCall }: NearestHospitalCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.icon, { backgroundColor: theme.colors.dangerLight }]}>
            <Ionicons name="medkit" size={20} color={theme.colors.danger} />
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {hospital.name}
            </Text>
            <View style={styles.detailRow}>
              {hospital.distance !== undefined && (
                <Text style={[styles.distance, { color: theme.colors.textSecondary }]}>
                  {formatDistance(hospital.distance)}
                </Text>
              )}
              {hospital.hasEmergency && (
                <Text style={[styles.emergency, { color: theme.colors.danger }]}>
                  Emergency
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={onCall}
            style={[styles.callButton, { backgroundColor: theme.colors.success }]}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 8,
  },
  distance: {
    fontSize: 13,
  },
  emergency: {
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
