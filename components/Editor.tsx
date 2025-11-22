/**
 * Editor Component
 * Main markdown editor with live preview and save functionality
 * Customization: Update placeholder text, colors, or preview styles
 */

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, EyeOff } from 'lucide-react';

interface EditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isNewEntry: boolean;
}

export default function Editor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isNewEntry,
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Track if content has changed (for save indicator)
  useEffect(() => {
    setIsSaved(false);
  }, [title, content]);

  const handleSave = () => {
    onSave();
    setIsSaved(true);
  };

  // Nurturing placeholder text
  const placeholderText = "Take a breath. What's resting on your heart today?";

  return (
    <div className="flex flex-col h-full theme-bg">
      {/* Editor Header with Title Input and Actions */}
      <div className="border-b theme-border-light px-8 py-6 theme-bg">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Entry Title"
          className="w-full font-serif text-2xl md:text-3xl theme-text placeholder:theme-text-light placeholder:opacity-60 bg-transparent border-none outline-none mb-4"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaved && !isNewEntry}
            className={`flex items-center gap-2 px-4 py-2 rounded-soft font-sans text-sm font-medium transition-all duration-200 ${
              isSaved && !isNewEntry
                ? 'theme-hover theme-text-light cursor-not-allowed opacity-60'
                : 'theme-button'
            }`}
          >
            <Save size={16} />
            {isSaved && !isNewEntry ? 'Saved' : 'Save Entry'}
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 theme-surface theme-accent-text rounded-soft hover:opacity-80 transition-all duration-200 font-sans text-sm font-medium"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
        {showPreview ? (
          // Markdown Preview
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-cocoa prose-sm md:prose-base max-w-none theme-text">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="theme-text-light italic">{placeholderText}</p>
              )}
            </article>
          </div>
        ) : (
          // Markdown Editor (Textarea)
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholderText}
            className="w-full h-full max-w-3xl mx-auto px-4 py-2 theme-bg border-2 theme-border-light rounded-soft font-sans text-base theme-text placeholder:theme-text-light placeholder:opacity-60 placeholder:italic focus:outline-none focus:theme-border transition-all duration-200 resize-none custom-scrollbar"
            style={{
              minHeight: '500px',
              lineHeight: '1.8',
            }}
          />
        )}
      </div>

      {/* Gentle Footer Hint */}
      <div className="border-t theme-border-light px-8 py-3 theme-bg">
        <p className="text-xs theme-text-light font-sans text-center italic">
          Your words are safe here. Everything is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
