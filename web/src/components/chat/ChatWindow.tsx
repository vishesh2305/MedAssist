'use client';

import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: string;
  roomName?: string;
  isTyping?: boolean;
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatWindow({
  messages,
  currentUserId,
  roomName,
  isTyping,
  onSendMessage,
  onTyping,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      {roomName && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{roomName}</h3>
          {isTyping && (
            <p className="text-xs text-primary-600 dark:text-primary-400 animate-pulse">
              typing...
            </p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-12 w-12" />}
            title="No messages yet"
            description="Start the conversation by sending a message below."
          />
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isMine={message.senderId === currentUserId}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={onSendMessage} onTyping={onTyping} />
    </div>
  );
}
