'use client';

import React, { useState, useEffect } from 'react';
import {
  Star, MapPin, Clock, DollarSign, Heart, Plane,
  Hotel, Stethoscope, ShieldCheck, Eye, ChevronRight,
  X, Check, Calendar, Users,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';
import type { MedicalPackage } from '@/types';
import toast from 'react-hot-toast';

const categories = [
  { id: 'ALL', label: 'All' },
  { id: 'DENTAL', label: 'Dental' },
  { id: 'COSMETIC', label: 'Cosmetic' },
  { id: 'EYE', label: 'Eye' },
  { id: 'CARDIAC', label: 'Cardiac' },
  { id: 'ORTHOPEDIC', label: 'Orthopedic' },
  { id: 'GENERAL', label: 'General' },
];

const includeIcons: Record<string, React.ElementType> = {
  flights: Plane,
  hotel: Hotel,
  hospital: Stethoscope,
  recovery: Heart,
  consultation: Users,
  insurance: ShieldCheck,
};

const categoryColors: Record<string, string> = {
  DENTAL: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  COSMETIC: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  EYE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  CARDIAC: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  ORTHOPEDIC: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  GENERAL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

// Demo packages
const demoPackages: MedicalPackage[] = [
  {
    id: '1',
    title: 'Premium Dental Implants Package',
    category: 'DENTAL',
    hospitalName: 'Bangkok Dental Hospital',
    city: 'Bangkok',
    country: 'Thailand',
    description: 'Complete dental implant treatment including consultation, CT scan, implant surgery, temporary crown, and final porcelain crown. Includes 5 nights hotel accommodation and airport transfers.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop',
    price: 3500,
    currency: 'USD',
    duration: '7 days',
    includes: ['flights', 'hotel', 'hospital', 'recovery'],
    rating: 4.8,
    reviewCount: 156,
    highlights: ['Board-certified implantologist', 'Latest 3D scanning technology', 'Lifetime warranty on implants', 'Multilingual staff'],
    itinerary: ['Day 1: Arrival & consultation', 'Day 2: CT scan & treatment planning', 'Day 3: Implant surgery', 'Day 4-5: Recovery & follow-up', 'Day 6: Final check & crown', 'Day 7: Departure'],
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'LASIK Eye Surgery Package',
    category: 'EYE',
    hospitalName: 'Istanbul Eye Center',
    city: 'Istanbul',
    country: 'Turkey',
    description: 'Complete LASIK vision correction package with pre-operative assessment, wavefront-guided LASIK surgery for both eyes, post-operative care, and luxury hotel stay.',
    imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=400&h=300&fit=crop',
    price: 2200,
    currency: 'USD',
    duration: '5 days',
    includes: ['hotel', 'hospital', 'consultation'],
    rating: 4.9,
    reviewCount: 243,
    highlights: ['99.5% success rate', 'FDA-approved laser technology', 'Experienced ophthalmologist', 'Lifetime aftercare'],
    itinerary: ['Day 1: Arrival & eye assessment', 'Day 2: Pre-op preparation', 'Day 3: LASIK surgery', 'Day 4: Post-op check', 'Day 5: Final review & departure'],
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    title: 'Cardiac Health Check Package',
    category: 'CARDIAC',
    hospitalName: 'Bumrungrad International',
    city: 'Bangkok',
    country: 'Thailand',
    description: 'Comprehensive cardiac screening including ECG, echocardiogram, stress test, blood panel, and consultation with cardiologist. VIP room and personal coordinator.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    price: 1800,
    currency: 'USD',
    duration: '3 days',
    includes: ['hospital', 'consultation', 'recovery'],
    rating: 4.7,
    reviewCount: 89,
    highlights: ['JCI-accredited hospital', 'Advanced diagnostic equipment', 'Same-day results', 'VIP patient room'],
    itinerary: ['Day 1: Check-in & initial tests', 'Day 2: Advanced diagnostics & stress test', 'Day 3: Results consultation & departure'],
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    title: 'Rhinoplasty & Recovery Package',
    category: 'COSMETIC',
    hospitalName: 'Seoul Aesthetic Clinic',
    city: 'Seoul',
    country: 'South Korea',
    description: 'Complete rhinoplasty package with 3D simulation consultation, surgery by top Korean plastic surgeon, 10-night luxury recovery suite, and post-op care.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
    price: 5500,
    currency: 'USD',
    duration: '14 days',
    includes: ['hotel', 'hospital', 'recovery', 'consultation'],
    rating: 4.6,
    reviewCount: 127,
    highlights: ['Top-rated Korean surgeon', '3D simulation preview', 'Luxury recovery suite', '24/7 nursing care'],
    itinerary: ['Day 1: Arrival & consultation', 'Day 2: 3D simulation & planning', 'Day 3: Surgery', 'Day 4-10: Recovery with daily checks', 'Day 11: Stitch removal', 'Day 12-13: Final recovery', 'Day 14: Departure'],
    createdAt: '2024-03-01',
  },
  {
    id: '5',
    title: 'Hip Replacement Package',
    category: 'ORTHOPEDIC',
    hospitalName: 'Apollo Hospitals',
    city: 'Chennai',
    country: 'India',
    description: 'Total hip replacement with minimally invasive technique, including pre-op assessment, surgery, physiotherapy, and rehabilitation. Significant savings compared to US prices.',
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&h=300&fit=crop',
    price: 7000,
    currency: 'USD',
    duration: '14 days',
    includes: ['hotel', 'hospital', 'recovery', 'consultation', 'insurance'],
    rating: 4.5,
    reviewCount: 67,
    highlights: ['Board-certified orthopedic surgeon', 'Robotic-assisted surgery option', '10 days physiotherapy', 'Save up to 70% vs US'],
    itinerary: ['Day 1-2: Arrival & pre-op assessment', 'Day 3: Surgery', 'Day 4-7: Hospital recovery', 'Day 8-13: Physiotherapy', 'Day 14: Final review & departure'],
    createdAt: '2024-02-15',
  },
  {
    id: '6',
    title: 'Full Body Health Screening',
    category: 'GENERAL',
    hospitalName: 'Gleneagles Hospital',
    city: 'Singapore',
    country: 'Singapore',
    description: 'Comprehensive health screening including 50+ tests, MRI brain scan, CT scan, cancer markers, genetic testing, and detailed consultation with specialist team.',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop',
    price: 2500,
    currency: 'USD',
    duration: '2 days',
    includes: ['hospital', 'consultation'],
    rating: 4.9,
    reviewCount: 312,
    highlights: ['50+ diagnostic tests', 'MRI & CT included', 'Cancer marker screening', 'Same-day results for most tests'],
    itinerary: ['Day 1: Fasting tests, scans, and initial assessments', 'Day 2: Specialist consultations and results review'],
    createdAt: '2024-01-10',
  },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<MedicalPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedPackage, setSelectedPackage] = useState<MedicalPackage | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await api.get('/packages');
      setPackages(data.data || []);
    } catch {
      // Use demo data
      setPackages(demoPackages);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPackages = activeCategory === 'ALL'
    ? packages
    : packages.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Tourism Packages</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                All-inclusive medical treatment packages worldwide
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Package Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-16 w-16" />}
              title="No packages found"
              description="No packages match the selected category."
              actionLabel="View All"
              onAction={() => setActiveCategory('ALL')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} hover onClick={() => setSelectedPackage(pkg)} className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Stethoscope className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-full',
                        categoryColors[pkg.category] || categoryColors.GENERAL
                      )}>
                        {pkg.category}
                      </span>
                    </div>
                  </div>

                  <CardContent>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {pkg.hospitalName} - {pkg.city}, {pkg.country}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <Rating value={pkg.rating} size="sm" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{pkg.rating}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">({pkg.reviewCount})</span>
                    </div>

                    {/* Includes */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {pkg.includes.map((inc) => {
                        const Icon = includeIcons[inc] || Check;
                        return (
                          <span
                            key={inc}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400"
                          >
                            <Icon className="h-3 w-3" />
                            {inc.charAt(0).toUpperCase() + inc.slice(1)}
                          </span>
                        );
                      })}
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {formatCurrency(pkg.price, pkg.currency)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          {pkg.duration}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageContainer>
      </main>

      {/* Package Detail Modal */}
      <Modal
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        title={selectedPackage?.title || 'Package Details'}
        size="xl"
      >
        {selectedPackage && (
          <div>
            {selectedPackage.imageUrl && (
              <img
                src={selectedPackage.imageUrl}
                alt={selectedPackage.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-full',
                    categoryColors[selectedPackage.category] || categoryColors.GENERAL
                  )}>
                    {selectedPackage.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Rating value={selectedPackage.rating} size="sm" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">({selectedPackage.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <MapPin className="h-4 w-4" />
                  {selectedPackage.hospitalName} - {selectedPackage.city}, {selectedPackage.country}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedPackage.description}
                </p>
              </div>

              {/* Price & Duration */}
              <div className="flex items-center gap-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(selectedPackage.price, selectedPackage.currency)}
                  </p>
                </div>
                <div className="h-10 w-px bg-primary-200 dark:bg-primary-800" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPackage.duration}</p>
                </div>
              </div>

              {/* Includes */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Package Includes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPackage.includes.map((inc) => {
                    const Icon = includeIcons[inc] || Check;
                    return (
                      <span
                        key={inc}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-sm text-green-700 dark:text-green-400"
                      >
                        <Icon className="h-4 w-4" />
                        {inc.charAt(0).toUpperCase() + inc.slice(1)}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Highlights */}
              {selectedPackage.highlights && selectedPackage.highlights.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPackage.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Itinerary</h4>
                  <div className="space-y-2">
                    {selectedPackage.itinerary.map((day, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{day}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <Button variant="primary" size="lg" fullWidth>
                  Book This Package
                </Button>
                <Button variant="outline" size="lg">
                  Contact Hospital
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
      <MobileNav />
    </div>
  );
}
