'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';

import { registerWithPassword } from '../../lib/auth-client';
import { useAuth, useToast } from '../../components';
import { buildLoginRoute, resolvePostAuthRedirect, routes } from '../../lib/routes';
import { AuthLayout } from './auth-layout';
import { AuthSocialButtons } from './auth-social-buttons';
import { getRegisterErrorToast } from './auth-toast';
import {
  validateDisplayName,
  validateEmailAddress,
  validateRegisterPassword,
} from './auth-validation';

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
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    password: false,
  });
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.quiz);
  const nameError = validateDisplayName(name);
  const emailError = validateEmailAddress(email);
  const passwordError = validateRegisterPassword(password);
  const visibleNameError = (touchedFields.name || hasSubmitted) && nameError ? nameError : null;
  const visibleEmailError = (touchedFields.email || hasSubmitted) && emailError ? emailError : null;
  const visiblePasswordError =
    (touchedFields.password || hasSubmitted) && passwordError ? passwordError : null;
  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    !nameError &&
    !emailError &&
    !passwordError;

  function fieldClassName(hasError: boolean, hasTrailingButton = false) {
    return `auth-input w-full rounded-2xl border bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 transition-[border-color,box-shadow,background-color] focus:outline-none ${
      hasError
        ? 'border-error/60 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
        : 'border-white/10 focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.16),0_0_24px_rgba(59,130,246,0.16)]'
    } ${hasTrailingButton ? 'pr-12' : ''}`;
  }

  function handleNameChange(nextName: string) {
    setName(nextName);
    setErrorMessage(null);
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
    setTouchedFields({
      name: true,
      email: true,
      password: true,
    });
    setErrorMessage(null);

    if (nameError || emailError || passwordError) {
      return;
    }

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
    <AuthLayout
      activeTab="register"
      nextPath={nextPath}
      formEyebrow="New member"
      formTitle="Build your training profile"
      formDescription="Set up your account and move straight into the first performance rep."
      helper={
        <>
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>No second step. Account creation also signs you in.</span>
        </>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            Already have an account?{' '}
            <Link
              className="font-medium text-sky-300 transition-colors hover:text-white"
              href={buildLoginRoute(nextPath)}
            >
              Log in
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
          <label className="block text-sm font-medium text-white" htmlFor="register-name">
            Display name
          </label>
          <input
            id="register-name"
            type="text"
            placeholder="PlaySharp learner"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            onBlur={() =>
              setTouchedFields((current) => ({
                ...current,
                name: true,
              }))
            }
            className={fieldClassName(Boolean(visibleNameError))}
            autoComplete="name"
            aria-invalid={visibleNameError ? 'true' : 'false'}
            aria-describedby={visibleNameError ? 'register-name-error' : undefined}
            required
          />
          {visibleNameError ? (
            <p id="register-name-error" className="text-sm text-error">
              {visibleNameError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
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
            aria-describedby={visibleEmailError ? 'register-email-error' : undefined}
            required
          />
          {visibleEmailError ? (
            <p id="register-email-error" className="text-sm text-error">
              {visibleEmailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white" htmlFor="register-password">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              onBlur={() =>
                setTouchedFields((current) => ({
                  ...current,
                  password: true,
                }))
              }
              className={fieldClassName(Boolean(visiblePasswordError), true)}
              autoComplete="new-password"
              aria-invalid={visiblePasswordError ? 'true' : 'false'}
              aria-describedby={visiblePasswordError ? 'register-password-error' : undefined}
              minLength={8}
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
            <p id="register-password-error" className="text-sm text-error">
              {visiblePasswordError}
            </p>
          ) : null}
        </div>

        {isFormValid ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-2 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" />
            All fields look ready.
          </div>
        ) : null}

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
            {isSubmitting ? 'Creating account...' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <AuthSocialButtons contextLabel="register" />
      </form>
    </AuthLayout>
  );
}
