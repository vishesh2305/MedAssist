'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Phone, MessageSquare, Navigation, Heart, Share2,
  MapPin, Clock, Globe, Star, Shield, AlertTriangle, ExternalLink,
  ChevronLeft, ChevronRight, Image as ImageIcon, User,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { DoctorCard } from '@/components/hospital/DoctorCard';
import { PricingTable } from '@/components/hospital/PricingTable';
import { ReviewCard } from '@/components/hospital/ReviewCard';
import { ReviewForm } from '@/components/hospital/ReviewForm';
import { HospitalMap } from '@/components/hospital/HospitalMap';
import { DirectionsMap } from '@/components/hospital/DirectionsMap';
import { useHospital } from '@/hooks/useHospital';
import { useHospitalStore } from '@/store/hospitalStore';
import { useAuth } from '@/hooks/useAuth';
import { cn, formatCurrency, getRatingLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

const tabList = [
  { id: 'overview', label: 'Overview' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'directions', label: 'Directions' },
];

export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { hospital, isLoading, error } = useHospital(id);
  const { favorites, toggleFavorite } = useHospitalStore();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const isFavorite = favorites.some((f) => f.hospitalId === id);
  const galleryRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer>
          <Skeleton variant="rectangular" className="h-64 mb-6" />
          <Skeleton className="h-8 w-1/2 mb-3" />
          <Skeleton className="h-4 w-1/3 mb-6" />
          <Skeleton variant="rectangular" className="h-96" />
        </PageContainer>
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer className="text-center py-20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hospital not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error || 'The hospital you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/hospitals')}>Browse Hospitals</Button>
        </PageContainer>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: hospital.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const hasCoordinates = hospital.latitude != null && hospital.longitude != null;
  const hasPhotos = hospital.photos && hospital.photos.length > 0;
  const directionsUrl = hospital.directionsUrl || (hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
    : null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = 320;
    galleryRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />

      {/* Photo Gallery / Cover */}
      <div className="relative">
        {hasPhotos ? (
          <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-gray-800">
            <div
              ref={galleryRef}
              className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {hospital.photos!.map((photo, i) => (
                <div key={i} className="flex-shrink-0 w-full sm:w-auto h-full snap-start">
                  <img
                    src={photo}
                    alt={`${hospital.name} photo ${i + 1}`}
                    className="h-full w-full sm:w-auto object-cover"
                    loading={i > 0 ? 'lazy' : undefined}
                  />
                </div>
              ))}
            </div>
            {hospital.photos!.length > 1 && (
              <>
                <button
                  onClick={() => scrollGallery('left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => scrollGallery('right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {hospital.photos!.length} photos
            </div>
          </div>
        ) : hospital.coverImage || hospital.images?.[0] ? (
          <div className="relative h-64 sm:h-80 bg-gray-200 dark:bg-gray-700">
            <img
              src={hospital.coverImage || hospital.images[0]}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 sm:h-64 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center">
            <div className="text-center text-white">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-80" />
              <h2 className="text-xl font-bold opacity-90">{hospital.name}</h2>
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm hover:bg-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <PageContainer>
        {/* Hospital Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 -mt-8 relative z-10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{hospital.name}</h1>
                {hospital.isVerified && (
                  <Badge variant="success" size="md">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {hospital.isEmergencyCapable && (
                  <Badge variant="danger" size="md">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    24/7 Emergency
                  </Badge>
                )}
                {hospital.isOpenNow != null && (
                  <Badge variant={hospital.isOpenNow ? 'success' : 'danger'} size="md">
                    <Clock className="h-3 w-3 mr-1" />
                    {hospital.isOpenNow ? 'Open Now' : 'Closed'}
                  </Badge>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {hospital.address}
                  {hospital.city && `, ${hospital.city}`}
                  {hospital.country && `, ${hospital.country}`}
                </span>
              </div>

              {/* Phone */}
              {hospital.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${hospital.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400 underline-offset-2 hover:underline">
                    {hospital.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {hospital.website && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 underline-offset-2 hover:underline truncate max-w-xs">
                    {hospital.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                  </a>
                </div>
              )}

              {/* Ratings */}
              <div className="flex items-center gap-4 flex-wrap mt-3">
                {/* App rating */}
                <div className="flex items-center gap-1.5">
                  <Rating value={hospital.rating || 0} size="sm" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {hospital.rating?.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({hospital.reviewCount} reviews)
                  </span>
                </div>

                {/* Google rating */}
                {hospital.googleRating && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {hospital.googleRating.toFixed(1)}
                    </span>
                    {hospital.googleReviewCount && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({hospital.googleReviewCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {hospital.languages?.map((lang) => (
                  <Badge key={lang} variant="info" size="sm">
                    <Globe className="h-3 w-3 mr-1" />
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-5 flex-wrap border-t border-gray-100 dark:border-gray-700 pt-4">
            {hospital.phone && (
              <a href={`tel:${hospital.phone}`}>
                <Button variant="primary" size="sm" icon={<Phone className="h-4 w-4" />}>
                  Call
                </Button>
              </a>
            )}
            {directionsUrl && (
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" icon={<Navigation className="h-4 w-4" />}>
                  Directions
                </Button>
              </a>
            )}
            {hospital.website && (
              <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                  Website
                </Button>
              </a>
            )}
            <Button variant="ghost" size="sm" icon={<Share2 className="h-4 w-4" />} onClick={handleShare}>
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />}
              onClick={() => toggleFavorite(id)}
            >
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* Tab Content */}
        <div className="mb-8">
          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {hospital.description || 'This hospital provides comprehensive healthcare services to both local and international patients, with a focus on quality care and patient satisfaction.'}
                  </p>
                </div>

                {/* Opening Hours */}
                {hospital.openingHours && hospital.openingHours.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      {hospital.openingHours.map((line, i) => {
                        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                        const isToday = line.toLowerCase().startsWith(today.toLowerCase());
                        return (
                          <p
                            key={i}
                            className={cn(
                              'text-sm',
                              isToday
                                ? 'font-semibold text-primary-600 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400'
                            )}
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Specialties</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {hospital.specialties.map((s) => (
                        <div key={typeof s === 'string' ? s : (s as any).name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                          {typeof s === 'string' ? s : (s as any).name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Sidebar */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {hospital.phone && (
                      <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <Phone className="h-4 w-4" />
                        {hospital.phone}
                      </a>
                    )}
                    {hospital.email && (
                      <a href={`mailto:${hospital.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <MessageSquare className="h-4 w-4" />
                        {hospital.email}
                      </a>
                    )}
                    {hospital.website && (
                      <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </a>
                    )}
                    {hospital.googleMapsUrl && (
                      <a href={hospital.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <MapPin className="h-4 w-4" />
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Availability
                  </h3>
                  <div className="text-sm">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      hospital.availabilityStatus === 'OPEN' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      hospital.availabilityStatus === 'LIMITED' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                      hospital.availabilityStatus === 'CLOSED' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    )}>
                      <span className={cn(
                        'h-2 w-2 rounded-full',
                        hospital.availabilityStatus === 'OPEN' && 'bg-green-500',
                        hospital.availabilityStatus === 'LIMITED' && 'bg-yellow-500',
                        hospital.availabilityStatus === 'CLOSED' && 'bg-red-500',
                      )} />
                      {hospital.availabilityStatus === 'OPEN' ? 'Open Now' : hospital.availabilityStatus === 'LIMITED' ? 'Limited Services' : 'Closed'}
                    </span>
                  </div>
                </div>

                {/* Quick directions in sidebar */}
                {hasCoordinates && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Quick Directions
                    </h3>
                    <a
                      href={directionsUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="primary" className="w-full" icon={<Navigation className="h-4 w-4" />}>
                        Open in Google Maps
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== DOCTORS TAB ===== */}
          {activeTab === 'doctors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(hospital.doctors?.length ?? 0) > 0 ? (
                (hospital.doctors ?? []).map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))
              ) : (
                <div className="col-span-2">
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                    Doctor information is not yet available for this hospital.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== PRICING TAB ===== */}
          {activeTab === 'pricing' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
              <PricingTable pricing={hospital.pricing || []} />
            </div>
          )}

          {/* ===== REVIEWS TAB ===== */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Google Reviews */}
                {hospital.googleReviews && hospital.googleReviews.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google Reviews
                      {hospital.googleRating && (
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                          {hospital.googleRating.toFixed(1)} / 5
                        </span>
                      )}
                    </h3>
                    <div className="space-y-4">
                      {hospital.googleReviews.map((review, i) => (
                        <div key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start gap-3">
                            {review.profilePhotoUrl ? (
                              <img
                                src={review.profilePhotoUrl}
                                alt={review.authorName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {review.authorName}
                                </p>
                                <span className="text-xs text-gray-400 shrink-0">{review.relativeTime}</span>
                              </div>
                              <div className="flex items-center gap-1 my-1">
                                {Array.from({ length: 5 }).map((_, si) => (
                                  <Star
                                    key={si}
                                    className={cn(
                                      'h-3.5 w-3.5',
                                      si < review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-200 dark:text-gray-600'
                                    )}
                                  />
                                ))}
                              </div>
                              {review.text && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                                  {review.text}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* App Reviews */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Patient Reviews
                  </h3>
                  {hospital.reviews && hospital.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {hospital.reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                      No patient reviews yet. Be the first to share your experience.
                    </p>
                  )}
                </div>
              </div>

              {/* Write a Review */}
              <div>
                {isLoggedIn ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Write a Review
                    </h3>
                    <ReviewForm hospitalId={id} />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Sign in to leave a review
                    </p>
                    <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== DIRECTIONS TAB ===== */}
          {activeTab === 'directions' && (
            <div className="space-y-4">
              {hasCoordinates ? (
                <DirectionsMap
                  hospitalLat={hospital.latitude!}
                  hospitalLng={hospital.longitude!}
                  hospitalName={hospital.name}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Location data is not available for this hospital.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainer>

      {/* Floating Action Bar */}
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-30 px-4">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between gap-2">
          {hospital.phone && (
            <a href={`tel:${hospital.phone}`}>
              <Button variant="primary" size="sm" icon={<Phone className="h-4 w-4" />}>Call</Button>
            </a>
          )}
          <Button variant="outline" size="sm" icon={<MessageSquare className="h-4 w-4" />} onClick={() => router.push('/chat')}>
            Chat
          </Button>
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" icon={<Navigation className="h-4 w-4" />}>Directions</Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />}
            onClick={() => toggleFavorite(id)}
          />
          <Button variant="ghost" size="sm" icon={<Share2 className="h-4 w-4" />} onClick={handleShare} />
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
