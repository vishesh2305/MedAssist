'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { BarChart3, Users, Building2, TrendingUp, Globe } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const metrics = [
    { label: 'Monthly Active Users', value: '8,234', change: '+12.5%', positive: true },
    { label: 'New Registrations', value: '1,847', change: '+8.2%', positive: true },
    { label: 'Hospital Searches', value: '45,329', change: '+23.1%', positive: true },
    { label: 'Emergency Triggers', value: '67', change: '-5.3%', positive: false },
    { label: 'Avg. Response Time', value: '4.2 min', change: '-15.8%', positive: true },
    { label: 'Chat Messages', value: '12,456', change: '+31.4%', positive: true },
  ];

  const topCountries = [
    { country: 'Thailand', searches: 12453, percentage: 28 },
    { country: 'Turkey', searches: 8932, percentage: 20 },
    { country: 'India', searches: 7654, percentage: 17 },
    { country: 'Mexico', searches: 5432, percentage: 12 },
    { country: 'Spain', searches: 4321, percentage: 10 },
  ];

  const topSpecialties = [
    { specialty: 'General Medicine', count: 8745, percentage: 35 },
    { specialty: 'Dentistry', count: 5432, percentage: 22 },
    { specialty: 'Cardiology', count: 3456, percentage: 14 },
    { specialty: 'Orthopedics', count: 2987, percentage: 12 },
    { specialty: 'Dermatology', count: 2134, percentage: 9 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Platform performance and usage metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <span className={`text-sm font-medium flex items-center gap-0.5 ${
                  metric.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendingUp className={`h-3 w-3 ${!metric.positive ? 'rotate-180' : ''}`} />
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Countries by Search Volume
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((item) => (
                <div key={item.country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{item.country}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.searches.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Specialties */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Most Searched Specialties
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSpecialties.map((item) => (
                <div key={item.specialty}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{item.specialty}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
