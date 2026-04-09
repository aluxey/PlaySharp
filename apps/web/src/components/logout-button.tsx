'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { routes } from '../lib/routes';

export function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      router.push(routes.login);
      router.refresh();
      setIsSubmitting(false);
    }
  }

  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 transition-all text-left text-error disabled:opacity-70"
      onClick={handleLogout}
      type="button"
      disabled={isSubmitting}
    >
      <LogOut className="w-5 h-5" />
      <span>{isSubmitting ? 'Logging out...' : 'Log Out'}</span>
    </button>
  );
}
