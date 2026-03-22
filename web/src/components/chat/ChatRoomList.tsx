'use client';

import React from 'react';
import type { ChatRoom } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate, truncate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId?: string | null;
  onSelectRoom: (roomId: string) => void;
  isLoading?: boolean;
}

export function ChatRoomList({ rooms, activeRoomId, onSelectRoom, isLoading }: ChatRoomListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-10 w-10" />}
        title="No conversations"
        description="Start chatting with a hospital from their profile page."
      />
    );
  }

  return (
    <div className="overflow-y-auto">
      {rooms.map((room) => {
        const isActive = room.id === activeRoomId;
        const displayName = room.name
          || (room.hospital ? (typeof room.hospital === 'object' ? room.hospital.name : 'Hospital') : 'Chat Room');

        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            )}
          >
            <Avatar
              name={displayName}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {displayName}
                </span>
                {room.messages?.[0] && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {formatDate(room.messages[0].createdAt, 'relative')}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {room.messages?.[0]
                    ? truncate(room.messages[0].content, 40)
                    : 'No messages yet'}
                </p>
                {(room.messages?.filter(m => !m.isRead).length ?? 0) > 0 && (
                  <span className="h-5 min-w-[20px] rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center px-1.5 flex-shrink-0">
                    {room.messages?.filter(m => !m.isRead).length ?? 0}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
