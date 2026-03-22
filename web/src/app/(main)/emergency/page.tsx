'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
import { EmergencyModal } from '@/components/emergency/EmergencyModal';
import { EmergencyStatus } from '@/components/emergency/EmergencyStatus';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { EmergencyLog } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Clock, AlertTriangle, Navigation, ExternalLink, Shield, PhoneCall } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface NearbyHospitalResult {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  isEmergencyCapable?: boolean;
  distance?: number;
  source: 'registered' | 'osm';
  rating?: number;
  tags?: Record<string, string>;
}

export default function EmergencyPage() {
  const { user, isLoggedIn, isInitialized } = useAuth();
  const geo = useGeolocation();
  const [showModal, setShowModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyLog | null>(null);
  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyLog[]>([]);
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospitalResult[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Fetch nearby hospitals (works for everyone, no auth needed)
  const fetchNearbyHospitals = useCallback(async (lat: number, lng: number) => {
    setIsLoadingHospitals(true);
    try {
      const { data } = await api.get('/hospitals/nearby', {
        params: { lat, lng, radius: 10000, limit: 10 },
      });
      setNearbyHospitals(data.data || []);
    } catch {
      // Fallback: try the regular hospitals endpoint
      try {
        const { data } = await api.get('/hospitals', {
          params: { latitude: lat, longitude: lng, limit: 5, sortBy: 'distance', sortOrder: 'asc' },
        });
        setNearbyHospitals(
          (data.data || []).map((h: any) => ({ ...h, source: 'registered' }))
        );
      } catch {
        // Silently handle - hospitals list will be empty
      }
    } finally {
      setIsLoadingHospitals(false);
    }
  }, []);

  // Fetch hospitals when location becomes available
  useEffect(() => {
    if (geo.latitude && geo.longitude) {
      fetchNearbyHospitals(geo.latitude, geo.longitude);
    }
  }, [geo.latitude, geo.longitude, fetchNearbyHospitals]);

  // Fetch auth-dependent data (active emergency, history) only when logged in
  useEffect(() => {
    if (!isInitialized) return;

    const fetchAuthData = async () => {
      if (!isLoggedIn) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        // Fetch active emergency
        try {
          const { data: activeData } = await api.get('/emergency/active');
          const active = activeData.data || activeData;
          setActiveEmergency(active || null);
        } catch {
          // No active emergency
        }

        // Fetch emergency history
        try {
          const { data: historyData } = await api.get('/emergency/history');
          setEmergencyHistory(historyData.data || historyData || []);
        } catch {
          // No history
        }
      } catch {
        // Silently handle
      } finally {
        setIsLoadingAuth(false);
      }
    };

    fetchAuthData();
  }, [isLoggedIn, isInitialized]);

  const handleSOSPress = () => {
    if (!isLoggedIn) {
      // For unauthenticated users, show the call-emergency modal
      setShowCallModal(true);
      return;
    }
    setShowModal(true);
  };

  const handleEmergencyConfirm = async (shareLocation: boolean, description?: string) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = { notes: description };
      if (shareLocation && geo.latitude && geo.longitude) {
        payload.latitude = geo.latitude;
        payload.longitude = geo.longitude;
      }
      const { data } = await api.post('/emergency/trigger', payload);
      setActiveEmergency(data.emergency || data.data || data);
      setShowModal(false);
      toast.success('Emergency triggered! Help is on the way.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to trigger emergency');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDirectionsUrl = (lat: number, lng: number, name?: string) => {
    const dest = name ? encodeURIComponent(name) : `${lat},${lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&destination_place_id=&travelmode=driving`;
  };

  const nearestHospital = nearbyHospitals.length > 0 ? nearbyHospitals[0] : null;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />

      <PageContainer size="md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Emergency Assistance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get immediate help from nearby hospitals and emergency services
          </p>
          {!isLoggedIn && isInitialized && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              <Link href="/login" className="underline font-medium">Sign in</Link> for full emergency features including automatic hospital alerts
            </p>
          )}
        </div>

        {/* SOS Button */}
        <div className="flex justify-center mb-10">
          <EmergencyButton
            onPress={handleSOSPress}
            disabled={!!activeEmergency}
          />
        </div>

        {/* Quick Emergency Numbers (visible to everyone) */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="tel:911"
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            <span className="text-sm font-medium">Call 911</span>
          </a>
          <a
            href="tel:112"
            className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            <PhoneCall className="h-4 w-4" />
            <span className="text-sm font-medium">Call 112</span>
          </a>
          {nearestHospital && (
            <a
              href={getDirectionsUrl(nearestHospital.latitude, nearestHospital.longitude, nearestHospital.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              <span className="text-sm font-medium">Nearest Hospital</span>
            </a>
          )}
        </div>

        {/* Active Emergency */}
        {activeEmergency && (
          <div className="mb-8">
            <EmergencyStatus emergency={activeEmergency} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Hospitals (works for everyone) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  Nearby Hospitals
                </h3>
                {geo.isLoading && (
                  <span className="text-xs text-gray-400">Getting location...</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {geo.error ? (
                <div className="text-center py-6">
                  <MapPin className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Location access is needed to find nearby hospitals
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Please enable location in your browser settings and refresh the page
                  </p>
                </div>
              ) : isLoadingHospitals || geo.isLoading ? (
                <Skeleton variant="list" />
              ) : nearbyHospitals.length > 0 ? (
                <div className="space-y-3">
                  {nearbyHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        {hospital.source === 'registered' ? (
                          <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {hospital.source === 'registered' ? (
                            <Link
                              href={`/hospitals/${hospital.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {hospital.name}
                            </Link>
                          ) : (
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {hospital.name}
                            </p>
                          )}
                          {hospital.source === 'registered' && (
                            <Badge variant="info" size="sm">Verified</Badge>
                          )}
                          {hospital.isEmergencyCapable && (
                            <Badge variant="danger" size="sm">ER</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {hospital.distance !== undefined && (
                            <span>{hospital.distance < 1 ? `${Math.round(hospital.distance * 1000)}m` : `${hospital.distance.toFixed(1)}km`}</span>
                          )}
                          {hospital.address && <span className="truncate">{hospital.address}</span>}
                          {hospital.city && <span>{hospital.city}</span>}
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-3 mt-2">
                          {hospital.phone && (
                            <a
                              href={`tel:${hospital.phone}`}
                              className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 hover:underline"
                            >
                              <Phone className="h-3 w-3" />
                              {hospital.phone}
                            </a>
                          )}
                          <a
                            href={getDirectionsUrl(hospital.latitude, hospital.longitude, hospital.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Navigation className="h-3 w-3" />
                            Directions
                          </a>
                          {hospital.website && (
                            <a
                              href={hospital.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No nearby hospitals found. Try increasing the search radius.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact (only for logged in users) */}
          {isLoggedIn && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  Emergency Contact
                </h3>
              </CardHeader>
              <CardContent>
                {user?.emergencyContactName ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.emergencyContactName}
                    </p>
                    {user.emergencyContactPhone && (
                      <a
                        href={`tel:${user.emergencyContactPhone}`}
                        className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {user.emergencyContactPhone}
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      No emergency contact set. Add one in your profile for faster assistance.
                    </p>
                    <Link href="/profile" className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Add Contact
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Emergency History (only for logged in users) */}
          {isLoggedIn && emergencyHistory.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Emergency History
                </h3>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {emergencyHistory
                    .filter((e) => ['RESOLVED', 'CANCELLED'].includes(e.status))
                    .slice(0, 5)
                    .map((emergency) => (
                      <div key={emergency.id} className="py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {emergency.notes || 'Emergency triggered'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(emergency.createdAt, 'long')}
                          </p>
                        </div>
                        <Badge
                          variant={emergency.status === 'RESOLVED' ? 'success' : 'default'}
                          size="sm"
                        >
                          {emergency.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>

      {/* Emergency Modal for logged-in users */}
      <EmergencyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleEmergencyConfirm}
        isSubmitting={isSubmitting}
        emergencyContact={
          user?.emergencyContactName && user?.emergencyContactPhone
            ? {
                name: user.emergencyContactName,
                phone: user.emergencyContactPhone,
                relationship: 'Emergency Contact',
              }
            : undefined
        }
      />

      {/* Call Emergency Modal for unauthenticated users */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
                  Emergency Assistance
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Call local emergency services or navigate to the nearest hospital.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="tel:911"
                className="flex items-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors w-full"
              >
                <PhoneCall className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Call 911</p>
                  <p className="text-xs text-red-100">US/Canada Emergency</p>
                </div>
              </a>
              <a
                href="tel:112"
                className="flex items-center gap-3 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors w-full"
              >
                <PhoneCall className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Call 112</p>
                  <p className="text-xs text-red-100">International Emergency</p>
                </div>
              </a>
              {nearestHospital && (
                <a
                  href={getDirectionsUrl(nearestHospital.latitude, nearestHospital.longitude, nearestHospital.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors w-full"
                >
                  <Navigation className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Navigate to {nearestHospital.name}</p>
                    <p className="text-xs text-blue-100">
                      {nearestHospital.distance !== undefined
                        ? nearestHospital.distance < 1
                          ? `${Math.round(nearestHospital.distance * 1000)}m away`
                          : `${nearestHospital.distance.toFixed(1)}km away`
                        : 'Nearest hospital'}
                    </p>
                  </div>
                </a>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                <Link href="/login" className="text-primary-600 dark:text-primary-400 font-medium underline">
                  Sign in
                </Link>{' '}
                to automatically alert nearby hospitals and track your emergency.
              </p>
              <button
                onClick={() => setShowCallModal(false)}
                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
}
