'use client';

import React from 'react';
import type { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { MapPin, Mail, Globe, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProfileCardProps {
  user: User;
  className?: string;
}

const roleLabelMap: Record<string, string> = {
  USER: 'Traveler',
  HOSPITAL_ADMIN: 'Hospital Admin',
  SUPER_ADMIN: 'Admin',
};

export function ProfileCard({ user, className }: ProfileCardProps) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';

  return (
    <Card className={className}>
      <CardContent className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar src={user.avatarUrl} name={fullName} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
            {user.emailVerified && (
              <Badge variant="success" size="sm">Verified</Badge>
            )}
            <Badge variant="info" size="sm">{roleLabelMap[user.role] || user.role}</Badge>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            {user.nationality && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Globe className="h-4 w-4" />
                {user.nationality}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(user.createdAt)}
            </div>
          </div>

          {user.preferredLanguage && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <Badge variant="default" size="sm">{user.preferredLanguage}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
