import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Review } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Rating } from '../ui/Rating';
import { formatRelativeTime } from '../../lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const theme = useTheme();
  const nameParts = review.userName.split(' ');

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.borderLight }]}>
      <View style={styles.header}>
        <Avatar
          uri={review.userAvatar}
          firstName={nameParts[0]}
          lastName={nameParts[1] || ''}
          size={40}
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {review.userName}
          </Text>
          <Text style={[styles.date, { color: theme.colors.textTertiary }]}>
            {formatRelativeTime(review.createdAt)}
          </Text>
        </View>
      </View>
      <Rating value={review.rating} size={14} style={styles.rating} />
      {review.title && (
        <Text style={[styles.title, { color: theme.colors.text }]}>{review.title}</Text>
      )}
      <Text style={[styles.content, { color: theme.colors.textSecondary }]}>
        {review.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 1,
  },
  rating: {
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
});
