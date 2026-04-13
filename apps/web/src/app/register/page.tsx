import { redirect } from 'next/navigation';

import { RegisterForm } from '../../features/auth/register-form';
import { getAuthState } from '../../lib/auth-state';
import { routes } from '../../lib/routes';

export default async function RegisterPage() {
  const authState = await getAuthState();

  if (authState.isAuthenticated) {
    redirect(routes.dashboard);
  }

  return <RegisterForm />;
}
