'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { Sun, Moon, Monitor, Globe, Bell, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth(true);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />

      <PageContainer size="sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Theme */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Appearance
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                      theme === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    )}
                  >
                    <option.icon className={cn(
                      'h-6 w-6',
                      theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                    )}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </h3>
            </CardHeader>
            <CardContent>
              <Select
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'ar', label: 'Arabic' },
                  { value: 'hi', label: 'Hindi' },
                ]}
                defaultValue="en"
              />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Emergency alerts', desc: 'Receive alerts for active emergencies', checked: true },
                { label: 'Chat messages', desc: 'Get notified about new messages', checked: true },
                { label: 'Review responses', desc: 'When a hospital responds to your review', checked: true },
                { label: 'Promotional updates', desc: 'News and special offers', checked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Share location for hospital search</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allow MedAssist to use your location to find nearby hospitals</p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Profile visible to hospitals</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allow hospitals to see your profile when you initiate a chat</p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardContent>
              <Button
                variant="danger"
                fullWidth
                icon={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <MobileNav />
    </div>
  );
}
