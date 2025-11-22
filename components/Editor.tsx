/**
 * Editor Component
 * Main markdown editor with live preview and save functionality
 * Customization: Update placeholder text, colors, or preview styles
 */

'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Eye, EyeOff, Lock, Unlock, Shield } from 'lucide-react';

interface EditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isNewEntry: boolean;
  isPasswordProtected?: boolean;
  isLocked?: boolean;
  onSetPassword?: () => void;
  onRemovePassword?: () => void;
  onChangePassword?: () => void;
}

export default function Editor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isNewEntry,
  isPasswordProtected = false,
  isLocked = false,
  onSetPassword,
  onRemovePassword,
  onChangePassword,
}: EditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showPasswordMenu, setShowPasswordMenu] = useState(false);

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

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={(isSaved && !isNewEntry) || isLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-soft font-sans text-sm font-medium transition-all duration-200 ${
              (isSaved && !isNewEntry) || isLocked
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

          {/* Password Protection Menu */}
          {!isNewEntry && (
            <div className="relative">
              <button
                onClick={() => setShowPasswordMenu(!showPasswordMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-soft font-sans text-sm font-medium transition-colors duration-200 ${
                  isPasswordProtected
                    ? 'bg-clay-100 text-clay-600 hover:bg-clay-200'
                    : 'bg-cream-200 text-cocoa-600 hover:bg-cream-300'
                }`}
                title="Password protection"
              >
                {isPasswordProtected ? <Lock size={16} /> : <Shield size={16} />}
                <span className="hidden sm:inline">
                  {isPasswordProtected ? 'Protected' : 'Protect'}
                </span>
              </button>

              {/* Password Menu Dropdown */}
              {showPasswordMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-clay-200 rounded-soft shadow-lg z-10">
                  {!isPasswordProtected ? (
                    <button
                      onClick={() => {
                        setShowPasswordMenu(false);
                        onSetPassword?.();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-cocoa-700 hover:bg-clay-50 transition-colors flex items-center gap-2 rounded-soft"
                    >
                      <Lock size={14} />
                      Set Password
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowPasswordMenu(false);
                          onChangePassword?.();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-cocoa-700 hover:bg-clay-50 transition-colors flex items-center gap-2 rounded-t-soft"
                      >
                        <Shield size={14} />
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordMenu(false);
                          onRemovePassword?.();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-blush-600 hover:bg-blush-50 transition-colors flex items-center gap-2 rounded-b-soft"
                      >
                        <Unlock size={14} />
                        Remove Password
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLocked ? (
          // Locked State
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="inline-flex p-6 rounded-full bg-clay-100 mb-4">
                <Lock size={48} className="text-clay-500" />
              </div>
              <h3 className="text-xl font-serif text-cocoa-700 mb-2">
                This Entry is Locked
              </h3>
              <p className="text-cocoa-500 font-sans text-sm">
                This entry is password-protected. Click on it in the sidebar to unlock.
              </p>
            </div>
          </div>
        ) : showPreview ? (
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
            disabled={isLocked}
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
