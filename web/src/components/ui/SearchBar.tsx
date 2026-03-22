'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
}

const sizeClasses = {
  sm: 'py-2 pl-9 pr-8 text-sm',
  md: 'py-2.5 pl-10 pr-9 text-sm',
  lg: 'py-3.5 pl-12 pr-10 text-base',
};

const iconSizes = {
  sm: 'h-4 w-4 left-2.5',
  md: 'h-4 w-4 left-3',
  lg: 'h-5 w-5 left-3.5',
};

export function SearchBar({
  value: externalValue,
  onSearch,
  placeholder = 'Search...',
  className,
  debounceMs = 300,
  size = 'md',
  autoFocus = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(externalValue || '');
  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    if (externalValue !== undefined) {
      setInputValue(externalValue);
    }
  }, [externalValue]);

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute top-1/2 -translate-y-1/2 text-gray-400',
          iconSizes[size]
        )}
      />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
          'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
          'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500',
          'transition-all duration-200',
          sizeClasses[size]
        )}
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
