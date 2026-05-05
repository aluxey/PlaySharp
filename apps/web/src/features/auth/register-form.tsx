'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
  const { setAuthenticatedUser } = useAuth();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    terms: false,
  });
  const postAuthRedirect = resolvePostAuthRedirect(nextPath, routes.home);
  const normalizedFirstName = firstName.trim();
  const normalizedLastName = lastName.trim();
  const name = `${normalizedFirstName} ${normalizedLastName}`.trim();
  const nameError = validateDisplayName(name);
  const firstNameError = normalizedFirstName.length === 0 ? 'Enter your first name.' : null;
  const lastNameError = normalizedLastName.length === 0 ? 'Enter your last name.' : null;
  const emailError = validateEmailAddress(email);
  const passwordError = validateRegisterPassword(password);
  const visibleFirstNameError =
    (touchedFields.firstName || hasSubmitted) && firstNameError ? firstNameError : null;
  const visibleLastNameError =
    (touchedFields.lastName || hasSubmitted) && lastNameError ? lastNameError : null;
  const visibleEmailError = (touchedFields.email || hasSubmitted) && emailError ? emailError : null;
  const visiblePasswordError =
    (touchedFields.password || hasSubmitted) && passwordError ? passwordError : null;
  const visibleTermsError =
    (touchedFields.terms || hasSubmitted) && !hasAcceptedTerms
      ? 'Accept the terms to create your account.'
      : null;
  const isFormValid =
    normalizedFirstName.length > 0 &&
    normalizedLastName.length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    !nameError &&
    !emailError &&
    !passwordError &&
    hasAcceptedTerms;

  function fieldClassName(hasError: boolean, hasTrailingButton = false) {
    return `auth-input w-full rounded-xl border bg-[#26282f] px-4 py-3 text-base text-white placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] focus:outline-none ${
      hasError
        ? 'border-error/70 focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
        : 'border-[#464b5f] focus:border-[#5a6fff] focus:shadow-[0_0_0_3px_rgba(90,111,255,0.2)]'
    } ${hasTrailingButton ? 'pr-12' : ''}`;
  }

  function handleFirstNameChange(nextName: string) {
    setFirstName(nextName);
    setErrorMessage(null);
  }

  function handleLastNameChange(nextName: string) {
    setLastName(nextName);
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
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      terms: true,
    });
    setErrorMessage(null);

    if (nameError || emailError || passwordError || !hasAcceptedTerms) {
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
    window.location.assign(postAuthRedirect);
  }

  return (
    <AuthLayout
      activeTab="register"
      nextPath={nextPath}
      formEyebrow="New member"
      formTitle="Create account"
      formDescription="Already have an account?"
      helper={
        <>
          <Link
            className="font-medium text-[#6a87ff] transition-colors hover:text-white"
            href={buildLoginRoute(nextPath)}
          >
            Log in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
              htmlFor="register-first-name"
            >
              First name
            </label>
            <input
              id="register-first-name"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(event) => handleFirstNameChange(event.target.value)}
              onBlur={() =>
                setTouchedFields((current) => ({
                  ...current,
                  firstName: true,
                }))
              }
              className={fieldClassName(Boolean(visibleFirstNameError || nameError))}
              autoComplete="given-name"
              aria-invalid={visibleFirstNameError ? 'true' : 'false'}
              aria-describedby={visibleFirstNameError ? 'register-first-name-error' : undefined}
              required
            />
            {visibleFirstNameError ? (
              <p id="register-first-name-error" className="text-sm text-error">
                {visibleFirstNameError}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
              htmlFor="register-last-name"
            >
              Last name
            </label>
            <input
              id="register-last-name"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(event) => handleLastNameChange(event.target.value)}
              onBlur={() =>
                setTouchedFields((current) => ({
                  ...current,
                  lastName: true,
                }))
              }
              className={fieldClassName(Boolean(visibleLastNameError || nameError))}
              autoComplete="family-name"
              aria-invalid={visibleLastNameError ? 'true' : 'false'}
              aria-describedby={visibleLastNameError ? 'register-last-name-error' : undefined}
              required
            />
            {visibleLastNameError ? (
              <p id="register-last-name-error" className="text-sm text-error">
                {visibleLastNameError}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
            htmlFor="register-email"
          >
            Email
          </label>
          <input
            id="register-email"
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
          <label
            className="block text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
            htmlFor="register-password"
          >
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
              className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-4 text-slate-500 transition-colors hover:text-slate-200"
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

        <div className="space-y-2">
          <label className="inline-flex items-start gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={hasAcceptedTerms}
              onChange={(event) => {
                setHasAcceptedTerms(event.target.checked);
                setTouchedFields((current) => ({
                  ...current,
                  terms: true,
                }));
              }}
              className="mt-1 h-4 w-4 rounded border-[#4a5165] bg-[#26282f] text-[#5a6fff] focus:ring-[#5a6fff]"
            />
            <span>
              I agree to the{' '}
              <Link
                className="text-[#6a87ff] transition-colors hover:text-white"
                href={routes.home}
              >
                Terms & Conditions
              </Link>
            </span>
          </label>
          {visibleTermsError ? <p className="text-sm text-error">{visibleTermsError}</p> : null}
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
            {errorMessage}
          </div>
        ) : null}

        <button
          className="inline-flex w-full items-center justify-center rounded-xl border border-[#4a5165] bg-transparent px-5 py-3.5 text-xl font-medium text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <AuthSocialButtons contextLabel="register" />
      </form>
    </AuthLayout>
  );
}
