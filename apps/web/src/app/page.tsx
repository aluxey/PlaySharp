import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Zap } from 'lucide-react';

import { getAuthState } from '../lib/auth-state';
import { routes } from '../lib/routes';

export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(routes.dashboard);
  }

  return (
    <div className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-2 text-sm text-foreground-secondary">
              <Sparkles className="w-4 h-4 text-primary" />
              Study spots, track streaks, and train with live progress signals.
            </p>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Learn faster when the app remembers your game.
              </h1>
              <p className="max-w-2xl text-lg text-foreground-secondary">
                Register once, stay signed in, and let PlaySharp carry your quiz history, dashboard,
                profile, and progress across the site.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold"
                href={routes.register}
              >
                Create account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border text-foreground font-semibold"
                href={routes.login}
              >
                Log in
              </Link>
              <Link
                className="px-5 py-3 rounded-2xl text-foreground-secondary"
                href={routes.lessons}
              >
                Browse lessons
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-surface-elevated p-6 md:p-8 shadow-2xl shadow-primary/10">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-foreground">Persistent auth state</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Secure cookie-backed sessions keep member pages, profile data, and navigation in
                  sync after login or registration.
                </p>
              </div>
              <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <p className="font-semibold text-foreground">Quick start quiz flow</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  New accounts can jump straight into a quiz so the dashboard has real signals from
                  the first session.
                </p>
              </div>
              <div className="rounded-2xl border border-warning/20 bg-warning/10 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-warning" />
                  <p className="font-semibold text-foreground">Guest-friendly browsing</p>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Logged-out visitors can browse the site without seeing member-only navigation or
                  profile-only states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
