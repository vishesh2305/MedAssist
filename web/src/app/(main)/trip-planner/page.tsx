'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane, Calendar, Shield, Phone, AlertTriangle, Syringe,
  CheckCircle, Sun, Thermometer, MapPin, Save, Trash2,
  ChevronDown, ChevronRight, Clock, Globe, Heart,
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
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import type { TripPlan, TripVaccination, EmergencyNumber } from '@/types';
import toast from 'react-hot-toast';

const countryList = [
  { value: '', label: 'Select destination' },
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
  { value: 'KE', label: 'Kenya' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'GR', label: 'Greece' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'GB', label: 'United Kingdom' },
];

// Vaccination data per country
const vaccinationData: Record<string, TripVaccination[]> = {
  TH: [
    { name: 'Hepatitis A', status: 'REQUIRED', description: 'Recommended for all travelers' },
    { name: 'Typhoid', status: 'REQUIRED', description: 'Especially if visiting smaller cities' },
    { name: 'Hepatitis B', status: 'RECOMMENDED', description: 'For those who may have intimate contact' },
    { name: 'Japanese Encephalitis', status: 'RECOMMENDED', description: 'For rural areas and long stays' },
    { name: 'Rabies', status: 'OPTIONAL', description: 'For adventure travelers' },
    { name: 'Malaria prophylaxis', status: 'RECOMMENDED', description: 'For rural/border areas' },
  ],
  IN: [
    { name: 'Hepatitis A', status: 'REQUIRED', description: 'Essential for all travelers' },
    { name: 'Typhoid', status: 'REQUIRED', description: 'Strongly recommended' },
    { name: 'Hepatitis B', status: 'REQUIRED', description: 'Recommended for all travelers' },
    { name: 'Japanese Encephalitis', status: 'RECOMMENDED', description: 'For rural areas' },
    { name: 'Rabies', status: 'RECOMMENDED', description: 'High risk of exposure' },
    { name: 'Malaria prophylaxis', status: 'REQUIRED', description: 'Required for most areas' },
    { name: 'Yellow Fever', status: 'OPTIONAL', description: 'If arriving from endemic area' },
  ],
  BR: [
    { name: 'Yellow Fever', status: 'REQUIRED', description: 'Required for certain regions' },
    { name: 'Hepatitis A', status: 'REQUIRED', description: 'Recommended for all travelers' },
    { name: 'Typhoid', status: 'RECOMMENDED', description: 'For adventurous eaters' },
    { name: 'Rabies', status: 'OPTIONAL', description: 'For rural areas and animal contact' },
    { name: 'Malaria prophylaxis', status: 'RECOMMENDED', description: 'For Amazon region' },
  ],
};

// Emergency numbers by country
const emergencyNumberData: Record<string, EmergencyNumber[]> = {
  TH: [
    { service: 'Police', number: '191' },
    { service: 'Ambulance', number: '1669' },
    { service: 'Fire', number: '199' },
    { service: 'Tourist Police', number: '1155' },
  ],
  IN: [
    { service: 'Police', number: '100' },
    { service: 'Ambulance', number: '108' },
    { service: 'Fire', number: '101' },
    { service: 'Universal Emergency', number: '112' },
  ],
  BR: [
    { service: 'Police', number: '190' },
    { service: 'Ambulance', number: '192' },
    { service: 'Fire', number: '193' },
  ],
  default: [
    { service: 'Universal Emergency', number: '112' },
    { service: 'Police', number: '112' },
    { service: 'Ambulance', number: '112' },
  ],
};

const packingListData: Record<string, string[]> = {
  default: [
    'Prescription medications (with doctor note)',
    'Basic first aid kit',
    'Insect repellent (DEET-based)',
    'Sunscreen SPF 50+',
    'Hand sanitizer',
    'Rehydration salts',
    'Anti-diarrheal medication',
    'Antihistamines',
    'Pain relievers (Ibuprofen/Paracetamol)',
    'Medical passport / health records',
    'Travel insurance documents',
    'Vaccination certificate',
  ],
};

const statusColors: Record<string, { bg: string; text: string; badge: 'danger' | 'warning' | 'info' }> = {
  REQUIRED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', badge: 'danger' },
  RECOMMENDED: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', badge: 'warning' },
  OPTIONAL: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', badge: 'info' },
};

