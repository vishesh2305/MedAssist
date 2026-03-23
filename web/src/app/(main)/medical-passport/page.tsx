'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Heart, Shield, Plus, X, QrCode, Download, Printer,
  Droplets, Pill, AlertCircle, Syringe, CreditCard, Save, Loader2,
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
import type { MedicalPassport, VaccinationRecord } from '@/types';
import toast from 'react-hot-toast';

const bloodTypeOptions = [
  { value: '', label: 'Select blood type' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
  icon,
}: {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 transition-colors duration-200"
          />
        </div>
        <Button variant="outline" size="md" onClick={handleAdd} icon={<Plus className="h-4 w-4" />}>
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm dark:bg-primary-900/30 dark:text-primary-400"
            >
              {tag}
              <button
                onClick={() => onRemove(i)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function generateQRCodeSVG(data: string, size: number = 200): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=svg`;
}

export default function MedicalPassportPage() {
  const { isLoggedIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [newVacName, setNewVacName] = useState('');
  const [newVacDate, setNewVacDate] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insurancePhone, setInsurancePhone] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    const fetchPassport = async () => {
      try {
        const { data } = await api.get('/medical-passport');
        const p = data.data as MedicalPassport;
        setBloodType(p.bloodType || '');
        setAllergies(p.allergies || []);
        setMedications(p.medications || []);
        setConditions(p.conditions || []);
        setVaccinations(p.vaccinations || []);
        setInsuranceProvider(p.insuranceProvider || '');
        setInsurancePolicyNumber(p.insurancePolicyNumber || '');
        setInsurancePhone(p.insurancePhone || '');
        setInsuranceExpiry(p.insuranceExpiry || '');
      } catch {
        // No passport yet, use empty defaults
      } finally {
        setIsLoading(false);
      }
    };
    fetchPassport();
  }, [isLoggedIn]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/medical-passport', {
        bloodType,
        allergies,
        medications,
        conditions,
        vaccinations,
        insuranceProvider,
        insurancePolicyNumber,
        insurancePhone,
        insuranceExpiry,
      });
      toast.success('Medical passport saved successfully');
    } catch {
      toast.error('Failed to save medical passport');
    } finally {
      setIsSaving(false);
    }
  };

  const addVaccination = () => {
    if (newVacName.trim() && newVacDate) {
      setVaccinations([...vaccinations, { name: newVacName.trim(), date: newVacDate }]);
      setNewVacName('');
      setNewVacDate('');
    }
  };

  const removeVaccination = (index: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  const qrData = JSON.stringify({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    bloodType,
    allergies,
    medications,
    conditions,
    insuranceProvider,
    insurancePolicyNumber,
  });

  const qrUrl = generateQRCodeSVG(qrData, 300);

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'medical-passport-qr.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Medical Passport QR Code</title></head>
          <body style="display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;font-family:sans-serif;">
            <div style="text-align:center;">
              <h2>Medical Passport QR Code</h2>
              <p>${user?.firstName} ${user?.lastName}</p>
              <img src="${qrUrl}" width="300" height="300" />
              <p style="color:#666;font-size:14px;margin-top:16px;">Show this QR code to hospital staff for quick access to your medical information.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer>
          <EmptyState
            icon={<Shield className="h-16 w-16" />}
            title="Sign in to access your Medical Passport"
            description="Your medical passport stores vital health information that can be shared instantly with healthcare providers via QR code."
            actionLabel="Sign In"
            onAction={() => window.location.href = '/login'}
          />
        </PageContainer>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <main className="pb-20 md:pb-0">
        <PageContainer>
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Passport</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Store your medical information for quick access anywhere
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" className="h-32" />
              <Skeleton variant="rectangular" className="h-48" />
              <Skeleton variant="rectangular" className="h-48" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Blood Type */}
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Droplets className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blood Type</h3>
                    </div>
                    <Select
                      options={bloodTypeOptions}
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      placeholder="Select blood type"
                    />
                  </CardContent>
                </Card>

                {/* Allergies */}
                <Card>
                  <CardContent>
                    <TagInput
                      label="Allergies"
                      tags={allergies}
                      onAdd={(tag) => setAllergies([...allergies, tag])}
                      onRemove={(i) => setAllergies(allergies.filter((_, idx) => idx !== i))}
                      placeholder="e.g., Penicillin, Peanuts, Latex"
                      icon={<AlertCircle className="h-4 w-4" />}
                    />
                  </CardContent>
                </Card>

                {/* Current Medications */}
                <Card>
                  <CardContent>
                    <TagInput
                      label="Current Medications"
                      tags={medications}
                      onAdd={(tag) => setMedications([...medications, tag])}
                      onRemove={(i) => setMedications(medications.filter((_, idx) => idx !== i))}
                      placeholder="e.g., Metformin 500mg, Lisinopril 10mg"
                      icon={<Pill className="h-4 w-4" />}
                    />
                  </CardContent>
                </Card>

                {/* Chronic Conditions */}
                <Card>
                  <CardContent>
                    <TagInput
                      label="Chronic Conditions"
                      tags={conditions}
                      onAdd={(tag) => setConditions([...conditions, tag])}
                      onRemove={(i) => setConditions(conditions.filter((_, idx) => idx !== i))}
                      placeholder="e.g., Diabetes Type 2, Hypertension"
                      icon={<Heart className="h-4 w-4" />}
                    />
                  </CardContent>
                </Card>

                {/* Vaccination Records */}
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Syringe className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccination Records</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <Input
                        placeholder="Vaccine name"
                        value={newVacName}
                        onChange={(e) => setNewVacName(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="date"
                        value={newVacDate}
                        onChange={(e) => setNewVacDate(e.target.value)}
                        className="sm:w-44"
                      />
                      <Button variant="outline" size="md" onClick={addVaccination} icon={<Plus className="h-4 w-4" />}>
                        Add
                      </Button>
                    </div>
                    {vaccinations.length > 0 ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {vaccinations.map((vac, i) => (
                          <div key={i} className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{vac.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(vac.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <button
                              onClick={() => removeVaccination(i)}
                              className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No vaccination records added yet
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Insurance Information */}
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance Information</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Provider Name"
                        placeholder="e.g., Blue Cross"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                      />
                      <Input
                        label="Policy Number"
                        placeholder="e.g., POL-123456"
                        value={insurancePolicyNumber}
                        onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                      />
                      <Input
                        label="Phone"
                        placeholder="e.g., +1-800-123-4567"
                        value={insurancePhone}
                        onChange={(e) => setInsurancePhone(e.target.value)}
                      />
                      <Input
                        label="Expiry Date"
                        type="date"
                        value={insuranceExpiry}
                        onChange={(e) => setInsuranceExpiry(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSaving}
                  icon={<Save className="h-5 w-5" />}
                  onClick={handleSave}
                >
                  Save Medical Passport
                </Button>
              </div>

              {/* Right Column - QR Code */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <QrCode className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">QR Code</h3>
                    </div>
                    {showQR ? (
                      <div>
                        <div className="bg-white p-4 rounded-xl inline-block mb-4">
                          <img src={qrUrl} alt="Medical Passport QR Code" className="w-64 h-64 mx-auto" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          This QR contains your medical info. Show it to hospital staff.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Download className="h-4 w-4" />}
                            onClick={handleDownloadQR}
                          >
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Printer className="h-4 w-4" />}
                            onClick={handlePrintQR}
                          >
                            Print
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="h-48 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
                          <QrCode className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Generate your medical QR code
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          fullWidth
                          icon={<QrCode className="h-4 w-4" />}
                          onClick={() => setShowQR(true)}
                        >
                          Generate QR Code
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary Card */}
                <Card>
                  <CardContent>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Blood Type</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {bloodType || 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Allergies</span>
                        <Badge variant={allergies.length > 0 ? 'danger' : 'default'} size="sm">
                          {allergies.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Medications</span>
                        <Badge variant={medications.length > 0 ? 'info' : 'default'} size="sm">
                          {medications.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Conditions</span>
                        <Badge variant={conditions.length > 0 ? 'warning' : 'default'} size="sm">
                          {conditions.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Vaccinations</span>
                        <Badge variant={vaccinations.length > 0 ? 'success' : 'default'} size="sm">
                          {vaccinations.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Insurance</span>
                        <Badge variant={insuranceProvider ? 'success' : 'default'} size="sm">
                          {insuranceProvider ? 'Active' : 'None'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </PageContainer>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
