'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Users, Building2, Star, AlertTriangle, BarChart3,
} from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/admin/users', label: 'Users', icon: <Users className="h-5 w-5" /> },
  { href: '/admin/hospitals', label: 'Hospitals', icon: <Building2 className="h-5 w-5" /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star className="h-5 w-5" /> },
  { href: '/admin/emergencies', label: 'Emergencies', icon: <AlertTriangle className="h-5 w-5" /> },
  { href: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isInitialized } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && user && user.role !== 'SUPER_ADMIN') {
      router.push('/');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || (user && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <Sidebar
          links={adminLinks}
          title="Admin Panel"
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
