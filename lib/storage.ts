/**
 * LocalStorage utilities for persisting journal entries
 * All CRUD operations for journal entries
 */

import { JournalEntry, JournalEntries } from '@/types/journal';
import { hashPassword, encryptContent, decryptContent, verifyPassword } from './password';

const STORAGE_KEY = 'aurora_journal_entries';

/**
 * Generate a unique ID for new journal entries
 */
export const generateId = (): string => {
  return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all journal entries from localStorage
 */
export const getEntries = (): JournalEntries => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save all journal entries to localStorage
 */
export const saveEntries = (entries: JournalEntries): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Create a new journal entry
 */
export const createEntry = (title: string, content: string): JournalEntry => {
  const now = new Date().toISOString();
  const newEntry: JournalEntry = {
    id: generateId(),
    title: title || 'Untitled Entry',
    content,
    createdAt: now,
    updatedAt: now,
  };

  const entries = getEntries();
  entries.unshift(newEntry); // Add to beginning of array (most recent first)
  saveEntries(entries);

  return newEntry;
};

/**
 * Update an existing journal entry
 */
export const updateEntry = (id: string, title: string, content: string): JournalEntry | null => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) return null;

  entries[index] = {
    ...entries[index],
    title: title || 'Untitled Entry',
    content,
    updatedAt: new Date().toISOString(),
  };

  saveEntries(entries);
  return entries[index];
};

/**
 * Delete a journal entry by ID
 */
export const deleteEntry = (id: string): boolean => {
  const entries = getEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);

  if (filteredEntries.length === entries.length) return false; // Entry not found

  saveEntries(filteredEntries);
  return true;
};

/**
 * Get a single entry by ID
 */
export const getEntryById = (id: string): JournalEntry | null => {
  const entries = getEntries();
  return entries.find(entry => entry.id === id) || null;
};

/**
 * Set password protection on an entry
 */
export const setEntryPassword = async (id: string, password: string): Promise<boolean> => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) return false;

  const entry = entries[index];
  const passwordHash = await hashPassword(password);
  const encryptedContent = encryptContent(entry.content, password);

  entries[index] = {
    ...entry,
    isPasswordProtected: true,
    passwordHash,
    encryptedContent,
    content: '', // Clear content when locked
    updatedAt: new Date().toISOString(),
  };

  saveEntries(entries);
  return true;
};

/**
 * Remove password protection from an entry
 */
export const removeEntryPassword = async (id: string, password: string): Promise<boolean> => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) return false;

  const entry = entries[index];

  if (!entry.isPasswordProtected || !entry.passwordHash || !entry.encryptedContent) {
    return false;
  }

  // Verify password
  const isValid = await verifyPassword(password, entry.passwordHash);
  if (!isValid) return false;

  // Decrypt content
  const decryptedContent = decryptContent(entry.encryptedContent, password);

  entries[index] = {
    ...entry,
    isPasswordProtected: false,
    passwordHash: undefined,
    encryptedContent: undefined,
    content: decryptedContent,
    updatedAt: new Date().toISOString(),
  };

  saveEntries(entries);
  return true;
};

/**
 * Unlock a password-protected entry (returns decrypted content without saving)
 */
export const unlockEntry = async (id: string, password: string): Promise<string | null> => {
  const entry = getEntryById(id);

  if (!entry || !entry.isPasswordProtected || !entry.passwordHash || !entry.encryptedContent) {
    return null;
  }

  // Verify password
  const isValid = await verifyPassword(password, entry.passwordHash);
  if (!isValid) return null;

  // Decrypt and return content
  return decryptContent(entry.encryptedContent, password);
};

/**
 * Update a password-protected entry's content
 */
export const updatePasswordProtectedEntry = async (
  id: string,
  password: string,
  title: string,
  content: string
): Promise<JournalEntry | null> => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) return null;

  const entry = entries[index];

  if (!entry.isPasswordProtected || !entry.passwordHash) {
    return null;
  }

  // Verify password
  const isValid = await verifyPassword(password, entry.passwordHash);
  if (!isValid) return null;

  // Encrypt new content
  const encryptedContent = encryptContent(content, password);

  entries[index] = {
    ...entry,
    title: title || 'Untitled Entry',
    encryptedContent,
    updatedAt: new Date().toISOString(),
  };

  saveEntries(entries);
  return entries[index];
};

/**
 * Change password for a password-protected entry
 */
export const changeEntryPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
): Promise<boolean> => {
  const entries = getEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) return false;

  const entry = entries[index];

  if (!entry.isPasswordProtected || !entry.passwordHash || !entry.encryptedContent) {
    return false;
  }

  // Verify old password
  const isValid = await verifyPassword(oldPassword, entry.passwordHash);
  if (!isValid) return false;

  // Decrypt with old password
  const decryptedContent = decryptContent(entry.encryptedContent, oldPassword);

  // Encrypt with new password
  const newPasswordHash = await hashPassword(newPassword);
  const newEncryptedContent = encryptContent(decryptedContent, newPassword);

  entries[index] = {
    ...entry,
    passwordHash: newPasswordHash,
    encryptedContent: newEncryptedContent,
    updatedAt: new Date().toISOString(),
  };

  saveEntries(entries);
  return true;
};
