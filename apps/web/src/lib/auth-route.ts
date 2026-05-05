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

function shouldUseSecureCookie(request: Request) {
  const url = new URL(request.url);

  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]') {
    return false;
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');

  if (forwardedProto) {
    return forwardedProto.split(',')[0]?.trim() === 'https';
  }

  return url.protocol === 'https:';
}

export async function handleAuthSessionRequest(request: Request, action: 'login' | 'register') {
  const path = `/auth/${action}`;
  const secureCookie = shouldUseSecureCookie(request);

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
      secure: secureCookie,
      expires: new Date(payload.data.session.expiresAt),
    });

    return result;
  } catch {
    return NextResponse.json(upstreamUnavailable(path), {
      status: 503,
    });
  }
}

export async function handleLogoutRequest(request: Request) {
  const secureCookie = shouldUseSecureCookie(request);

  const response = NextResponse.json({
    data: {
      ok: true,
    },
  });

  response.cookies.set(AUTH_SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: secureCookie,
    maxAge: 0,
  });

  return response;
}
