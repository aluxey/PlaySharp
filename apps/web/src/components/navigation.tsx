'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Flame,
  House,
  LayoutDashboard,
  LogIn,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';

import type { AuthUser } from '@playsharp/shared';

import { LogoutButton } from './logout-button';
import { appNavItems, authNavItems, publicNavItems, routes } from '../lib/routes';

const appNavIcons = {
  Dashboard: LayoutDashboard,
  Quiz: Zap,
  Lessons: BookOpen,
  Progress: TrendingUp,
  Profile: User,
} as const;

const publicNavIcons = {
  Home: House,
  Lessons: BookOpen,
  Quiz: Zap,
} as const;

const authNavIcons = {
  'Log in': LogIn,
  Register: UserPlus,
} as const;

type SidebarProps = {
  user: AuthUser;
};

function initialsFromEmail(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const navItems =
    user.role === 'admin' ? [...appNavItems, { label: 'Admin', href: routes.admin }] : appNavItems;

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
          const Icon =
            item.label === 'Admin' ? Shield : appNavIcons[item.label as keyof typeof appNavIcons];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

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

      <div className="p-4 border-t border-border space-y-4">
        <div className="rounded-2xl border border-border bg-surface-elevated p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
              {initialsFromEmail(user.email)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{user.email}</p>
              <p className="text-xs text-foreground-secondary capitalize">
                {user.plan} plan · {user.role}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>

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

type MobileNavProps = {
  user: AuthUser;
};

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  const navItems =
    user.role === 'admin'
      ? [...appNavItems.slice(0, 4), { label: 'Admin', href: routes.admin }]
      : appNavItems;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon =
            item.label === 'Admin' ? Shield : appNavIcons[item.label as keyof typeof appNavIcons];

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

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href={routes.home}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-foreground">PlaySharp</p>
            <p className="text-xs text-foreground-secondary">Training Studio</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2" aria-label="Public navigation">
          {publicNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-surface-elevated text-foreground'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-surface'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            className="px-4 py-2 rounded-xl border border-border text-foreground"
            href={routes.login}
          >
            Log in
          </Link>
          <Link
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
            href={routes.register}
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PublicMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50"
      aria-label="Public mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-3">
        {[...publicNavItems, ...authNavItems].map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon =
            publicNavIcons[item.label as keyof typeof publicNavIcons] ??
            authNavIcons[item.label as keyof typeof authNavIcons] ??
            Sparkles;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-foreground-secondary'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{item.label}</span>
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
