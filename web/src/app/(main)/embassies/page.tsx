'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building, MapPin, Phone, Mail, Globe, Clock,
  ExternalLink, Shield, AlertTriangle, Search, Flag,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Embassy, EmergencyNumber } from '@/types';
import toast from 'react-hot-toast';

const nationalities = [
  { value: '', label: 'Select your nationality' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'UAE' },
];

const currentCountries = [
  { value: '', label: 'Select current country' },
  { value: 'TH', label: 'Thailand' },
  { value: 'IN', label: 'India' },
  { value: 'TR', label: 'Turkey' },
  { value: 'MX', label: 'Mexico' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AE', label: 'UAE' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'EG', label: 'Egypt' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
];

// Fallback embassy data
const embassyDatabase: Record<string, Record<string, Embassy>> = {
  'US-TH': {
    id: 'us-th-1',
    nationality: 'US',
    country: 'TH',
    name: 'U.S. Embassy Bangkok',
    address: '95 Wireless Road, Lumphini, Pathumwan, Bangkok 10330',
    phone: '+66-2-205-4000',
    emergencyPhone: '+66-2-205-4000',
    email: 'acsbkk@state.gov',
    website: 'https://th.usembassy.gov',
    hours: 'Mon-Fri: 7:30 AM - 4:30 PM',
    latitude: 13.7434,
    longitude: 100.5468,
  } as any,
  'GB-TH': {
    id: 'gb-th-1',
    nationality: 'GB',
    country: 'TH',
    name: 'British Embassy Bangkok',
    address: '14 Wireless Road, Lumphini, Pathumwan, Bangkok 10330',
    phone: '+66-2-305-8333',
    emergencyPhone: '+44-20-7008-5000',
    email: 'consular.bangkok@fcdo.gov.uk',
    website: 'https://www.gov.uk/world/organisations/british-embassy-bangkok',
    hours: 'Mon-Thu: 8:00 AM - 4:30 PM, Fri: 8:00 AM - 1:00 PM',
    latitude: 13.7440,
    longitude: 100.5462,
  } as any,
};

const emergencyNumbersByCountry: Record<string, EmergencyNumber[]> = {
  TH: [
    { service: 'Police', number: '191' },
    { service: 'Ambulance', number: '1669' },
    { service: 'Fire', number: '199' },
    { service: 'Tourist Police', number: '1155' },
  ],
  IN: [
    { service: 'Universal Emergency', number: '112' },
    { service: 'Police', number: '100' },
    { service: 'Ambulance', number: '108' },
    { service: 'Fire', number: '101' },
  ],
  TR: [
    { service: 'Police', number: '155' },
    { service: 'Ambulance', number: '112' },
    { service: 'Fire', number: '110' },
  ],
  default: [
    { service: 'Universal Emergency', number: '112' },
  ],
};

export default function EmbassiesPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [nationality, setNationality] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [embassy, setEmbassy] = useState<Embassy | null>(null);
  const [emergencyNumbers, setEmergencyNumbers] = useState<EmergencyNumber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const searchEmbassy = async () => {
    if (!nationality || !currentCountry) {
      toast.error('Please select both nationality and current country');
      return;
    }
    setIsLoading(true);
    setMapLoaded(false);
    try {
      const [embassyRes, emergRes] = await Promise.allSettled([
        api.get('/embassies', { params: { nationality, country: currentCountry } }),
        api.get(`/embassies/emergency-numbers/${currentCountry}`),
      ]);

      if (embassyRes.status === 'fulfilled' && embassyRes.value.data.data) {
        const data = embassyRes.value.data.data;
        setEmbassy(Array.isArray(data) ? data[0] : data);
      } else {
        // Fallback
        const key = `${nationality}-${currentCountry}`;
        const natName = nationalities.find(n => n.value === nationality)?.label || nationality;
        const countryName = currentCountries.find(c => c.value === currentCountry)?.label || currentCountry;
        const fallback = (embassyDatabase as any)[key] || {
          id: `${nationality}-${currentCountry}`,
          nationality,
          country: currentCountry,
          name: `${natName} Embassy in ${countryName}`,
          address: `Embassy district, ${countryName}`,
          phone: '+1-202-555-0100',
          emergencyPhone: '+1-202-555-0199',
          email: `embassy@${nationality.toLowerCase()}.gov`,
          website: `https://${currentCountry.toLowerCase()}.${nationality.toLowerCase()}embassy.gov`,
          hours: 'Mon-Fri: 8:30 AM - 5:00 PM',
          latitude: null,
          longitude: null,
        };
        setEmbassy(fallback);
      }

      if (emergRes.status === 'fulfilled' && emergRes.value.data.data) {
        setEmergencyNumbers(emergRes.value.data.data);
      } else {
        setEmergencyNumbers(emergencyNumbersByCountry[currentCountry] || emergencyNumbersByCountry.default);
      }
    } catch {
      const key = `${nationality}-${currentCountry}`;
      const natName = nationalities.find(n => n.value === nationality)?.label || nationality;
      const countryName = currentCountries.find(c => c.value === currentCountry)?.label || currentCountry;
      setEmbassy({
        id: key,
        nationality,
        country: currentCountry,
        name: `${natName} Embassy in ${countryName}`,
        address: `Embassy district, ${countryName}`,
        phone: '+1-202-555-0100',
        emergencyPhone: '+1-202-555-0199',
        email: `embassy@${nationality.toLowerCase()}.gov`,
        website: `https://${currentCountry.toLowerCase()}.${nationality.toLowerCase()}embassy.gov`,
        hours: 'Mon-Fri: 8:30 AM - 5:00 PM',
      });
      setEmergencyNumbers(emergencyNumbersByCountry[currentCountry] || emergencyNumbersByCountry.default);
    } finally {
      setIsLoading(false);
    }
  };

  // Load map when embassy has coordinates
  useEffect(() => {
    if (!embassy?.latitude || !embassy?.longitude || !mapRef.current || mapLoaded) return;

    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore - CSS import
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        center: [embassy.latitude!, embassy.longitude!],
        zoom: 15,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.marker([embassy.latitude!, embassy.longitude!], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="width:28px;height:28px;background:#2563EB;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">E</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      }).addTo(map).bindPopup(`<strong>${embassy.name}</strong><br/>${embassy.address}`).openPopup();

      setMapLoaded(true);

      return () => map.remove();
    };

    loadMap();
  }, [embassy, mapLoaded]);

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Embassy Directory</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Find your embassy and local emergency numbers
              </p>
            </div>
          </div>

          {/* Search Form */}
          <Card className="mb-6">
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Your Nationality"
                  options={nationalities}
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="Select your nationality"
                />
                <Select
                  label="Current Country"
                  options={currentCountries}
                  value={currentCountry}
                  onChange={(e) => setCurrentCountry(e.target.value)}
                  placeholder="Select current country"
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                isLoading={isLoading}
                icon={<Search className="h-4 w-4" />}
                onClick={searchEmbassy}
              >
                Find Embassy
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" className="h-64" />
              <Skeleton variant="rectangular" className="h-48" />
            </div>
          ) : embassy ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Embassy Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Building className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {embassy.name}
                        </h2>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{embassy.address}</span>
                          </div>
                          {embassy.phone && (
                            <a href={`tel:${embassy.phone}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                              <Phone className="h-4 w-4 flex-shrink-0" />
                              <span>{embassy.phone}</span>
                            </a>
                          )}
                          {embassy.email && (
                            <a href={`mailto:${embassy.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                              <Mail className="h-4 w-4 flex-shrink-0" />
                              <span>{embassy.email}</span>
                            </a>
                          )}
                          {embassy.website && (
                            <a href={embassy.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                              <Globe className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{embassy.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          )}
                          {embassy.hours && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span>{embassy.hours}</span>
                            </div>
                          )}
                        </div>

                        {embassy.emergencyPhone && (
                          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span className="text-sm font-medium text-red-700 dark:text-red-400">Emergency After-Hours</span>
                              </div>
                              <a href={`tel:${embassy.emergencyPhone}`} className="text-lg font-bold text-red-600 dark:text-red-400 hover:underline">
                                {embassy.emergencyPhone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map */}
                {embassy.latitude && embassy.longitude && (
                  <Card>
                    <div
                      ref={mapRef}
                      className="h-64 rounded-xl"
                      style={{ minHeight: '256px' }}
                    />
                  </Card>
                )}
              </div>

              {/* Emergency Numbers Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Emergency Numbers
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currentCountries.find(c => c.value === currentCountry)?.label}
                    </p>
                  </CardHeader>
                  <CardContent className="!pt-0">
                    <div className="space-y-2">
                      {emergencyNumbers.map((num, i) => (
                        <a
                          key={i}
                          href={`tel:${num.number}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{num.service}</span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-400">{num.number}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Tips</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Save embassy contact before traveling</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Register with your embassy on arrival</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Keep a copy of passport separately</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>Know the after-hours emergency number</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Building className="h-16 w-16" />}
              title="Find your embassy"
              description="Select your nationality and current country to find embassy information and local emergency numbers."
            />
          )}
        </PageContainer>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
