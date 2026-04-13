import { redirect } from 'next/navigation';

import { RegisterForm } from '../../features/auth/register-form';
import { getAuthState } from '../../lib/auth-state';
import { normalizeAuthRedirectPath, resolvePostAuthRedirect, routes } from '../../lib/routes';

type RegisterPageProps = {
  searchParams: Promise<{
    next?: string | ReadonlyArray<string>;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeAuthRedirectPath(
    typeof resolvedSearchParams.next === 'string' ? resolvedSearchParams.next : null,
  );
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(resolvePostAuthRedirect(nextPath, routes.dashboard));
  }

  return <RegisterForm nextPath={nextPath} />;
}
