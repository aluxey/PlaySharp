import type {
  ApiErrorResponse,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthSession,
  AuthSessionResponse,
} from '@playsharp/shared';

export type AuthClientResult = {
  data: AuthSession | null;
  error: ApiErrorResponse | null;
};

function upstreamUnavailable(path: string): ApiErrorResponse {
  return {
    statusCode: 503,
    error: 'Service Unavailable',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Could not reach ${path}.`,
  };
}

function normalizeError(path: string, statusCode: number, payload: unknown): ApiErrorResponse {
  if (
    payload &&
    typeof payload === 'object' &&
    'statusCode' in payload &&
    'error' in payload &&
    'message' in payload &&
    'code' in payload
  ) {
    return payload as ApiErrorResponse;
  }

  return {
    statusCode,
    error: statusCode >= 500 ? 'Server Error' : 'Request Failed',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Unexpected response for ${path}.`,
  };
}

async function postAuthRequest(
  path: '/api/auth/login' | '/api/auth/register',
  body: AuthLoginRequest | AuthRegisterRequest,
): Promise<AuthClientResult> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => null)) as
      | AuthSessionResponse
      | ApiErrorResponse
      | null;

    if (!response.ok) {
      return {
        data: null,
        error: normalizeError(path, response.status, payload),
      };
    }

    if (!payload || !('data' in payload)) {
      return {
        data: null,
        error: normalizeError(path, response.status, payload),
      };
    }

    return {
      data: payload.data.session,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: upstreamUnavailable(path),
    };
  }
}

export async function loginWithPassword(input: AuthLoginRequest) {
  return postAuthRequest('/api/auth/login', input);
}

export async function registerWithPassword(input: AuthRegisterRequest) {
  return postAuthRequest('/api/auth/register', input);
}
