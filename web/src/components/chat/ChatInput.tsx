'use client';

import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, onTyping, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const typingTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage('');
    onTyping?.(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping?.(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900',
            'focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 focus:outline-none focus:bg-white',
            'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:bg-gray-700',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'transition-colors duration-200',
            'max-h-32 scrollbar-thin'
          )}
          style={{ minHeight: '40px' }}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={cn(
            'p-2.5 rounded-xl transition-all duration-200 flex-shrink-0',
            message.trim()
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
