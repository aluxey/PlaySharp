import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { AuthTokenService } from './auth-token.service';

const originalJwtSecret = process.env.JWT_SECRET;

afterEach(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
    return;
  }

  process.env.JWT_SECRET = originalJwtSecret;
});

test('AuthTokenService signs and verifies access tokens', () => {
  process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters';

  const service = new AuthTokenService();
  const session = service.createSession({
    id: 'user-1',
    email: 'learner@example.com',
    role: 'user',
    plan: 'free',
  });

  assert.equal(session.user.email, 'learner@example.com');
  assert.equal(service.verifyAccessToken(session.accessToken).id, 'user-1');
});

test('AuthTokenService rejects placeholder secrets', () => {
  process.env.JWT_SECRET = 'replace-me';

  assert.throws(() => new AuthTokenService(), /JWT_SECRET/);
});
