import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme';
import { HospitalStackParamList } from '../types';
import { useHospitals } from '../hooks/useHospitals';
import { useSettingsStore } from '../store/settingsStore';
import { Badge } from '../components/ui/Badge';
import { Rating } from '../components/ui/Rating';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Divider } from '../components/ui/Divider';
import { DoctorCard } from '../components/hospital/DoctorCard';
import { PricingItemCard } from '../components/hospital/PricingItem';
import { ReviewCard } from '../components/hospital/ReviewCard';
import { ReviewForm } from '../components/hospital/ReviewForm';
import { EmptyState } from '../components/ui/EmptyState';
import { t } from '../i18n';

const { width } = Dimensions.get('window');

type DetailNavProp = StackNavigationProp<HospitalStackParamList, 'HospitalDetail'>;
type DetailRouteProp = RouteProp<HospitalStackParamList, 'HospitalDetail'>;

interface Props {
  navigation: DetailNavProp;
  route: DetailRouteProp;
}

type Tab = 'overview' | 'doctors' | 'pricing' | 'reviews';

export function HospitalDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const { hospitalId } = route.params;
  const { selectedHospital: hospital, isLoading, fetchHospitalDetail, toggleFavorite, submitReview } =
    useHospitals();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchHospitalDetail(hospitalId);
  }, [hospitalId, fetchHospitalDetail]);

  const handleFavorite = useCallback(() => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleFavorite(hospitalId);
  }, [hapticEnabled, toggleFavorite, hospitalId]);

  const handleCall = () => {
    if (hospital?.phone) {
      Linking.openURL(`tel:${hospital.phone}`);
    }
  };

  const handleDirections = () => {
    if (hospital) {
      const url = `https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleSubmitReview = async (review: { rating: number; title: string; content: string }) => {
    setIsSubmittingReview(true);
    try {
      await submitReview(hospitalId, review);
      setShowReviewForm(false);
    } catch {
      // Error handled
    }
    setIsSubmittingReview(false);
  };

  if (isLoading || !hospital) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: t('hospitals.overview') },
    { key: 'doctors', label: t('hospitals.doctors') },
    { key: 'pricing', label: t('hospitals.pricing') },
    { key: 'reviews', label: t('hospitals.reviews') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: hospital.coverImage || 'https://via.placeholder.com/600x300' }}
            style={styles.coverImage}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.surface, top: insets.top + 10 }]}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFavorite}
            style={[styles.favoriteBtn, { backgroundColor: theme.colors.surface, top: insets.top + 10 }]}
          >
            <Ionicons
              name={hospital.isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={hospital.isFavorite ? theme.colors.danger : theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{hospital.name}</Text>
            {hospital.isVerified && (
              <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
            )}
          </View>

          <View style={styles.ratingRow}>
            <Rating value={hospital.rating} size={16} />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {hospital.rating.toFixed(1)} ({hospital.reviewCount} reviews)
            </Text>
          </View>

          <View style={styles.badgesRow}>
            {hospital.languages.map((lang) => (
              <Badge key={lang} label={lang} variant="primary" size="sm" />
            ))}
            {hospital.hasEmergency && (
              <Badge label="Emergency" variant="danger" size="sm" />
            )}
            {hospital.is24Hours && <Badge label="24h" variant="success" size="sm" />}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleCall} style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name="call" size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {t('common.call')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name="chatbubble" size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDirections} style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name="navigate" size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {t('common.directions')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primaryFaded }]}>
                <Ionicons name="share-outline" size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                {t('common.share')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key && {
                  borderBottomColor: theme.colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.key
                        ? theme.colors.primary
                        : theme.colors.textTertiary,
                    fontWeight: activeTab === tab.key ? '600' : '400',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Divider />

        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <>
              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                {t('hospitals.description')}
              </Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                {hospital.description}
              </Text>

              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                {t('hospitals.address')}
              </Text>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]}>
                  {hospital.address}, {hospital.city}, {hospital.country}
                </Text>
              </View>

              <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                {t('hospitals.contact')}
              </Text>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                  {hospital.phone}
                </Text>
              </View>
              {hospital.email && (
                <View style={styles.contactRow}>
                  <Ionicons name="mail-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                    {hospital.email}
                  </Text>
                </View>
              )}

              {hospital.hasEmergency && (
                <Card
                  style={[
                    styles.emergencyBanner,
                    { backgroundColor: theme.colors.dangerLight, borderColor: theme.colors.danger },
                  ]}
                >
                  <Ionicons name="warning" size={20} color={theme.colors.danger} />
                  <Text style={[styles.emergencyText, { color: theme.colors.danger }]}>
                    {t('hospitals.emergencySupport')}
                  </Text>
                </Card>
              )}
            </>
          )}

          {activeTab === 'doctors' && (
            <>
              {hospital.doctors.length > 0 ? (
                hospital.doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
              ) : (
                <EmptyState
                  icon="people-outline"
                  title="No doctors listed"
                  message="Doctor information is not yet available for this hospital."
                />
              )}
            </>
          )}

          {activeTab === 'pricing' && (
            <>
              {hospital.pricing.length > 0 ? (
                hospital.pricing.map((category) => (
                  <View key={category.category} style={styles.pricingCategory}>
                    <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                      {category.category}
                    </Text>
                    {category.items.map((item, idx) => (
                      <PricingItemCard key={idx} item={item} />
                    ))}
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="pricetag-outline"
                  title="No pricing available"
                  message="Pricing information is not yet available for this hospital."
                />
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <>
              <Button
                title={t('hospitals.writeReview')}
                onPress={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                fullWidth
                style={styles.writeReviewBtn}
              />
              {showReviewForm && (
                <ReviewForm onSubmit={handleSubmitReview} isSubmitting={isSubmittingReview} />
              )}
              {hospital.reviews.length > 0 ? (
                hospital.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <EmptyState
                  icon="chatbubble-outline"
                  title={t('hospitals.noReviews')}
                  message="Share your experience to help other travelers."
                />
              )}
            </>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom + 8,
          },
        ]}
      >
        <Button
          title={t('hospitals.getDirections')}
          onPress={handleDirections}
          variant="outline"
          style={styles.bottomButton}
        />
        <Button
          title={t('hospitals.contactHospital')}
          onPress={handleCall}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteBtn: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  tab: {
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 15,
  },
  tabContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    borderWidth: 1,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pricingCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  writeReviewBtn: {
    marginBottom: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  bottomButton: {
    flex: 1,
  },
});
