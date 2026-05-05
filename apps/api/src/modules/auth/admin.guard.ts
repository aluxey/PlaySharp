import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { createApiError } from '../../common/api-error';
import type { RequestWithAuthenticatedUser } from './auth.types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();

    if (request.user?.role !== 'admin') {
      throw new ForbiddenException(
        createApiError(
          HttpStatus.FORBIDDEN,
          'AUTH_FORBIDDEN',
          'Admin access is required for this route.',
        ),
      );
    }

    return true;
  }
}
