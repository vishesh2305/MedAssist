'use client';

import React, { useState } from 'react';
import type { ChatMessage } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { Check, CheckCheck, Globe } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function ChatBubble({ message, isMine }: ChatBubbleProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  if (message.messageType === 'SYSTEM' || message.senderRole === 'SYSTEM') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex mb-3', isMine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 relative',
          isMine
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {showTranslation && message.translatedContent
            ? message.translatedContent
            : message.content}
        </p>

        <div
          className={cn(
            'flex items-center gap-1.5 mt-1',
            isMine ? 'justify-end' : 'justify-start'
          )}
        >
          {message.translatedContent && (
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn(
                'transition-colors',
                isMine
                  ? 'text-white/60 hover:text-white/80'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Globe className="h-3 w-3" />
            </button>
          )}
          <span
            className={cn(
              'text-[10px]',
              isMine ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
            )}
          >
            {formatDate(message.createdAt, 'relative')}
          </span>
          {isMine && (
            <span className={cn('text-white/60')}>
              {message.isRead ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
