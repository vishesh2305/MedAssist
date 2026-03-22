import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Doctor } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../lib/utils';
import { t } from '../../i18n';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Avatar
          uri={doctor.avatar}
          firstName={doctor.name.split(' ')[0]}
          lastName={doctor.name.split(' ')[1] || ''}
          size={56}
        />
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{doctor.name}</Text>
          <Text style={[styles.specialty, { color: theme.colors.primary }]}>
            {doctor.specialty}
          </Text>
          <Text style={[styles.experience, { color: theme.colors.textSecondary }]}>
            {t('hospitals.yearsExp', { years: doctor.experience })}
          </Text>
        </View>
        <View style={styles.right}>
          <Badge
            label={doctor.isAvailable ? t('hospitals.available') : t('hospitals.unavailable')}
            variant={doctor.isAvailable ? 'success' : 'neutral'}
            size="sm"
          />
          <Text style={[styles.fee, { color: theme.colors.text }]}>
            {formatCurrency(doctor.consultationFee, doctor.currency)}
          </Text>
        </View>
      </View>
      {doctor.languages.length > 0 && (
        <View style={styles.languages}>
          {doctor.languages.map((lang) => (
            <Badge key={lang} label={lang} variant="neutral" size="sm" style={styles.langBadge} />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  specialty: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  fee: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  languages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 6,
  },
  langBadge: {
    marginRight: 0,
  },
});
