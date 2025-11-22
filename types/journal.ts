/**
 * TypeScript types for journal entries
 */

export type MoodType = 'peaceful' | 'joyful' | 'tender' | 'reflective' | 'creative' | 'nurturing';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: MoodType; // Optional mood for the entry
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type JournalEntries = JournalEntry[];
