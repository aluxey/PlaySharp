'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import type { AuthUser } from '@playsharp/shared';

import { routes } from '../lib/routes';
import { AnimatedBackground } from './animated-background';
import { MobileNav, PublicHeader, PublicMobileNav, Sidebar } from './navigation';

type AppShellProps = {
  children: ReactNode;
  user: AuthUser | null;
};

export function AppShell({ children, user }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === routes.login || pathname === routes.register;

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
        <main className="relative z-10">{children}</main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AnimatedBackground />
        <PublicHeader />
        <main className="relative z-10 pb-20">{children}</main>
        <PublicMobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AnimatedBackground />
      <Sidebar user={user} />
      <main className="flex-1 pb-20 lg:pb-0 relative z-10">{children}</main>
      <MobileNav user={user} />
    </div>
  );
}
