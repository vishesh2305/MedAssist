'use client';

import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4 py-12">
      <ForgotPasswordForm />
    </div>
  );
}
