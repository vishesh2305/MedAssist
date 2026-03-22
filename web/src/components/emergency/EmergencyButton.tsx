'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmergencyButtonProps {
  onPress: () => void;
  size?: 'sm' | 'lg';
  disabled?: boolean;
}

export function EmergencyButton({ onPress, size = 'lg', disabled }: EmergencyButtonProps) {
  const isLarge = size === 'lg';

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Ripple animations */}
      {!disabled && (
        <>
          <span className={`absolute rounded-full bg-red-500/20 animate-ripple ${isLarge ? 'h-44 w-44' : 'h-24 w-24'}`} />
          <span className={`absolute rounded-full bg-red-500/15 animate-ripple ${isLarge ? 'h-44 w-44' : 'h-24 w-24'}`} style={{ animationDelay: '0.5s' }} />
          <span className={`absolute rounded-full bg-red-500/10 animate-ripple ${isLarge ? 'h-44 w-44' : 'h-24 w-24'}`} style={{ animationDelay: '1s' }} />
        </>
      )}

      <motion.button
        onClick={onPress}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className={`relative z-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30 flex flex-col items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          isLarge ? 'h-40 w-40' : 'h-20 w-20'
        }`}
      >
        <AlertTriangle className={isLarge ? 'h-10 w-10' : 'h-6 w-6'} />
        <span className={`font-bold ${isLarge ? 'text-xl' : 'text-xs'}`}>SOS</span>
        {isLarge && (
          <span className="text-xs text-red-100">Tap for emergency</span>
        )}
      </motion.button>
    </div>
  );
}
