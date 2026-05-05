'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';

import { useToast } from '../../components';
import { buildLoginRoute, buildRegisterRoute, routes } from '../../lib/routes';
import { AuthLayout } from './auth-layout';
import { validateEmailAddress } from './auth-validation';

type ForgotPasswordFormProps = {
  nextPath: string | null;
};

export function ForgotPasswordForm({ nextPath }: ForgotPasswordFormProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const emailError = validateEmailAddress(email);
  const visibleEmailError = (isTouched || hasSubmitted) && emailError ? emailError : null;
  const inputClassName = `auth-input w-full rounded-2xl border bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 transition-[border-color,box-shadow,background-color] focus:outline-none ${
    visibleEmailError
      ? 'border-error/60 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
      : 'border-white/10 focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.16),0_0_24px_rgba(59,130,246,0.16)]'
  }`;

  function handleEmailChange(nextEmail: string) {
    setEmail(nextEmail);
    setErrorMessage(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setHasSubmitted(true);
    setErrorMessage(null);

    if (emailError) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setSubmittedEmail(normalizedEmail);
    showToast({
      title: 'Reset flow placeholder',
      description: `A future reset link would be sent to ${normalizedEmail}.`,
      tone: 'success',
    });
  }

  return (
    <AuthLayout
      activeTab="login"
      nextPath={nextPath}
      formEyebrow="Recovery access"
      formTitle="Recover access"
      formDescription="Enter the account email and PlaySharp will guide you through the current recovery placeholder flow."
      helper={
        <>
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          <span>Placeholder flow. Reset email delivery is not live yet.</span>
        </>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            Remembered it?{' '}
            <Link
              className="font-medium text-sky-300 transition-colors hover:text-white"
              href={buildLoginRoute(nextPath)}
            >
              Back to login
            </Link>
          </p>
          <Link
            className="font-medium text-slate-400 transition-colors hover:text-white"
            href={routes.home}
          >
            Back home
          </Link>
        </div>
      }
    >
      {submittedEmail ? (
        <div className="space-y-4 rounded-[1.5rem] border border-success/25 bg-success/10 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div className="space-y-2">
              <p className="font-semibold text-white">Recovery request captured</p>
              <p className="text-sm leading-relaxed text-slate-200/80">
                In the full version, PlaySharp would send a reset link to{' '}
                <span className="font-medium text-white">{submittedEmail}</span>. For now this page
                confirms the request and keeps the user in a clear path back to sign-in.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="auth-cta relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(59,130,246,0.32)]"
              href={buildLoginRoute(nextPath)}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                Return to login
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              type="button"
              onClick={() => {
                setSubmittedEmail(null);
                setHasSubmitted(false);
              }}
            >
              Try another email
            </button>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white" htmlFor="forgot-password-email">
              Email
            </label>
            <input
              id="forgot-password-email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              onBlur={() => setIsTouched(true)}
              className={inputClassName}
              autoComplete="email"
              aria-invalid={visibleEmailError ? 'true' : 'false'}
              aria-describedby={visibleEmailError ? 'forgot-password-email-error' : undefined}
              required
            />
            {visibleEmailError ? (
              <p id="forgot-password-email-error" className="text-sm text-error">
                {visibleEmailError}
              </p>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                Use the same email tied to your PlaySharp account.
              </p>
            )}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {errorMessage}
            </div>
          ) : null}

          <button
            className="auth-cta relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#3B82F6] px-5 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(59,130,246,0.32)]"
            type="submit"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Continue placeholder flow
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
            <Mail className="h-3.5 w-3.5" />
            <span>We are styling the recovery experience before wiring the reset backend.</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
            <p>
              Need a new account?{' '}
              <Link
                className="font-medium text-sky-300 transition-colors hover:text-white"
                href={buildRegisterRoute(nextPath)}
              >
                Register
              </Link>
            </p>
            <Link
              className="font-medium text-slate-400 transition-colors hover:text-white"
              href={buildLoginRoute(nextPath)}
            >
              Back to login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
