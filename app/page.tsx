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
import PasswordModal from '@/components/PasswordModal';
import { JournalEntry, JournalEntries } from '@/types/journal';
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  generateId,
  setEntryPassword,
  removeEntryPassword,
  unlockEntry,
  updatePasswordProtectedEntry,
  changeEntryPassword,
} from '@/lib/storage';

export default function Home() {
  // State management
  const [entries, setEntries] = useState<JournalEntries>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Password protection state
  const [unlockedEntries, setUnlockedEntries] = useState<Set<string>>(new Set());
  const [unlockedPasswords, setUnlockedPasswords] = useState<Map<string, string>>(new Map());
  const [passwordModalState, setPasswordModalState] = useState<{
    isOpen: boolean;
    mode: 'set' | 'unlock' | 'change' | 'remove';
    entryId: string | null;
  }>({
    isOpen: false,
    mode: 'unlock',
    entryId: null,
  });

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
    setIsNewEntry(false);

    // Check if entry is password-protected
    if (entry.isPasswordProtected) {
      // Check if already unlocked
      if (unlockedEntries.has(entry.id)) {
        // Use cached decrypted content
        const password = unlockedPasswords.get(entry.id);
        if (password && entry.encryptedContent) {
          try {
            const { decryptContent } = require('@/lib/password');
            const decrypted = decryptContent(entry.encryptedContent, password);
            setContent(decrypted);
          } catch (error) {
            // If decryption fails, show empty and require unlock again
            setContent('');
            setUnlockedEntries(prev => {
              const newSet = new Set(prev);
              newSet.delete(entry.id);
              return newSet;
            });
          }
        } else {
          setContent('');
        }
      } else {
        // Entry is locked, show unlock modal
        setContent('');
        setPasswordModalState({
          isOpen: true,
          mode: 'unlock',
          entryId: entry.id,
        });
      }
    } else {
      // Regular entry, just load content
      setContent(entry.content);
    }
  };

  /**
   * Handle saving the current entry
   */
  const handleSave = async () => {
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
      // Check if entry is password-protected
      if (currentEntry.isPasswordProtected && unlockedPasswords.has(currentEntry.id)) {
        const password = unlockedPasswords.get(currentEntry.id)!;
        const updated = await updatePasswordProtectedEntry(
          currentEntry.id,
          password,
          title,
          content
        );
        if (updated) {
          const updatedEntries = getEntries();
          setEntries(updatedEntries);
          setCurrentEntry(updated);
        }
      } else {
        // Update regular entry
        const updated = updateEntry(currentEntry.id, title, content);
        if (updated) {
          const updatedEntries = getEntries();
          setEntries(updatedEntries);
          setCurrentEntry(updated);
        }
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

      // Remove from unlocked entries if present
      setUnlockedEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setUnlockedPasswords(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });

      // If we deleted the current entry, clear the editor or load another entry
      if (currentEntry?.id === id) {
        if (updatedEntries.length > 0) {
          const nextEntry = updatedEntries[0];
          handleSelectEntry(nextEntry);
        } else {
          // No more entries, start fresh
          handleNewEntry();
        }
      }
    }
  };

  /**
   * Handle password modal submission
   */
  const handlePasswordSubmit = async (password: string): Promise<boolean> => {
    if (!passwordModalState.entryId) return false;

    const entryId = passwordModalState.entryId;

    switch (passwordModalState.mode) {
      case 'unlock': {
        const decryptedContent = await unlockEntry(entryId, password);
        if (decryptedContent !== null) {
          // Successfully unlocked
          setUnlockedEntries(prev => new Set(prev).add(entryId));
          setUnlockedPasswords(prev => new Map(prev).set(entryId, password));
          setContent(decryptedContent);
          return true;
        }
        return false;
      }

      case 'set': {
        const success = await setEntryPassword(entryId, password);
        if (success) {
          // Mark as unlocked since we just set the password
          setUnlockedEntries(prev => new Set(prev).add(entryId));
          setUnlockedPasswords(prev => new Map(prev).set(entryId, password));
          const updatedEntries = getEntries();
          setEntries(updatedEntries);
          const updated = updatedEntries.find(e => e.id === entryId);
          if (updated) setCurrentEntry(updated);
        }
        return success;
      }

      case 'remove': {
        const success = await removeEntryPassword(entryId, password);
        if (success) {
          // Remove from unlocked entries
          setUnlockedEntries(prev => {
            const newSet = new Set(prev);
            newSet.delete(entryId);
            return newSet;
          });
          setUnlockedPasswords(prev => {
            const newMap = new Map(prev);
            newMap.delete(entryId);
            return newMap;
          });
          const updatedEntries = getEntries();
          setEntries(updatedEntries);
          const updated = updatedEntries.find(e => e.id === entryId);
          if (updated) {
            setCurrentEntry(updated);
            setContent(updated.content);
          }
        }
        return success;
      }

      case 'change': {
        // First verify with current password, then set new one
        const decryptedContent = await unlockEntry(entryId, password);
        if (decryptedContent !== null) {
          // Now we need to get the new password from the modal
          // This will be handled by the modal showing password/confirm fields
          return true;
        }
        return false;
      }

      default:
        return false;
    }
  };

  /**
   * Open password modal for setting password
   */
  const handleSetPassword = () => {
    if (!currentEntry) return;
    setPasswordModalState({
      isOpen: true,
      mode: 'set',
      entryId: currentEntry.id,
    });
  };

  /**
   * Open password modal for removing password
   */
  const handleRemovePassword = () => {
    if (!currentEntry) return;
    setPasswordModalState({
      isOpen: true,
      mode: 'remove',
      entryId: currentEntry.id,
    });
  };

  /**
   * Open password modal for changing password
   */
  const handleChangePassword = async () => {
    if (!currentEntry) return;

    // Get current password
    const currentPassword = unlockedPasswords.get(currentEntry.id);
    if (!currentPassword) {
      // Need to unlock first
      setPasswordModalState({
        isOpen: true,
        mode: 'unlock',
        entryId: currentEntry.id,
      });
      return;
    }

    // Show a simple prompt for new password (simplified version)
    const newPassword = prompt('Enter new password (min 4 characters):');
    if (!newPassword) return;

    if (newPassword.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const success = await changeEntryPassword(currentEntry.id, currentPassword, newPassword);
    if (success) {
      // Update the cached password
      setUnlockedPasswords(prev => new Map(prev).set(currentEntry.id, newPassword));
      alert('Password changed successfully');
      const updatedEntries = getEntries();
      setEntries(updatedEntries);
    } else {
      alert('Failed to change password');
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
            isPasswordProtected={currentEntry?.isPasswordProtected}
            isLocked={currentEntry?.isPasswordProtected && !unlockedEntries.has(currentEntry.id)}
            onSetPassword={handleSetPassword}
            onRemovePassword={handleRemovePassword}
            onChangePassword={handleChangePassword}
          />
        </div>
      </main>

      {/* Password Modal */}
      <PasswordModal
        isOpen={passwordModalState.isOpen}
        onClose={() => setPasswordModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handlePasswordSubmit}
        mode={passwordModalState.mode}
      />
    </div>
  );
}
