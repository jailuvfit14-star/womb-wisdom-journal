/**
 * Password hashing and encryption utilities for journal entries
 */

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Simple XOR encryption for content (password-based)
 * Note: This is not cryptographically secure but sufficient for local browser storage
 */
export function encryptContent(content: string, password: string): string {
  let encrypted = '';
  for (let i = 0; i < content.length; i++) {
    const charCode = content.charCodeAt(i) ^ password.charCodeAt(i % password.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted); // Base64 encode
}

/**
 * Decrypt XOR encrypted content
 */
export function decryptContent(encryptedContent: string, password: string): string {
  try {
    const encrypted = atob(encryptedContent); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ password.charCodeAt(i % password.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt content. Invalid password or corrupted data.');
  }
}
