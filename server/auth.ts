import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const key = scryptSync(password, salt, 32)
  return `${salt.toString('hex')}:${key.toString('hex')}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const actual = scryptSync(password, Buffer.from(salt, 'hex'), 32)
  return timingSafeEqual(actual, Buffer.from(key, 'hex'))
}

// Token'lar DB'de yalnız SHA-256 özeti olarak tutulur.
export const newToken = () => randomBytes(32).toString('base64url')
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')

// 6 haneli eşleştirme kodu (telefona elle girilir).
export const newPairCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0')
