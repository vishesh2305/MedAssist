import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { t } from '../../i18n';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; title: string; content: string }) => Promise<void>;
  isSubmitting?: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting = false }: ReviewFormProps) {
  const theme = useTheme();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!content.trim()) {
      setError('Please write your review');
      return;
    }
    setError('');
    await onSubmit({ rating, title: title.trim(), content: content.trim() });
    setRating(0);
    setTitle('');
    setContent('');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t('hospitals.rating')}
      </Text>
      <Rating value={rating} size={32} interactive onChange={setRating} style={styles.stars} />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t('hospitals.reviewTitle')}
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t('hospitals.reviewTitle')}
        placeholderTextColor={theme.colors.inputPlaceholder}
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        {t('hospitals.reviewContent')}
      </Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder={t('hospitals.reviewContent')}
        placeholderTextColor={theme.colors.inputPlaceholder}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={[
          styles.textArea,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            borderColor: theme.colors.inputBorder,
          },
        ]}
      />

      {error ? <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text> : null}

      <Button
        title={t('hospitals.submitReview')}
        onPress={handleSubmit}
        loading={isSubmitting}
        fullWidth
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  stars: {
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  error: {
    fontSize: 13,
    marginTop: 8,
  },
  button: {
    marginTop: 20,
  },
});
