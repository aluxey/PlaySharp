'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';

import { registerWithPassword } from '../../lib/auth-client';
import { useAuth, useToast } from '../../components';
import { buildLoginRoute, resolvePostAuthRedirect, routes } from '../../lib/routes';
import { getRegisterErrorToast } from './auth-toast';

type RegisterFormProps = {
  nextPath: string | null;
};

export function RegisterForm({ nextPath }: RegisterFormProps) {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.quiz);
  const onboardingSignals = [
    {
      label: 'Session starts immediately',
      description:
        'Account creation also creates the live session, so there is no second login step.',
      icon: ShieldCheck,
    },
    {
      label: 'First quiz fast',
      description:
        'The first redirect lands you inside the training loop instead of a blank profile page.',
      icon: Target,
    },
    {
      label: 'Progress begins now',
      description:
        'Your profile, quiz history, and recommendations start filling in from the first attempt.',
      icon: TrendingUp,
    },
  ] as const;
  const launchStats = [
    { value: '1 account', label: 'to unlock the full V1 loop' },
    { value: 'Quiz first', label: 'redirect after sign-up' },
    { value: 'Live', label: 'session and cookie handoff' },
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

    const result = await registerWithPassword({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (result.error) {
      const toast = getRegisterErrorToast(result.error);
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
      title: 'Account created',
      description: `Your profile is ready, ${result.data.user.email}. Redirecting you into PlaySharp now.`,
      tone: 'success',
    });
    router.replace(postAuthRedirect);
    router.refresh();
  }

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-secondary/20 bg-gradient-to-br from-surface-elevated via-surface to-background p-6 md:p-8 lg:p-10 shadow-2xl shadow-secondary/10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-secondary/20 via-primary/10 to-transparent blur-3xl" />
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-4 py-2 text-sm text-secondary">
              <Sparkles className="h-4 w-4" />
              Fast start onboarding
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">
                  Authentication
                </p>
                <h1 className="max-w-xl text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  Create your account and drop straight into the training loop.
                </h1>
                <p className="max-w-2xl text-base text-foreground-secondary md:text-lg">
                  Sign up once, write the session immediately, and let the app send you into the
                  first meaningful action instead of a blank shell.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {launchStats.map((stat) => (
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
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground-secondary">
                <p className="font-medium text-foreground">Destination after sign-up</p>
                <p className="mt-1 font-mono text-xs text-primary">{postAuthRedirect}</p>
              </div>
            ) : null}

            <div className="space-y-4">
              {onboardingSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div
                    key={signal.label}
                    className="flex gap-4 rounded-2xl border border-border bg-background/50 p-4"
                  >
                    <div className="mt-0.5 rounded-2xl border border-secondary/20 bg-secondary/10 p-2.5 text-secondary">
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
                href={buildLoginRoute(nextPath)}
              >
                Log in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-surface-elevated/95 p-6 shadow-2xl shadow-secondary/10 md:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-secondary">
                  Fast start
                </p>
                <h2 className="text-3xl font-semibold text-foreground">
                  Build your training profile
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-foreground-secondary">
                  Your account becomes your entry point for quizzes, lessons, progress, and
                  route-aware member state.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live session
              </span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-foreground">
                <span>Display name</span>
                <input
                  type="text"
                  placeholder="PlaySharp learner"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={fieldClassName}
                  autoComplete="name"
                  required
                />
              </label>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClassName}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-start gap-3 text-sm text-foreground-secondary">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>
                    After sign-up, PlaySharp creates the session right away and sends you to{' '}
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
                {isSubmitting ? 'Creating account...' : 'Create account'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link className="font-medium text-primary" href={buildLoginRoute(nextPath)}>
                  Already have an account?
                </Link>
                <p className="text-foreground-secondary">
                  Use at least 8 characters for the password.
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
