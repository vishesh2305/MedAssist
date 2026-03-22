import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { PricingItem as PricingItemType } from '../../types';
import { formatPriceRange } from '../../lib/utils';

interface PricingItemProps {
  item: PricingItemType;
}

export function PricingItemCard({ item }: PricingItemProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.colors.borderLight },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
        {item.notes && (
          <Text style={[styles.notes, { color: theme.colors.textTertiary }]}>{item.notes}</Text>
        )}
      </View>
      <Text style={[styles.price, { color: theme.colors.primary }]}>
        {formatPriceRange(item.priceMin, item.priceMax, item.currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  notes: {
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
  },
});
