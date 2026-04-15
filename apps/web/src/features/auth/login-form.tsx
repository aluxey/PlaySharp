'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

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
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.home);
  const emailError = validateEmailAddress(email);
  const passwordError = validateLoginPassword(password);
  const visibleEmailError = (touchedFields.email || hasSubmitted) && emailError ? emailError : null;
  const visiblePasswordError =
    (touchedFields.password || hasSubmitted) && passwordError ? passwordError : null;

  function fieldClassName(hasError: boolean, hasTrailingButton = false) {
    return `auth-input w-full rounded-xl border bg-[#26282f] px-4 py-3 text-base text-white placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] focus:outline-none ${
      hasError
        ? 'border-error/70 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
        : 'border-[#464b5f] focus:border-[#5a6fff] focus:shadow-[0_0_0_3px_rgba(90,111,255,0.2)]'
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
      formTitle="Sign in"
      formDescription="New here?"
      helper={
        <>
          <Link
            className="font-medium text-[#6a87ff] transition-colors hover:text-white"
            href={buildRegisterRoute(nextPath)}
          >
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="Email"
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
            <label
              className="font-medium uppercase tracking-[0.14em] text-slate-500"
              htmlFor="login-password"
            >
              Password
            </label>
            <Link
              className="font-medium text-[#6a87ff] transition-colors hover:text-white"
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
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-slate-500 transition-colors hover:text-slate-200"
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
          <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-xl border border-[#4a5165] bg-transparent px-5 py-3.5 text-xl font-medium text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <AuthSocialButtons contextLabel="login" />
      </form>
    </AuthLayout>
  );
}
