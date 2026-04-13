import 'server-only';

import type { AuthUser } from '@playsharp/shared';

import { getCurrentAuthUser } from './api';

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

export async function getAuthState(): Promise<AuthState> {
  const currentUser = await getCurrentAuthUser();

  return {
    isAuthenticated: Boolean(currentUser.data),
    user: currentUser.data,
  };
}
