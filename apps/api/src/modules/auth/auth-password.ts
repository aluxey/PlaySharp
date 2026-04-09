import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_PREFIX = 'scrypt';

function decodeBase64Url(value: string) {
  return Buffer.from(value, 'base64url');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return [HASH_PREFIX, salt.toString('base64url'), derivedKey.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, expectedHash] = storedHash.split('$');

  if (algorithm !== HASH_PREFIX || !salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, decodeBase64Url(salt), KEY_LENGTH)) as Buffer;
  const expectedBuffer = decodeBase64Url(expectedHash);

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedBuffer);
}
