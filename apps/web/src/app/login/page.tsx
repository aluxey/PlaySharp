import { redirect } from 'next/navigation';

import { LoginForm } from '../../features/auth/login-form';
import { getAuthState } from '../../lib/auth-state';
import { routes } from '../../lib/routes';

export default async function LoginPage() {
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(routes.dashboard);
  }

  return <LoginForm />;
}
