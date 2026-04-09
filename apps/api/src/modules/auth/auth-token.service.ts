import { createHmac, timingSafeEqual } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { AuthSession } from '@playsharp/shared';

import type { AuthenticatedUser } from './auth.types';

type TokenPayload = {
  sub: string;
  email: string;
  role: AuthenticatedUser['role'];
  plan: AuthenticatedUser['plan'];
  iat: number;
  exp: number;
};

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

@Injectable()
export class AuthTokenService {
  private readonly secret = process.env.JWT_SECRET ?? 'playsharp-dev-secret';

  createSession(user: AuthenticatedUser): AuthSession {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + ACCESS_TOKEN_TTL_SECONDS;
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
      iat: issuedAt,
      exp: expiresAt,
    };

    return {
      accessToken: this.sign(payload),
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      user,
    };
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new Error('Invalid bearer token format.');
    }

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = this.signingDigest(signingInput);
    const providedSignature = Buffer.from(encodedSignature, 'base64url');

    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      throw new Error('Invalid bearer token signature.');
    }

    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<TokenPayload>;

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      (payload.role !== 'user' && payload.role !== 'admin') ||
      (payload.plan !== 'free' && payload.plan !== 'premium') ||
      typeof payload.exp !== 'number'
    ) {
      throw new Error('Invalid bearer token payload.');
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new Error('Bearer token expired.');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
    };
  }

  private sign(payload: TokenPayload): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const encodedHeader = encodeBase64Url(JSON.stringify(header));
    const encodedPayload = encodeBase64Url(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = this.signingDigest(signingInput).toString('base64url');

    return `${signingInput}.${signature}`;
  }

  private signingDigest(input: string) {
    return createHmac('sha256', this.secret).update(input).digest();
  }
}
