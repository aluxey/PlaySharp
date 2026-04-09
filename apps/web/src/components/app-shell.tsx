import type { ReactNode } from 'react';

import { AnimatedBackground } from './animated-background';
import { MobileNav, Sidebar } from './navigation';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 pb-20 lg:pb-0 relative z-10">{children}</main>
      <MobileNav />
    </div>
  );
}
