'use client';

import React, { useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PricingItem {
  id: string;
  serviceName: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  description?: string;
}

interface PricingTableProps {
  pricing: PricingItem[];
  className?: string;
}

export function PricingTable({ pricing, className }: PricingTableProps) {
  const grouped = useMemo(() => {
    if (!pricing?.length) return [];
    const map = new Map<string, PricingItem[]>();
    for (const item of pricing) {
      const key = item.category || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([category, items]) => ({ category, items }));
  }, [pricing]);

  if (!grouped.length) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
        Pricing information is not yet available for this hospital.
      </p>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {grouped.map((group) => (
        <div key={group.category}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {group.category}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Service
                  </th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Price Range
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {group.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{item.serviceName}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.minPrice, item.currency)}
                      </span>
                      {item.maxPrice > item.minPrice && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {' '}- {formatCurrency(item.maxPrice, item.currency)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