export default function TripPlannerPage() {
  const { isLoggedIn } = useAuth();
  const [destCountry, setDestCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<{
    vaccinations: TripVaccination[];
    emergencyNumbers: EmergencyNumber[];
    healthAlerts: string[];
    packingList: string[];
  } | null>(null);
  const [savedPlans, setSavedPlans] = useState<TripPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedPlans();
    }
  }, [isLoggedIn]);

  const fetchSavedPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const { data } = await api.get('/trip-plans');
      setSavedPlans(data.data || []);
    } catch {
      // empty
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const generatePlan = async () => {
    if (!destCountry || !startDate || !endDate) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsGenerating(true);
    try {
      // Try API first
      const [vacData, emergData] = await Promise.allSettled([
        api.get(`/trip-plans/vaccinations/${destCountry}`),
        api.get(`/trip-plans/emergency-numbers/${destCountry}`),
      ]);

      const vaccinations = vacData.status === 'fulfilled'
        ? vacData.value.data.data
        : (vaccinationData[destCountry] || vaccinationData.TH || []);

      const emergencyNumbers = emergData.status === 'fulfilled'
        ? emergData.value.data.data
        : (emergencyNumberData[destCountry] || emergencyNumberData.default);

      const countryName = countryList.find(c => c.value === destCountry)?.label || destCountry;

      setPlan({
        vaccinations,
        emergencyNumbers,
        healthAlerts: [
          `Check travel advisories for ${countryName} before departure`,
          'Ensure travel health insurance covers medical evacuation',
          'Carry copies of prescriptions for any medications',
          'Research nearest international hospitals at your destination',
        ],
        packingList: packingListData.default,
      });
    } catch {
      // Use fallback data
      setPlan({
        vaccinations: vaccinationData[destCountry] || vaccinationData.TH || [],
        emergencyNumbers: emergencyNumberData[destCountry] || emergencyNumberData.default,
        healthAlerts: [
          'Check travel advisories before departure',
          'Ensure travel health insurance is active',
          'Carry copies of prescriptions',
        ],
        packingList: packingListData.default,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = async () => {
    if (!plan || !isLoggedIn) {
      if (!isLoggedIn) toast.error('Please sign in to save plans');
      return;
    }
    setIsSaving(true);
    try {
      await api.post('/trip-plans', {
        destinationCountry: countryList.find(c => c.value === destCountry)?.label || destCountry,
        destinationCode: destCountry,
        startDate,
        endDate,
        vaccinations: plan.vaccinations,
        emergencyNumbers: plan.emergencyNumbers,
        healthAlerts: plan.healthAlerts,
        packingList: plan.packingList,
      });
      toast.success('Trip plan saved!');
      fetchSavedPlans();
    } catch {
      toast.error('Failed to save trip plan');
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await api.delete(`/trip-plans/${id}`);
      setSavedPlans(savedPlans.filter(p => p.id !== id));
      toast.success('Plan deleted');
    } catch {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Plane className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trip Health Planner</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prepare for a healthy trip with vaccination and safety info
              </p>
            </div>
          </div>

          {/* Plan Form */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plan Your Trip</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Select
                  label="Destination Country"
                  options={countryList}
                  value={destCountry}
                  onChange={(e) => { setDestCountry(e.target.value); setPlan(null); }}
                  placeholder="Select destination"
                />
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isGenerating}
                icon={<Plane className="h-5 w-5" />}
                onClick={generatePlan}
              >
                Generate Health Plan
              </Button>
            </CardContent>
          </Card>

          {/* Generated Plan */}
          {plan && (
            <div className="space-y-6 mb-8">
              {/* Vaccination Checklist */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Syringe className="h-5 w-5 text-green-500" />
                    Vaccination Checklist
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {plan.vaccinations.map((vac, i) => {
                      const colors = statusColors[vac.status] || statusColors.OPTIONAL;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
                            <Syringe className={cn('h-4 w-4', colors.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{vac.name}</h4>
                              <Badge variant={colors.badge} size="sm">{vac.status}</Badge>
                            </div>
                            {vac.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{vac.description}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Numbers */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-500" />
                    Local Emergency Numbers
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {plan.emergencyNumbers.map((num, i) => (
                      <a
                        key={i}
                        href={`tel:${num.number}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{num.service}</span>
                        </div>
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">{num.number}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Alerts */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Health Alerts & Advisories
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plan.healthAlerts.map((alert, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Packing Checklist */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Health Packing Checklist
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {plan.packingList.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Plan */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSaving}
                icon={<Save className="h-5 w-5" />}
                onClick={savePlan}
              >
                Save Trip Plan
              </Button>
            </div>
          )}

          {/* Saved Plans */}
          {isLoggedIn && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Saved Trip Plans</h2>
              {isLoadingPlans ? (
                <div className="space-y-3">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="h-20" />
                  ))}
                </div>
              ) : savedPlans.length === 0 ? (
                <EmptyState
                  icon={<Plane className="h-12 w-12" />}
                  title="No saved trip plans"
                  description="Generate and save a trip plan to see it here."
                />
              ) : (
                <div className="space-y-3">
                  {savedPlans.map((savedPlan) => (
                    <Card key={savedPlan.id}>
                      <CardContent className="!py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {savedPlan.destinationCountry}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(savedPlan.startDate)} - {formatDate(savedPlan.endDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="info" size="sm">
                              {savedPlan.vaccinations?.length || 0} vaccines
                            </Badge>
                            <button
                              onClick={() => deletePlan(savedPlan.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </PageContainer>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
