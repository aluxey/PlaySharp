import type { ApiErrorResponse } from '@playsharp/shared';

type AuthToastMessage = {
  title: string;
  description: string;
};

export function getLoginErrorToast(error: ApiErrorResponse): AuthToastMessage {
  switch (error.code) {
    case 'AUTH_INVALID_CREDENTIALS':
      return {
        title: 'Login failed',
        description: 'Wrong email or password. Check your credentials and try again.',
      };
    case 'UPSTREAM_UNAVAILABLE':
      return {
        title: 'Login unavailable',
        description: 'The authentication service is unreachable right now. Try again shortly.',
      };
    default:
      return {
        title: 'Login failed',
        description: error.message,
      };
  }
}

export function getRegisterErrorToast(error: ApiErrorResponse): AuthToastMessage {
  switch (error.code) {
    case 'AUTH_EMAIL_TAKEN':
      return {
        title: 'Account creation failed',
        description: 'An account already exists for that email address.',
      };
    case 'UPSTREAM_UNAVAILABLE':
      return {
        title: 'Account creation unavailable',
        description: 'The authentication service is unreachable right now. Try again shortly.',
      };
    default:
      return {
        title: 'Account creation failed',
        description: error.message,
      };
  }
}
