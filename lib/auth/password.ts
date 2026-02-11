/**
 * Password hashing and verification utilities
 * Uses Node.js crypto module for simple but functional approach
 */

import { createHash, randomBytes } from 'crypto'

/**
 * Hash a password using SHA-256 with a salt prefix
 * Simple approach: salt (16 bytes) + SHA-256(salt + password)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(salt + password).digest('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(':')
    if (!salt || !storedHash) {
      return false
    }
    const computedHash = createHash('sha256').update(salt + password).digest('hex')
    return computedHash === storedHash
  } catch {
    return false
  }
}
