'use client';

import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4 py-12">
      <SignupForm />
    </div>
  );
}
