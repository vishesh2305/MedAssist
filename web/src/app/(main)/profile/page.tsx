'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { EmergencyContactForm } from '@/components/profile/EmergencyContactForm';
import { FavoritesList } from '@/components/profile/FavoritesList';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useHospitalStore } from '@/store/hospitalStore';
import { ChevronDown, ChevronUp, User, AlertTriangle, Heart, FileText, Clock } from 'lucide-react';
import { HospitalCard } from '@/components/hospital/HospitalCard';
import type { Hospital } from '@/types';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, isLoggedIn, isInitialized } = useAuth(true);
  const { recentlyViewed } = useHospitalStore();
  const [openSection, setOpenSection] = useState<string | null>('personal');
  const [favoriteHospitals, setFavoriteHospitals] = useState<Hospital[]>([]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/users/favorites');
        setFavoriteHospitals(data.data || data || []);
      } catch {
        // No favorites
      }
    };
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer size="md">
          <Skeleton variant="rectangular" className="h-32 mb-6" />
          <Skeleton variant="rectangular" className="h-48" />
        </PageContainer>
      </div>
    );
  }

  if (!user) return null;

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'emergency', label: 'Emergency Contact', icon: AlertTriangle },
    { id: 'medical', label: 'Medical Notes', icon: FileText },
    { id: 'favorites', label: 'Favorite Hospitals', icon: Heart },
    { id: 'recent', label: 'Recently Viewed', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />

      <PageContainer size="md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

        {/* Profile Card */}
        <ProfileCard user={user} className="mb-6" />

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <Card key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{section.label}</span>
                </div>
                {openSection === section.id ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {openSection === section.id && (
                <CardContent className="border-t border-gray-100 dark:border-gray-700">
                  {section.id === 'personal' && <ProfileForm user={user} />}
                  {section.id === 'emergency' && (
                    <EmergencyContactForm
                      contactName={user.emergencyContactName}
                      contactPhone={user.emergencyContactPhone}
                    />
                  )}
                  {section.id === 'medical' && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {user.medicalNotes || 'No medical notes added yet. Add allergies, chronic conditions, or other important medical information.'}
                      </p>
                    </div>
                  )}
                  {section.id === 'favorites' && (
                    <FavoritesList hospitals={favoriteHospitals} />
                  )}
                  {section.id === 'recent' && (
                    <div>
                      {recentlyViewed.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {recentlyViewed.filter(rv => rv.hospital).map((rv) => (
                            <HospitalCard key={rv.id} hospital={rv.hospital!} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                          No recently viewed hospitals.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </PageContainer>

      <MobileNav />
    </div>
  );
}
