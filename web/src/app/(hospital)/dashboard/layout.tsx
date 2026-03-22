'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, DollarSign, Star, Settings } from 'lucide-react';

const dashboardLinks = [
  { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/dashboard/doctors', label: 'Doctors', icon: <Users className="h-5 w-5" /> },
  { href: '/dashboard/pricing', label: 'Pricing', icon: <DollarSign className="h-5 w-5" /> },
  { href: '/dashboard/reviews', label: 'Reviews', icon: <Star className="h-5 w-5" /> },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export default function HospitalDashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isInitialized } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user && user.role !== 'HOSPITAL_ADMIN') {
      router.push('/');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || (user && user.role !== 'HOSPITAL_ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar
          links={dashboardLinks}
          title="Hospital Dashboard"
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
