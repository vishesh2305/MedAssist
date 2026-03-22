'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Hospital } from '@/types';
import { formatDate } from '@/lib/utils';
import { Rating } from '@/components/ui/Rating';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/admin/hospitals', { params: { search } });
        setHospitals(data.data || data.hospitals || []);
      } catch {
        setHospitals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, [search]);

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      await api.patch(`/admin/hospitals/${id}`, { isVerified: verified });
      setHospitals((prev) =>
        prev.map((h) => (h.id === id ? { ...h, isVerified: verified } : h))
      );
      toast.success(verified ? 'Hospital verified' : 'Hospital verification revoked');
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Verify and manage registered hospitals</p>
      </div>

      <SearchBar onSearch={setSearch} placeholder="Search hospitals..." className="mb-6" />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Hospital</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td className="px-6 py-4" colSpan={5}><Skeleton className="h-4 w-full" /></td></tr>
                ))
              ) : hospitals.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No hospitals found</td></tr>
              ) : (
                hospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{hospital.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{hospital.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {hospital.city}, {hospital.country}
                    </td>
                    <td className="px-6 py-4">
                      <Rating value={hospital.rating || 0} size="sm" showValue />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <Badge variant={hospital.isVerified ? 'success' : 'warning'} size="sm">
                          {hospital.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        {hospital.isEmergencyCapable && (
                          <Badge variant="danger" size="sm">Emergency</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" icon={<Eye className="h-3 w-3" />}>View</Button>
                        {!hospital.isVerified ? (
                          <Button variant="ghost" size="sm" icon={<CheckCircle className="h-3 w-3 text-green-500" />} onClick={() => handleVerify(hospital.id, true)}>
                            Verify
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" icon={<XCircle className="h-3 w-3 text-red-500" />} onClick={() => handleVerify(hospital.id, false)}>
                            Revoke
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
