'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { routes } from '../lib/routes';
import { AnimatedBackground } from './animated-background';
import { useAuth } from './auth-provider';
import { MobileNav, PublicHeader, PublicMobileNav, Sidebar } from './navigation';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthPage =
    pathname === routes.login || pathname === routes.register || pathname === routes.forgotPassword;

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <div className="lg:hidden">
        <PublicHeader user={user} />
      </div>
      <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">
        <Sidebar user={user} />
        <main className="flex-1 pb-20 lg:pb-0 relative z-10">{children}</main>
      </div>
      <MobileNav user={user} />
    </div>
  );
}
