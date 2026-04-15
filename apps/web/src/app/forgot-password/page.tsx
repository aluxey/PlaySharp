import { redirect } from 'next/navigation';

import { ForgotPasswordForm } from '../../features/auth/forgot-password-form';
import { getAuthState } from '../../lib/auth-state';
import { normalizeAuthRedirectPath, resolvePostAuthRedirect, routes } from '../../lib/routes';

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    next?: string | ReadonlyArray<string>;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeAuthRedirectPath(
    typeof resolvedSearchParams.next === 'string' ? resolvedSearchParams.next : null,
  );
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(resolvePostAuthRedirect(nextPath, routes.dashboard));
  }

  return <ForgotPasswordForm nextPath={nextPath} />;
}
