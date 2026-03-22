'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Users, Star, Calendar, TrendingUp, MessageSquare } from 'lucide-react';

export default function HospitalDashboardPage() {
  const stats = [
    { label: 'Total Views', value: '4,523', icon: TrendingUp, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Reviews', value: '128', icon: Star, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
    { label: 'Active Chats', value: '12', icon: MessageSquare, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { label: 'Doctors', value: '24', icon: Users, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your hospital profile and services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Reviews</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah K.', rating: 5, text: 'Excellent care and friendly staff. The doctors spoke English fluently.' },
                { name: 'Marco R.', rating: 4, text: 'Good facilities, clean rooms. Wait time was a bit long but overall positive.' },
                { name: 'Yuki T.', rating: 5, text: 'The multilingual support was incredible. Felt completely at ease despite being in a foreign country.' },
              ].map((review, i) => (
                <div key={i} className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{review.name}</span>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Update hospital profile', desc: 'Keep your information up to date', href: '/dashboard/settings' },
              { label: 'Manage doctor profiles', desc: 'Add or update doctor information', href: '/dashboard/doctors' },
              { label: 'Update pricing', desc: 'Review and update service prices', href: '/dashboard/pricing' },
              { label: 'Respond to reviews', desc: 'Engage with patient feedback', href: '/dashboard/reviews' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
