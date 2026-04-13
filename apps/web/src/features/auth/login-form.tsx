'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginWithPassword } from '../../lib/auth-client';
import { buildRegisterRoute, resolvePostAuthRedirect, routes } from '../../lib/routes';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = resolvePostAuthRedirect(searchParams.get('next'), routes.dashboard);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await loginWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (result.error) {
      setErrorMessage(result.error.message);
      setIsSubmitting(false);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
            Authentication
          </p>
          <h1 className="text-4xl font-bold text-foreground">Log in</h1>
          <p className="text-foreground-secondary">
            Sign in to restore your dashboard, streaks, and saved quiz history.
          </p>
          <div className="space-y-3 text-sm text-foreground-secondary">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Session state is stored in a
              secure cookie.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Your dashboard and profile
              unlock automatically after sign-in.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-success" /> Registration remains one click
              away if you do not have an account yet.
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
              href={buildRegisterRoute(searchParams.get('next'))}
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
              Live API
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block text-sm font-medium text-foreground">
              <span>Email</span>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
                autoComplete="email"
                required
              />
            </label>
            <label className="space-y-2 block text-sm font-medium text-foreground">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
                autoComplete="current-password"
                required
              />
            </label>
            {errorMessage ? (
              <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                {errorMessage}
              </div>
            ) : null}
            <div className="flex items-center justify-between text-sm gap-4">
              <Link className="text-primary" href={buildRegisterRoute(searchParams.get('next'))}>
                Need an account?
              </Link>
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
