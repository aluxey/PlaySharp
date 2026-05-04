import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { ApiErrorResponse } from '@playsharp/shared';

import { apiBaseUrl } from '../../../lib/api-base-url';
import { AUTH_SESSION_COOKIE } from '../../../lib/auth-session';

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

export async function proxyAdminRequest(path: string, init: { method: string; body?: unknown }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          error: 'Unauthorized',
          code: 'AUTH_UNAUTHORIZED',
          message: 'Log in as an admin to manage content.',
        } satisfies ApiErrorResponse,
        { status: 401 },
      );
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: init.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      cache: 'no-store',
    });
    const payload = (await response.json().catch(() => null)) as unknown;

    if (!response.ok || !payload || typeof payload !== 'object') {
      return NextResponse.json(normalizeError(path, response.status, payload), {
        status: response.status,
      });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(upstreamUnavailable(path), { status: 503 });
  }
}
