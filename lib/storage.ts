/**
 * LocalStorage utilities for persisting journal entries
 * All CRUD operations for journal entries
 */

import { JournalEntry, JournalEntries } from '@/types/journal';

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
