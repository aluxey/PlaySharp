const FORBIDDEN_JWT_SECRETS = new Set(['replace-me', 'playsharp-dev-secret']);

export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function requireJwtSecret(): string {
  const secret = requireEnv('JWT_SECRET');

  if (FORBIDDEN_JWT_SECRETS.has(secret) || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters and must not use a placeholder.');
  }

  return secret;
}

export function validateApiEnv() {
  requireJwtSecret();
}
