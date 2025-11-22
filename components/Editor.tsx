/**
 * Editor Component
 * Main markdown editor with live preview and save functionality
 * Customization: Update placeholder text, colors, or preview styles
 */

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, EyeOff } from 'lucide-react';
import MoodSelector from './MoodSelector';
import { MoodType } from '@/types/journal';

interface EditorProps {
  title: string;
  content: string;
  mood?: MoodType;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onMoodChange: (mood: MoodType | undefined) => void;
  onSave: () => void;
  isNewEntry: boolean;
}

export default function Editor({
  title,
  content,
  mood,
  onTitleChange,
  onContentChange,
  onMoodChange,
  onSave,
  isNewEntry,
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Track if content has changed (for save indicator)
  useEffect(() => {
    setIsSaved(false);
  }, [title, content, mood]);

  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  // Nurturing placeholder text
  const placeholderText = "Take a breath. What's resting on your heart today?";

  return (
    <div className="flex flex-col h-full bg-cream-50">
      {/* Editor Header with Title Input and Actions */}
      <div className="border-b border-cream-200 px-8 py-6 bg-white">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Entry Title"
          className="w-full font-serif text-2xl md:text-3xl text-cocoa-700 placeholder:text-cocoa-300 bg-transparent border-none outline-none mb-4"
        />

        {/* Mood Selector */}
        <div className="mb-5">
          <MoodSelector selectedMood={mood} onMoodChange={onMoodChange} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaved && !isNewEntry}
            className={`flex items-center gap-2 px-4 py-2 rounded-soft font-sans text-sm font-medium transition-all duration-200 ${
              isSaved && !isNewEntry
                ? 'bg-cream-200 text-cocoa-400 cursor-not-allowed'
                : 'bg-clay-400 text-white hover:bg-clay-500'
            }`}
          >
            <Save size={16} />
            {isSaved && !isNewEntry ? 'Saved' : 'Save Entry'}
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-blush-100 text-blush-600 rounded-soft hover:bg-blush-200 transition-colors duration-200 font-sans text-sm font-medium"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {showPreview ? (
          // Markdown Preview
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-cocoa prose-sm md:prose-base max-w-none">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-cocoa-300 italic">{placeholderText}</p>
              )}
            </article>
          </div>
        ) : (
          // Markdown Editor (Textarea)
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholderText}
            className="w-full h-full max-w-3xl mx-auto px-4 py-2 bg-white border-2 border-cream-200 rounded-soft font-sans text-base text-cocoa-700 placeholder:text-cocoa-300 placeholder:italic focus:outline-none focus:border-clay-300 transition-colors duration-200 resize-none"
            style={{
              minHeight: '500px',
              lineHeight: '1.8',
            }}
          />
        )}
      </div>

      {/* Gentle Footer Hint */}
      <div className="border-t border-cream-200 px-8 py-3 bg-white">
        <p className="text-xs text-cocoa-400 font-sans text-center italic">
          Your words are safe here. Everything is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
