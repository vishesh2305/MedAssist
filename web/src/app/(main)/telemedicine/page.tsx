'use client';

import React, { useState, useEffect } from 'react';
import {
  Video, Phone, MessageSquare, Calendar, Clock, Star,
  User, Plus, ArrowRight, ExternalLink, Stethoscope,
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
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Rating } from '@/components/ui/Rating';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import type { Consultation } from '@/types';
import toast from 'react-hot-toast';

const specialties = [
  { value: '', label: 'Select specialty' },
  { value: 'general', label: 'General Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'gynecology', label: 'Gynecology' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'ent', label: 'ENT' },
];

const consultationTypes = [
  { value: 'VIDEO', label: 'Video Call', icon: Video, price: 49 },
  { value: 'AUDIO', label: 'Audio Call', icon: Phone, price: 35 },
  { value: 'CHAT', label: 'Chat', icon: MessageSquare, price: 25 },
];

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
  SCHEDULED: { variant: 'info', label: 'Scheduled' },
  WAITING: { variant: 'warning', label: 'Waiting' },
  IN_PROGRESS: { variant: 'success', label: 'In Progress' },
  COMPLETED: { variant: 'default', label: 'Completed' },
  CANCELLED: { variant: 'danger', label: 'Cancelled' },
};

const typeIcons: Record<string, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Phone,
  CHAT: MessageSquare,
};

export default function TelemedicinePage() {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Booking form
  const [selectedType, setSelectedType] = useState('VIDEO');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }
    fetchConsultations();
  }, [isLoggedIn]);

  const fetchConsultations = async () => {
    try {
      const { data } = await api.get('/consultations');
      setConsultations(data.data || []);
    } catch {
      // Use empty state
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSpecialty || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsBooking(true);
    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;
      await api.post('/consultations', {
        type: selectedType,
        specialty: selectedSpecialty,
        scheduledAt,
        description,
      });
      toast.success('Consultation booked successfully!');
      setActiveTab('upcoming');
      fetchConsultations();
      // Reset form
      setSelectedSpecialty('');
      setSelectedDate('');
      setSelectedTime('');
      setDescription('');
    } catch {
      toast.error('Failed to book consultation');
    } finally {
      setIsBooking(false);
    }
  };

  const upcomingConsultations = consultations.filter(
    c => ['SCHEDULED', 'WAITING', 'IN_PROGRESS'].includes(c.status)
  );
  const pastConsultations = consultations.filter(
    c => ['COMPLETED', 'CANCELLED'].includes(c.status)
  );

  const selectedPrice = consultationTypes.find(t => t.value === selectedType)?.price || 0;

  const tabs = [
    { id: 'book', label: 'Book', icon: <Plus className="h-4 w-4" /> },
    { id: 'upcoming', label: 'Upcoming', count: upcomingConsultations.length },
    { id: 'past', label: 'Past', count: pastConsultations.length },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-gray-900">
        <Header />
        <PageContainer>
          <EmptyState
            icon={<Video className="h-16 w-16" />}
            title="Sign in to use Telemedicine"
            description="Book video, audio, or chat consultations with doctors worldwide."
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
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Telemedicine</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Consult with doctors from anywhere in the world
              </p>
            </div>
          </div>

          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

          {/* Book Tab */}
          {activeTab === 'book' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Book a Consultation</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Consultation Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Consultation Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {consultationTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() => setSelectedType(type.value)}
                              className={cn(
                                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                                selectedType === type.value
                                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              )}
                            >
                              <TypeIcon className={cn(
                                'h-6 w-6',
                                selectedType === type.value
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-gray-400'
                              )} />
                              <span className={cn(
                                'text-sm font-medium',
                                selectedType === type.value
                                  ? 'text-primary-700 dark:text-primary-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              )}>
                                {type.label}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ${type.price}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Specialty */}
                    <Select
                      label="Specialty"
                      options={specialties}
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      placeholder="Select specialty"
                    />

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Input
                        label="Time"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Brief Description of Issue
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your symptoms or concern..."
                        rows={4}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 transition-colors duration-200"
                      />
                    </div>

                    {/* Book Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Consultation fee</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">${selectedPrice}</p>
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        isLoading={isBooking}
                        icon={<Calendar className="h-5 w-5" />}
                        onClick={handleBook}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side info */}
              <div className="space-y-4">
                <Card>
                  <CardContent>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">How it works</h3>
                    <div className="space-y-3">
                      {[
                        { step: '1', text: 'Choose consultation type and specialty' },
                        { step: '2', text: 'Pick your preferred date and time' },
                        { step: '3', text: 'Describe your health concern' },
                        { step: '4', text: 'A matched doctor joins your session' },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{item.step}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Need immediate help?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      For emergencies, use our SOS feature for instant hospital connection.
                    </p>
                    <Button variant="danger" size="sm" fullWidth onClick={() => window.location.href = '/emergency'}>
                      Emergency SOS
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Upcoming Tab */}
          {activeTab === 'upcoming' && (
            <div>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="h-32" />
                  ))}
                </div>
              ) : upcomingConsultations.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-16 w-16" />}
                  title="No upcoming consultations"
                  description="Book a consultation to get started."
                  actionLabel="Book Now"
                  onAction={() => setActiveTab('book')}
                />
              ) : (
                <div className="space-y-4">
                  {upcomingConsultations.map((consultation) => {
                    const TypeIcon = typeIcons[consultation.type] || Video;
                    const status = statusConfig[consultation.status] || statusConfig.SCHEDULED;
                    return (
                      <Card key={consultation.id}>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {consultation.doctorName || 'Doctor assigned soon'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {consultation.doctorSpecialty}
                                </p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(consultation.scheduledAt, 'long')}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <TypeIcon className="h-3.5 w-3.5" />
                                    {consultation.type}
                                  </div>
                                  <Badge variant={status.variant} size="sm">{status.label}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {(consultation.status === 'WAITING' || consultation.status === 'IN_PROGRESS') && (
                                <a href={consultation.meetingLink || '#'} target="_blank" rel="noopener noreferrer">
                                  <Button variant="primary" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                                    Join
                                  </Button>
                                </a>
                              )}
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {formatCurrency(consultation.price, consultation.currency)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Past Tab */}
          {activeTab === 'past' && (
            <div>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" className="h-32" />
                  ))}
                </div>
              ) : pastConsultations.length === 0 ? (
                <EmptyState
                  icon={<Clock className="h-16 w-16" />}
                  title="No past consultations"
                  description="Your completed consultations will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {pastConsultations.map((consultation) => {
                    const TypeIcon = typeIcons[consultation.type] || Video;
                    const status = statusConfig[consultation.status] || statusConfig.COMPLETED;
                    return (
                      <Card key={consultation.id}>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {consultation.doctorName}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {consultation.doctorSpecialty}
                                </p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(consultation.scheduledAt)}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <TypeIcon className="h-3.5 w-3.5" />
                                    {consultation.type}
                                  </div>
                                  <Badge variant={status.variant} size="sm">{status.label}</Badge>
                                </div>
                                {consultation.rating && (
                                  <div className="mt-2">
                                    <Rating value={consultation.rating} size="sm" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {formatCurrency(consultation.price, consultation.currency)}
                              </p>
                              {consultation.duration && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {consultation.duration} min
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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
