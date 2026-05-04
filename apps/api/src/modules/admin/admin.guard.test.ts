import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

import { AdminGuard } from './admin.guard';

function contextWithUser(role: 'admin' | 'user' | null): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user: role
          ? {
              id: 'user-1',
              email: 'learner@example.com',
              role,
              plan: 'free',
            }
          : undefined,
      }),
    }),
  } as unknown as ExecutionContext;
}

test('AdminGuard allows admin users', () => {
  const guard = new AdminGuard();

  assert.equal(guard.canActivate(contextWithUser('admin')), true);
});

test('AdminGuard rejects non-admin users', () => {
  const guard = new AdminGuard();

  assert.throws(() => guard.canActivate(contextWithUser('user')), ForbiddenException);
});
