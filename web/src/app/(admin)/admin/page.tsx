'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { Users, Building2, Star, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import type { DashboardStats } from '@/types';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/dashboard');
        setStats(data);
      } catch {
        // Use mock data for demo
        setStats({
          totalUsers: 12543,
          totalHospitals: 2847,
          totalReviews: 8934,
          totalEmergencies: 456,
          activeEmergencies: 3,
          registrationsOverTime: [],
          emergenciesByStatus: [
            { status: 'TRIGGERED', count: 12 },
            { status: 'RESPONDED', count: 8 },
            { status: 'RESOLVED', count: 430 },
            { status: 'CANCELLED', count: 6 },
          ],
          recentActivity: [],
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', trend: '+12%' },
    { label: 'Hospitals', value: stats?.totalHospitals || 0, icon: Building2, color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', trend: '+5%' },
    { label: 'Reviews', value: stats?.totalReviews || 0, icon: Star, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400', trend: '+18%' },
    { label: 'Emergencies', value: stats?.totalEmergencies || 0, icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400', active: stats?.activeEmergencies },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of platform statistics and activity</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-28" />
          ))
        ) : (
          statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {stat.trend && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-0.5">
                        <TrendingUp className="h-3 w-3" />
                        {stat.trend}
                      </span>
                    )}
                    {stat.active !== undefined && stat.active > 0 && (
                      <Badge variant="danger" size="sm">{stat.active} active</Badge>
                    )}
                  </div>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergencies by Status */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergencies by Status
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton variant="list" />
            ) : (
              <div className="space-y-3">
                {stats?.emergenciesByStatus?.map((item) => {
                  const total = stats.totalEmergencies || 1;
                  const percentage = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{item.status}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </h3>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton variant="list" />
            ) : (
              <div className="space-y-4">
                {[
                  { desc: 'New user registered: John Doe', time: '2 minutes ago', type: 'user' },
                  { desc: 'Hospital verified: Bangkok General Hospital', time: '15 minutes ago', type: 'hospital' },
                  { desc: 'Emergency resolved in Dubai', time: '1 hour ago', type: 'emergency' },
                  { desc: 'New review posted on City Medical Center', time: '2 hours ago', type: 'review' },
                  { desc: 'Hospital application: Mumbai Health Center', time: '3 hours ago', type: 'hospital' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'emergency' ? 'bg-red-500' :
                      activity.type === 'hospital' ? 'bg-green-500' :
                      activity.type === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{activity.desc}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
