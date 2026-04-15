'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { loginWithPassword } from '../../lib/auth-client';
import { useAuth, useToast } from '../../components';
import {
  buildForgotPasswordRoute,
  buildRegisterRoute,
  resolvePostAuthRedirect,
  routes,
} from '../../lib/routes';
import { AuthLayout } from './auth-layout';
import { AuthSocialButtons } from './auth-social-buttons';
import { getLoginErrorToast } from './auth-toast';
import { validateEmailAddress, validateLoginPassword } from './auth-validation';

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
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.dashboard);
  const emailError = validateEmailAddress(email);
  const passwordError = validateLoginPassword(password);
  const visibleEmailError = (touchedFields.email || hasSubmitted) && emailError ? emailError : null;
  const visiblePasswordError =
    (touchedFields.password || hasSubmitted) && passwordError ? passwordError : null;

  function fieldClassName(hasError: boolean, hasTrailingButton = false) {
    return `auth-input w-full rounded-2xl border bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 transition-[border-color,box-shadow,background-color] focus:outline-none ${
      hasError
        ? 'border-error/60 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
        : 'border-white/10 focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.16),0_0_24px_rgba(59,130,246,0.16)]'
    } ${hasTrailingButton ? 'pr-12' : ''}`;
  }

  function handleEmailChange(nextEmail: string) {
    setEmail(nextEmail);
    setErrorMessage(null);
  }

  function handlePasswordChange(nextPassword: string) {
    setPassword(nextPassword);
    setErrorMessage(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setHasSubmitted(true);
    setTouchedFields({ email: true, password: true });
    setErrorMessage(null);

    if (emailError || passwordError) {
      return;
    }

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
    <AuthLayout
      activeTab="login"
      nextPath={nextPath}
      formEyebrow="Member access"
      formTitle="Welcome back"
      formDescription="Use your email and password to jump back into PlaySharp Training Studio."
      helper={
        <>
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Secure session. Member navigation updates as soon as you sign in.</span>
        </>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            New to PlaySharp?{' '}
            <Link
              className="font-medium text-sky-300 transition-colors hover:text-white"
              href={buildRegisterRoute(nextPath)}
            >
              Create account
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="alex@example.com"
            value={email}
            onChange={(event) => handleEmailChange(event.target.value)}
            onBlur={() =>
              setTouchedFields((current) => ({
                ...current,
                email: true,
              }))
            }
            className={fieldClassName(Boolean(visibleEmailError))}
            autoComplete="email"
            aria-invalid={visibleEmailError ? 'true' : 'false'}
            aria-describedby={visibleEmailError ? 'login-email-error' : undefined}
            required
          />
          {visibleEmailError ? (
            <p id="login-email-error" className="text-sm text-error">
              {visibleEmailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="font-medium text-white" htmlFor="login-password">
              Password
            </label>
            <Link
              className="font-medium text-slate-400 transition-colors hover:text-white"
              href={buildForgotPasswordRoute(nextPath)}
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              onBlur={() =>
                setTouchedFields((current) => ({
                  ...current,
                  password: true,
                }))
              }
              className={fieldClassName(Boolean(visiblePasswordError), true)}
              autoComplete="current-password"
              aria-invalid={visiblePasswordError ? 'true' : 'false'}
              aria-describedby={visiblePasswordError ? 'login-password-error' : undefined}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-slate-400 transition-colors hover:text-white"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {visiblePasswordError ? (
            <p id="login-password-error" className="text-sm text-error">
              {visiblePasswordError}
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        <button
          className="auth-cta relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[#3B82F6] px-5 py-3.5 font-semibold text-white shadow-[0_12px_30px_rgba(59,130,246,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(59,130,246,0.32)] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <AuthSocialButtons contextLabel="login" />
      </form>
    </AuthLayout>
  );
}
