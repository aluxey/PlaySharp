import { redirect } from 'next/navigation';

import { LoginForm } from '../../features/auth/login-form';
import { getAuthState } from '../../lib/auth-state';
import { normalizeAuthRedirectPath, resolvePostAuthRedirect, routes } from '../../lib/routes';

type LoginPageProps = {
  searchParams: Promise<{
    next?: string | ReadonlyArray<string>;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeAuthRedirectPath(
    typeof resolvedSearchParams.next === 'string' ? resolvedSearchParams.next : null,
  );
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(resolvePostAuthRedirect(nextPath, routes.dashboard));
  }

  return <LoginForm nextPath={nextPath} />;
}
