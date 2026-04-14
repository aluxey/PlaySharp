'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';

import { loginWithPassword } from '../../lib/auth-client';
import { useAuth, useToast } from '../../components';
import { buildRegisterRoute, resolvePostAuthRedirect, routes } from '../../lib/routes';
import { getLoginErrorToast } from './auth-toast';

type LoginFormProps = {
  nextPath: string | null;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.dashboard);
  const sessionSignals = [
    {
      label: 'Protected progress',
      description: 'Restore dashboard, streaks, quiz history, and member navigation instantly.',
      icon: ShieldCheck,
    },
    {
      label: 'Coach continuity',
      description: 'Jump back into the next lesson or recommendation instead of restarting cold.',
      icon: TrendingUp,
    },
    {
      label: 'Fast resume',
      description: 'One sign-in restores the exact flow you were trying to reach.',
      icon: Zap,
    },
  ] as const;
  const recoveryStats = [
    { value: '1 click', label: 'to restore the session' },
    { value: 'Live', label: 'cookie-backed auth state' },
    { value: '0 reset', label: 'to keep your progress context' },
  ] as const;
  const fieldClassName =
    'w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-foreground placeholder:text-foreground-secondary focus:border-primary focus:outline-none';

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
      const toast = getLoginErrorToast(result.error);
      showToast({
        title: toast.title,
        description: toast.description,
        tone: 'error',
      });
      setErrorMessage(result.error.message);
      setIsSubmitting(false);
      return;
    }

    if (!result.data) {
      setErrorMessage('The session could not be created. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setAuthenticatedUser(result.data.user);
    showToast({
      title: 'Signed in',
      description: `Welcome back ${result.data.user.email}. Your account is ready.`,
      tone: 'success',
    });
    router.replace(postAuthRedirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-surface-elevated via-surface to-background p-6 md:p-8 lg:p-10 shadow-2xl shadow-primary/10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-primary/15 via-secondary/10 to-transparent blur-3xl" />
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              Returning member access
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
                  Authentication
                </p>
                <h1 className="max-w-xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  Log in and pick up exactly where your training left off.
                </h1>
                <p className="max-w-2xl text-base text-foreground-secondary md:text-lg">
                  Sign in to restore your dashboard, progress trends, quiz history, and the next
                  route you were trying to reach.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {recoveryStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-background/60 p-4"
                  >
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-foreground-secondary">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {nextPath ? (
              <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-foreground-secondary">
                <p className="font-medium text-foreground">Next stop after sign-in</p>
                <p className="mt-1 font-mono text-xs text-secondary">{postAuthRedirect}</p>
              </div>
            ) : null}

            <div className="space-y-4">
              {sessionSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="flex gap-4 rounded-2xl border border-border bg-background/50 p-4"
                  >
                    <div className="mt-0.5 rounded-2xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{signal.label}</p>
                      <p className="text-sm leading-relaxed text-foreground-secondary">
                        {signal.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
                href={routes.home}
              >
                Back home
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-border px-5 py-3 font-semibold text-foreground"
                href={buildRegisterRoute(nextPath)}
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-surface-elevated/95 p-6 shadow-2xl shadow-primary/10 md:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Secure access
                </p>
                <h2 className="text-3xl font-semibold text-foreground">Welcome back</h2>
                <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
                  Use the same account to restore your saved progress and member navigation without
                  any extra setup.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live session
              </span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClassName}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-foreground">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClassName}
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-start gap-3 text-sm text-foreground-secondary">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <p>
                    After sign-in, PlaySharp restores your member navigation and sends you to{' '}
                    <span className="font-medium text-foreground">{postAuthRedirect}</span>.
                  </p>
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
                  {errorMessage}
                </div>
              ) : null}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition-opacity disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link className="font-medium text-primary" href={buildRegisterRoute(nextPath)}>
                  Need an account?
                </Link>
                <p className="text-foreground-secondary">
                  Session cookies stay on this device only.
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
