import { NextResponse } from 'next/server';

import type {
  ApiErrorResponse,
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthSessionResponse,
} from '@playsharp/shared';

import { apiBaseUrl } from './api-base-url';
import { AUTH_SESSION_COOKIE } from './auth-session';

function upstreamUnavailable(path: string): ApiErrorResponse {
  return {
    statusCode: 503,
    error: 'Service Unavailable',
    code: 'UPSTREAM_UNAVAILABLE',
    message: `Could not reach the API for ${path}.`,
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
    message: `Unexpected API response for ${path}.`,
  };
}

export async function handleAuthSessionRequest(request: Request, action: 'login' | 'register') {
  const path = `/auth/${action}`;

  try {
    const body = (await request.json()) as AuthLoginRequest | AuthRegisterRequest;
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as
      | AuthSessionResponse
      | ApiErrorResponse
      | null;

    if (!response.ok || !payload || !('data' in payload)) {
      return NextResponse.json(normalizeError(path, response.status, payload), {
        status: response.status,
      });
    }

    const result = NextResponse.json(payload, {
      status: response.status,
    });

    result.cookies.set(AUTH_SESSION_COOKIE, payload.data.session.accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(payload.data.session.expiresAt),
    });

    return result;
  } catch {
    return NextResponse.json(upstreamUnavailable(path), {
      status: 503,
    });
  }
}

export async function handleLogoutRequest() {
  const response = NextResponse.json({
    data: {
      ok: true,
    },
  });

  response.cookies.set(AUTH_SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });

  return response;
}
