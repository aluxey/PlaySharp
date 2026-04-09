import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { AuthenticatedUser, RequestWithAuthenticatedUser } from './auth.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithAuthenticatedUser>();
    return request.user;
  },
);
