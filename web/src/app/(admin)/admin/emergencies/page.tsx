'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import type { EmergencyLog } from '@/types';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { AlertTriangle, MapPin, Eye } from 'lucide-react';

const statusVariants: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'default'> = {
  TRIGGERED: 'danger',
  RESPONDED: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  CANCELLED: 'default',
};

export default function AdminEmergenciesPage() {
  const [emergencies, setEmergencies] = useState<EmergencyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const { data } = await api.get('/admin/emergencies');
        setEmergencies(data.data || data.emergencies || []);
      } catch {
        setEmergencies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmergencies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Logs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and manage emergency incidents</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td className="px-6 py-4" colSpan={5}><Skeleton className="h-4 w-full" /></td></tr>
                ))
              ) : emergencies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    No emergency logs found
                  </td>
                </tr>
              ) : (
                emergencies.map((emergency) => {
                  const userName = emergency.user
                    ? (typeof emergency.user === 'object'
                      ? `${emergency.user.firstName || ''} ${emergency.user.lastName || ''}`.trim() || 'User'
                      : 'User')
                    : 'Unknown';

                  return (
                    <tr key={emergency.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={userName}
                            size="sm"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {userName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusVariants[emergency.status] || 'default'} size="sm">
                          {(emergency.status || '').replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {emergency.latitude != null && emergency.longitude != null ? (
                          <a
                            href={`https://maps.google.com/?q=${emergency.latitude},${emergency.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            <MapPin className="h-3 w-3" />
                            View on map
                          </a>
                        ) : (
                          <span className="text-gray-400">No location</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {formatDate(emergency.createdAt, 'relative')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" icon={<Eye className="h-3 w-3" />}>Details</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
