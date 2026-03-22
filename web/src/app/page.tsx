'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Star,
  Globe,
  Heart,
  ArrowRight,
  MessageSquare,
  Smartphone,
  Stethoscope,
  Eye,
  Brain,
  Bone,
  Baby,
  Syringe,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';

const specialties = [
  { name: 'General Medicine', icon: Stethoscope, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { name: 'Cardiology', icon: Heart, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { name: 'Orthopedics', icon: Bone, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { name: 'Ophthalmology', icon: Eye, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { name: 'Neurology', icon: Brain, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { name: 'Pediatrics', icon: Baby, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
];

const steps = [
  {
    icon: Search,
    title: 'Find a Hospital',
    description: 'Search hospitals near you filtered by specialty, language, and budget. View ratings and verified reviews.',
  },
  {
    icon: MessageSquare,
    title: 'Connect Instantly',
    description: 'Chat directly with hospitals in your language. Get real-time translation and immediate responses.',
  },
  {
    icon: Shield,
    title: 'Receive Quality Care',
    description: 'Visit verified hospitals with transparent pricing. Track your medical records securely.',
  },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    location: 'New York, USA',
    rating: 5,
    content: 'MedAssist helped me find an English-speaking cardiologist in Bangkok within minutes. The real-time chat translation was a lifesaver.',
  },
  {
    name: 'Marco Rossi',
    location: 'Milan, Italy',
    rating: 5,
    content: 'When my daughter had an allergic reaction in Mexico, the emergency SOS feature connected us with the nearest hospital immediately.',
  },
  {
    name: 'Aisha Patel',
    location: 'Mumbai, India',
    rating: 4,
    content: 'Transparent pricing and verified reviews gave me confidence choosing a dental clinic in Turkey. Saved both time and money.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/hospitals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 pt-12 pb-20 lg:pt-20 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight"
              >
                Find trusted hospitals{' '}
                <span className="text-primary-600 dark:text-primary-400">near you</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 text-lg text-gray-600 dark:text-gray-400"
              >
                Access quality healthcare anywhere in the world. Compare hospitals, chat with doctors, and get emergency assistance in your language.
              </motion.p>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSearch}
                className="mt-8 flex gap-2 max-w-xl mx-auto"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by hospital, specialty, or city..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm"
                  />
                </div>
                <Button type="submit" size="lg" icon={<MapPin className="h-4 w-4" />}>
                  Search
                </Button>
              </motion.form>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 flex items-center justify-center gap-8 flex-wrap"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2,500+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Verified Hospitals</p>
                </div>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">50+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Countries</p>
                </div>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">20+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Languages</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-100/50 dark:bg-primary-900/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-3xl" />
        </section>

        {/* Quick Emergency SOS */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-red-100 dark:border-red-800/30">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Need immediate help?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tap the SOS button to alert nearby hospitals and emergency services instantly.
                </p>
              </div>
              <EmergencyButton onPress={() => router.push('/emergency')} size="sm" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-surface-light dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How it works</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get medical assistance in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse by specialty</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Find the right specialist for your needs
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty) => (
                <Link key={specialty.name} href={`/hospitals?specialty=${specialty.name.toLowerCase()}`}>
                  <Card hover className="text-center py-6">
                    <CardContent className="!p-0">
                      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${specialty.color} mb-3`}>
                        <specialty.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {specialty.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-surface-light dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Healthcare you can trust, wherever you travel
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Globe, title: 'Multi-language Support', desc: 'Chat with hospitals in 20+ languages with real-time translation.' },
                    { icon: Shield, title: 'Verified Hospitals', desc: 'Every hospital is verified for quality standards and accreditation.' },
                    { icon: Clock, title: '24/7 Emergency Access', desc: 'Instant SOS alerts with GPS location sharing to nearby hospitals.' },
                    { icon: Star, title: 'Transparent Pricing', desc: 'Compare costs upfront with no hidden fees or surprises.' },
                  ].map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to find care?</h3>
                <p className="text-primary-100 mb-6">
                  Join thousands of travelers who trust MedAssist for their healthcare needs abroad.
                </p>
                <div className="flex gap-3">
                  <Link href="/signup">
                    <Button variant="secondary" size="lg">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/hospitals">
                    <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                      Browse Hospitals
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Trusted by travelers worldwide
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Real experiences from people who found care abroad
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="h-full">
                    <CardContent>
                      <Rating value={testimonial.rating} size="sm" className="mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {testimonial.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="py-16 bg-primary-600 dark:bg-primary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Smartphone className="h-12 w-12 text-primary-200 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Take MedAssist everywhere
            </h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">
              Download our mobile app for offline access to hospital information, emergency SOS, and instant chat with medical facilities.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                App Store
              </button>
              <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.49c-.27.07-.56.1-.84.1-.55 0-1.07-.15-1.52-.42l9.1-9.1 2.27 2.27-8.01 7.15zm-1.97-1.5L1 3.5c0-.18.02-.36.05-.53L10.6 12.5 1.21 21.99zM21.8 11.33l-3.19-1.78L15.28 12.5l3.62 3.24 2.9-1.62c.59-.33.94-.93.94-1.59 0-.65-.35-1.24-.94-1.2zM14.25 11.47L5.06 2.28 16.81 8.76l-2.56 2.71z" /></svg>
                Google Play
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
