/**
 * Sidebar Component
 * Displays the list of all saved journal entries
 * Customization: Update colors, spacing, or hover effects in className strings
 */

import { JournalEntry } from '@/types/journal';
import { Plus, Trash2 } from 'lucide-react';

interface SidebarProps {
  entries: JournalEntry[];
  currentEntryId: string | null;
  onSelectEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
}

export default function Sidebar({
  entries,
  currentEntryId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
}: SidebarProps) {
  /**
   * Format date to a gentle, readable format
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  return (
    <aside className="w-full h-full theme-surface border-r theme-border-light flex flex-col custom-scrollbar">
      {/* New Entry Button */}
      <div className="p-6 border-b theme-border-light">
        <button
          onClick={onNewEntry}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 theme-button rounded-soft transition-all duration-200 font-sans text-sm font-medium"
        >
          <Plus size={18} />
          New Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {entries.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="theme-text-light text-sm font-sans italic">
              No entries yet. Start writing to create your first ritual.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`group relative p-4 rounded-soft cursor-pointer transition-all duration-200 ${
                currentEntryId === entry.id
                  ? 'theme-hover border-2 theme-border'
                  : 'theme-bg border-2 border-transparent hover:theme-border-light hover:shadow-sm'
              }`}
              onClick={() => onSelectEntry(entry)}
            >
              {/* Entry Title */}
              <h3
                className={`font-serif text-base mb-1 pr-8 truncate ${
                  currentEntryId === entry.id ? 'theme-text' : 'theme-text-light'
                }`}
              >
                {entry.title}
              </h3>

              {/* Entry Date */}
              <p className="text-xs theme-text-light font-sans">
                {formatDate(entry.createdAt)}
              </p>

              {/* Delete Button - appears on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent entry selection when deleting
                  if (confirm('Are you sure you want to delete this entry?')) {
                    onDeleteEntry(entry.id);
                  }
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full theme-hover theme-accent-text opacity-0 group-hover:opacity-100 hover:opacity-90 transition-all duration-200"
                aria-label="Delete entry"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
