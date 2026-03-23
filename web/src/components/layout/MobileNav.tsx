'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Building2, AlertTriangle, MessageSquare, User, MoreHorizontal,
  Shield, FileText, Video, Pill, Plane, Globe, Package, Sparkles, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/emergency', label: 'SOS', icon: AlertTriangle },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '#more', label: 'More', icon: MoreHorizontal },
];

const serviceLinks = [
  { href: '/medical-passport', label: 'Medical Passport', icon: Shield },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/telemedicine', label: 'Telemedicine', icon: Video },
  { href: '/pharmacy', label: 'Pharmacy', icon: Pill },
  { href: '/trip-planner', label: 'Trip Planner', icon: Plane },
  { href: '/embassies', label: 'Embassies', icon: Globe },
  { href: '/packages', label: 'Packages', icon: Package },
  { href: '/health-assistant', label: 'AI Assistant', icon: Sparkles },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isServiceActive = serviceLinks.some(s => pathname === s.href);

  return (
    <>
      {/* More Services Overlay */}
      {showMore && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl border-t border-gray-200 dark:border-gray-800 safe-bottom">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">All Services</h3>
              <button
                onClick={() => setShowMore(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1 p-4">
              {serviceLinks.map((service) => {
                const isActive = pathname === service.href;
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <service.icon className="h-6 w-6" />
                    <span className="text-[10px] font-medium text-center leading-tight">{service.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {tabs.map((tab) => {
            const isMore = tab.href === '#more';
            const isActive = isMore ? isServiceActive : pathname === tab.href;
            const isEmergency = tab.href === '/emergency';

            if (isMore) {
              return (
                <button
                  key={tab.href}
                  onClick={() => setShowMore(!showMore)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors min-w-0',
                    isActive || showMore
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setShowMore(false)}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg transition-colors min-w-0',
                  isActive && !isEmergency
                    ? 'text-primary-600 dark:text-primary-400'
                    : isEmergency
                    ? 'text-red-500'
                    : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {isEmergency ? (
                  <div className="h-10 w-10 -mt-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                    <tab.icon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <tab.icon className="h-5 w-5" />
                )}
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
