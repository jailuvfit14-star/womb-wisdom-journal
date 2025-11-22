/**
 * Reflection Modal Component
 * Displays AI-generated reflection prompts in a soft, feminine styled modal
 */

'use client';

import { X, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  isLoading: boolean;
}

export default function ReflectionModal({
  isOpen,
  onClose,
  prompt,
  isLoading,
}: ReflectionModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cocoa-900/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-fadeIn">
        {/* Decorative gradient bar */}
        <div className="h-1 bg-gradient-to-r from-blush-300 via-clay-300 to-blush-300" />

        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-cream-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blush-100 to-clay-100 flex items-center justify-center">
                <Sparkles className="text-clay-500" size={20} />
              </div>
              <h2 className="font-serif text-2xl text-cocoa-700">
                Reflect With Me
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-cocoa-400 hover:text-cocoa-600 transition-colors duration-200 p-1 hover:bg-cream-100 rounded-full"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                {/* Animated circles */}
                <div className="w-16 h-16 rounded-full border-4 border-blush-200 border-t-clay-400 animate-spin" />
              </div>
              <p className="mt-6 text-cocoa-400 font-sans italic text-center">
                Creating a thoughtful prompt for you...
              </p>
            </div>
          ) : prompt ? (
            <div className="space-y-6">
              {/* Prompt display */}
              <div className="bg-gradient-to-br from-cream-50 to-blush-50/30 rounded-xl p-6 border border-blush-100/50">
                <p className="font-sans text-base md:text-lg leading-relaxed text-cocoa-700">
                  {prompt}
                </p>
              </div>

              {/* Gentle encouragement */}
              <p className="text-sm text-cocoa-400 italic text-center font-sans">
                Take your time. There's no rush to answer.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-cocoa-400 font-sans">
                No reflection prompt available. Please try again.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-cream-50 border-t border-cream-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-clay-400 to-clay-500 text-white rounded-soft font-sans font-medium hover:from-clay-500 hover:to-clay-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
