/**
 * Main Journaling Page
 * Two-column layout with sidebar and editor
 * Manages all journal entry state and localStorage operations
 * Customization: Update layout breakpoints or initial state
 */

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import ReflectionModal from '@/components/ReflectionModal';
import { JournalEntry, JournalEntries } from '@/types/journal';
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  generateId,
} from '@/lib/storage';

export default function Home() {
  // State management
  const [entries, setEntries] = useState<JournalEntries>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reflection feature state
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    const loadedEntries = getEntries();
    setEntries(loadedEntries);
    setIsLoaded(true);

    // If there are entries, load the most recent one
    if (loadedEntries.length > 0) {
      const mostRecent = loadedEntries[0];
      setCurrentEntry(mostRecent);
      setTitle(mostRecent.title);
      setContent(mostRecent.content);
    }
  }, []);

  /**
   * Handle creating a new entry
   */
  const handleNewEntry = () => {
    setCurrentEntry(null);
    setTitle('');
    setContent('');
    setIsNewEntry(true);
  };

  /**
   * Handle selecting an existing entry from the sidebar
   */
  const handleSelectEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsNewEntry(false);
  };

  /**
   * Handle saving the current entry
   */
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert('Please add a title or content before saving.');
      return;
    }

    if (isNewEntry || !currentEntry) {
      // Create new entry
      const newEntry = createEntry(title || 'Untitled Entry', content);
      const updatedEntries = getEntries();
      setEntries(updatedEntries);
      setCurrentEntry(newEntry);
      setIsNewEntry(false);
    } else {
      // Update existing entry
      const updated = updateEntry(currentEntry.id, title, content);
      if (updated) {
        const updatedEntries = getEntries();
        setEntries(updatedEntries);
        setCurrentEntry(updated);
      }
    }
  };

  /**
   * Handle deleting an entry
   */
  const handleDeleteEntry = (id: string) => {
    const success = deleteEntry(id);
    if (success) {
      const updatedEntries = getEntries();
      setEntries(updatedEntries);

      // If we deleted the current entry, clear the editor or load another entry
      if (currentEntry?.id === id) {
        if (updatedEntries.length > 0) {
          const nextEntry = updatedEntries[0];
          setCurrentEntry(nextEntry);
          setTitle(nextEntry.title);
          setContent(nextEntry.content);
        } else {
          // No more entries, start fresh
          handleNewEntry();
        }
      }
    }
  };

  /**
   * Handle reflection feature - generate AI prompt based on last entry
   */
  const handleReflect = async () => {
    const allEntries = getEntries();

    if (allEntries.length === 0) {
      alert('Please save at least one entry before using the reflection feature.');
      return;
    }

    // Get the most recent entry
    const lastEntry = allEntries[0];

    setIsReflectionModalOpen(true);
    setIsLoadingReflection(true);
    setReflectionPrompt('');

    try {
      const response = await fetch('/api/reflect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastEntry }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate reflection');
      }

      const data = await response.json();
      setReflectionPrompt(data.prompt);
    } catch (error) {
      console.error('Error generating reflection:', error);
      setReflectionPrompt('Unable to generate a reflection prompt at this time. Please ensure your OpenAI API key is configured and try again.');
    } finally {
      setIsLoadingReflection(false);
    }
  };

  // Don't render until we've loaded from localStorage (prevents hydration issues)
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <p className="text-cocoa-400 font-sans italic">Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <Header />

      {/* Main Content: Two-column layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Journal entries list */}
        <div className="w-full md:w-80 lg:w-96 h-full overflow-hidden flex-shrink-0">
          <Sidebar
            entries={entries}
            currentEntryId={currentEntry?.id || null}
            onSelectEntry={handleSelectEntry}
            onNewEntry={handleNewEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        </div>

        {/* Right Editor - Markdown editor */}
        <div className="flex-1 h-full overflow-hidden">
          <Editor
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSave={handleSave}
            isNewEntry={isNewEntry}
            onReflect={handleReflect}
            hasLastEntry={entries.length > 0}
          />
        </div>
      </main>

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        prompt={reflectionPrompt}
        isLoading={isLoadingReflection}
      />
    </div>
  );
}
