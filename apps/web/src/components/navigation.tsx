'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Flame, LayoutDashboard, TrendingUp, User, Zap } from 'lucide-react';

import { routes } from '../lib/routes';

const navItems = [
  { href: routes.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: routes.quiz, label: 'Quiz', icon: Zap },
  { href: routes.lessons, label: 'Lessons', icon: BookOpen },
  { href: routes.progress, label: 'Progress', icon: TrendingUp },
  { href: routes.profile, label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 z-10">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PlaySharp</h1>
            <p className="text-xs text-foreground-secondary">Training Studio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-foreground-secondary hover:bg-surface-elevated hover:text-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {active ? <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-premium/20 to-premium/5 border border-premium/30 rounded-xl p-4">
          <h3 className="font-semibold text-foreground mb-1">Go Premium</h3>
          <p className="text-xs text-foreground-secondary mb-3">Unlock unlimited training</p>
          <button className="w-full py-2 px-4 bg-premium text-background rounded-lg hover:bg-premium/90 transition-all text-sm font-semibold">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-foreground-secondary'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {active ? (
                <span className="absolute -top-0.5 w-8 h-0.5 bg-primary rounded-full" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
