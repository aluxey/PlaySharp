import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { createApiError } from '../../common/api-error';
import { AuthTokenService } from './auth-token.service';
import type { RequestWithAuthenticatedUser } from './auth.types';

function extractBearerToken(authorizationHeader: string | string[] | undefined) {
  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authTokenService: AuthTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_UNAUTHORIZED',
          'Missing or invalid bearer token.',
        ),
      );
    }

    try {
      request.user = this.authTokenService.verifyAccessToken(token);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid bearer token.';

      throw new UnauthorizedException(
        createApiError(HttpStatus.UNAUTHORIZED, 'AUTH_UNAUTHORIZED', message),
      );
    }
  }
}
