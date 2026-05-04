import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { createApiError } from '../../common/api-error';
import type { RequestWithAuthenticatedUser } from '../auth/auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();

    if (request.user?.role === 'admin') {
      return true;
    }

    throw new ForbiddenException(
      createApiError(HttpStatus.FORBIDDEN, 'AUTH_FORBIDDEN', 'Admin permissions are required.'),
    );
  }
}
