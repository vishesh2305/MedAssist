'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4 py-12">
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
