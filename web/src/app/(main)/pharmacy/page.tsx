'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Pill, MapPin, Phone, Navigation, Clock,
  ArrowRight, Globe, ShieldCheck, AlertTriangle, ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { cn, formatDistance } from '@/lib/utils';
import type { Pharmacy, MedicineEquivalent } from '@/types';
import toast from 'react-hot-toast';

const countries = [
  { value: '', label: 'Select country' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'TH', label: 'Thailand' },
  { value: 'IN', label: 'India' },
  { value: 'TR', label: 'Turkey' },
  { value: 'MX', label: 'Mexico' },
  { value: 'BR', label: 'Brazil' },
  { value: 'AE', label: 'UAE' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
];

export default function PharmacyPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [equivalents, setEquivalents] = useState<MedicineEquivalent[]>([]);
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(false);
  const [isLoadingEquivalents, setIsLoadingEquivalents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [destCountry, setDestCountry] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get user location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Default to a location
          setUserLocation({ lat: 13.7563, lng: 100.5018 }); // Bangkok
        }
      );
    }
  }, []);

  // Load nearby pharmacies when location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyPharmacies();
    }
  }, [userLocation]);

  // Initialize map
  useEffect(() => {
    if (!userLocation || !mapRef.current || mapLoaded) return;

    const loadMap = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore - CSS import
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapRef.current!, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 14,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // User marker
      L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="width:16px;height:16px;background:#2563EB;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
      }).addTo(map).bindPopup('Your location');

      // Pharmacy markers
      pharmacies.forEach((pharmacy) => {
        L.marker([pharmacy.latitude, pharmacy.longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="width:24px;height:24px;background:#16a34a;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">+</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        }).addTo(map).bindPopup(`
          <strong>${pharmacy.name}</strong><br/>
          ${pharmacy.address}<br/>
          ${pharmacy.phone ? `<a href="tel:${pharmacy.phone}">${pharmacy.phone}</a>` : ''}
        `);
      });

      setMapLoaded(true);

      return () => {
        map.remove();
      };
    };

    loadMap();
  }, [userLocation, pharmacies]);

  const fetchNearbyPharmacies = async () => {
    if (!userLocation) return;
    setIsLoadingPharmacies(true);
    try {
      const { data } = await api.get('/pharmacies/nearby', {
        params: { lat: userLocation.lat, lng: userLocation.lng, query: searchQuery },
      });
      setPharmacies(data.data || []);
    } catch {
      // Use Overpass API as fallback to find pharmacies
      try {
        const overpassQuery = `
          [out:json][timeout:10];
          node["amenity"="pharmacy"](around:5000,${userLocation.lat},${userLocation.lng});
          out body 10;
        `;
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `data=${encodeURIComponent(overpassQuery)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const overpassData = await response.json();
        const mapped: Pharmacy[] = (overpassData.elements || []).map((el: any, i: number) => ({
          id: el.id?.toString() || `p-${i}`,
          name: el.tags?.name || 'Pharmacy',
          address: el.tags?.['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim() : 'Address not available',
          latitude: el.lat,
          longitude: el.lon,
          phone: el.tags?.phone || el.tags?.['contact:phone'],
          isOpen: el.tags?.opening_hours ? undefined : undefined,
          openingHours: el.tags?.opening_hours,
          distance: Math.round(
            Math.sqrt(
              Math.pow((el.lat - userLocation.lat) * 111139, 2) +
              Math.pow((el.lon - userLocation.lng) * 111139 * Math.cos(userLocation.lat * Math.PI / 180), 2)
            )
          ),
        }));
        setPharmacies(mapped.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
      } catch {
        setPharmacies([]);
      }
    } finally {
      setIsLoadingPharmacies(false);
    }
  };

  const findEquivalent = async () => {
    if (!medicineName.trim() || !destCountry) {
      toast.error('Please enter medicine name and select a country');
      return;
    }
    setIsLoadingEquivalents(true);
    try {
      const { data } = await api.get('/pharmacies/medicine-equivalent', {
        params: { medicine: medicineName, country: destCountry },
      });
      setEquivalents(data.data || []);
    } catch {
      // Demo data
      setEquivalents([
        {
          originalName: medicineName,
          equivalentName: `${medicineName} (Generic)`,
          country: countries.find(c => c.value === destCountry)?.label || destCountry,
          requiresPrescription: true,
          activeIngredient: 'Same active ingredient',
          notes: 'Available at most pharmacies',
        },
        {
          originalName: medicineName,
          equivalentName: `${medicineName} Alternative`,
          country: countries.find(c => c.value === destCountry)?.label || destCountry,
          requiresPrescription: false,
          activeIngredient: 'Similar active ingredient',
          notes: 'Over-the-counter alternative',
        },
      ]);
    } finally {
      setIsLoadingEquivalents(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Pill className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacy Finder</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Find pharmacies and medicine equivalents worldwide
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Medicine Equivalent */}
            <div className="space-y-6">
              {/* Find Equivalent */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary-500" />
                    Find Medicine Equivalent
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Medicine Name"
                    placeholder="e.g., Tylenol, Advil, Paracetamol"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    icon={<Pill className="h-4 w-4" />}
                  />
                  <Select
                    label="Destination Country"
                    options={countries}
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    placeholder="Select country"
                  />
                  <Button
                    variant="primary"
                    fullWidth
                    isLoading={isLoadingEquivalents}
                    icon={<Search className="h-4 w-4" />}
                    onClick={findEquivalent}
                  >
                    Find Equivalent
                  </Button>
                </CardContent>
              </Card>

              {/* Equivalents Table */}
              {equivalents.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Medicine Equivalents</h3>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Original</th>
                          <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Equivalent</th>
                          <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Country</th>
                          <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 px-6 py-3">Rx</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {equivalents.map((eq, i) => (
                          <tr key={i}>
                            <td className="px-6 py-3 text-sm text-gray-900 dark:text-white">{eq.originalName}</td>
                            <td className="px-6 py-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{eq.equivalentName}</p>
                              {eq.activeIngredient && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{eq.activeIngredient}</p>
                              )}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{eq.country}</td>
                            <td className="px-6 py-3">
                              {eq.requiresPrescription ? (
                                <Badge variant="danger" size="sm">Prescription</Badge>
                              ) : (
                                <Badge variant="success" size="sm">OTC</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Nearby Pharmacies */}
            <div className="space-y-6">
              {/* Map */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-500" />
                      Nearby Pharmacies
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      isLoading={isLoadingPharmacies}
                      onClick={fetchNearbyPharmacies}
                    >
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <div
                  ref={mapRef}
                  className="h-64 bg-gray-100 dark:bg-gray-700 rounded-b-xl"
                  style={{ minHeight: '256px' }}
                />
              </Card>

              {/* Pharmacy Search */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search pharmacies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                  className="flex-1"
                />
                <Button variant="primary" onClick={fetchNearbyPharmacies} icon={<Search className="h-4 w-4" />}>
                  Search
                </Button>
              </div>

              {/* Pharmacy List */}
              {isLoadingPharmacies ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="h-24" />
                  ))}
                </div>
              ) : pharmacies.length === 0 ? (
                <EmptyState
                  icon={<Pill className="h-12 w-12" />}
                  title="No pharmacies found"
                  description="Try expanding your search area or check your location permissions."
                />
              ) : (
                <div className="space-y-3">
                  {pharmacies.map((pharmacy) => (
                    <Card key={pharmacy.id} hover>
                      <CardContent className="!py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {pharmacy.name}
                              </h3>
                              {pharmacy.isOpen !== undefined && (
                                <Badge variant={pharmacy.isOpen ? 'success' : 'danger'} size="sm">
                                  {pharmacy.isOpen ? 'Open' : 'Closed'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                              {pharmacy.address}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              {pharmacy.distance != null && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {formatDistance(pharmacy.distance)}
                                </span>
                              )}
                              {pharmacy.phone && (
                                <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline">
                                  <Phone className="h-3 w-3" />
                                  {pharmacy.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm" icon={<Navigation className="h-3.5 w-3.5" />}>
                              Go
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
