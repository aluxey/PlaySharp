'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { registerWithPassword } from '../../lib/auth-client';
import { buildLoginRoute, resolvePostAuthRedirect, routes } from '../../lib/routes';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = resolvePostAuthRedirect(searchParams.get('next'), routes.quiz);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await registerWithPassword({
      name: name.trim(),
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
          <h1 className="text-4xl font-bold text-foreground">Create account</h1>
          <p className="text-foreground-secondary">
            Create your account, start the first quiz immediately, and let the app switch into the
            signed-in state without extra steps.
          </p>
          <div className="space-y-3 text-sm text-foreground-secondary">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary" /> Registration writes a live
              session right away.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary" /> Your profile, progress, and
              dashboard become available after account creation.
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-success" /> The first quiz is the fastest way
              to start generating data.
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
              href={buildLoginRoute(searchParams.get('next'))}
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-8 space-y-6 shadow-lg shadow-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground-secondary">Fast start</p>
              <h2 className="text-2xl font-semibold text-foreground">
                Build your training profile
              </h2>
            </div>
            <span className="px-3 py-1 rounded-lg border border-border text-xs text-foreground-secondary">
              Live API
            </span>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block text-sm font-medium text-foreground">
              <span>Display name</span>
              <input
                type="text"
                placeholder="PlaySharp learner"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
                autoComplete="name"
                required
              />
            </label>
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
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:border-primary"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            {errorMessage ? (
              <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                {errorMessage}
              </div>
            ) : null}
            <div className="flex items-center justify-between text-sm gap-4">
              <Link className="text-primary" href={buildLoginRoute(searchParams.get('next'))}>
                Already have an account?
              </Link>
              <button
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
