'use client';

import Link from 'next/link';

import { routes } from '../../lib/routes';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Authentication
          </p>
          <h1 className="text-4xl font-bold text-foreground">Log in</h1>
          <p className="text-foreground-secondary">
            This is the sign-in scaffold. It should feel trustworthy, minimal, and consistent with
            the rest of the product.
          </p>
          <div className="space-y-3 text-sm text-foreground-secondary">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Security cues: clear hierarchy.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Recovery path: link to
              registration.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-success" /> Layout rule: keep it lightweight.
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
              href={routes.home}
            >
              Back home
            </Link>
            <Link
              className="px-4 py-2 rounded-xl border border-border text-foreground"
              href={routes.register}
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-8 space-y-6 shadow-lg shadow-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary">Secure access</p>
              <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
            </div>
            <span className="px-3 py-1 rounded-lg border border-border text-xs text-foreground-secondary">
              Shell only
            </span>
          </div>

          <form className="space-y-4">
            <label className="space-y-2 block text-sm font-medium text-foreground">
              <span>Email</span>
              <input
                type="email"
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
              />
            </label>
            <label className="space-y-2 block text-sm font-medium text-foreground">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
              />
            </label>
            <div className="flex items-center justify-between text-sm">
              <Link className="text-primary" href={routes.register}>
                Need an account?
              </Link>
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold"
                type="button"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
