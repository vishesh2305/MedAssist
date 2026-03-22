'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, AlertTriangle, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/hospitals', label: 'Hospitals', icon: Building2 },
  { href: '/emergency', label: 'SOS', icon: AlertTriangle },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isEmergency = tab.href === '/emergency';
          return (
            <Link
              key={tab.href}
              href={tab.href}
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
  );
}
