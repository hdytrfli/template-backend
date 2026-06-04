import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1 } as const;

export class Hash {
  static hash(password: string): string {
    const salt = randomBytes(SALT_LENGTH).toString('hex');
    const derived = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS).toString('hex');
    return `${salt}:${derived}`;
  }

  static compare(password: string, hashed: string): boolean {
    const [salt, key] = hashed.split(':');
    if (!salt || !key) return false;

    const derived = scryptSync(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
    const stored = Buffer.from(key, 'hex');

    if (derived.length !== stored.length) return false;
    return timingSafeEqual(derived, stored);
  }
}
