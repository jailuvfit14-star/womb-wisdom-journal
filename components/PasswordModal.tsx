'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, X } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  mode: 'set' | 'unlock' | 'change' | 'remove';
  title?: string;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  title
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'set' || mode === 'change') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 4) {
          setError('Password must be at least 4 characters');
          setIsLoading(false);
          return;
        }
      }

      const passwordToSubmit = mode === 'change' || mode === 'remove'
        ? currentPassword
        : password;

      const success = await onSubmit(passwordToSubmit);

      if (success) {
        if (mode === 'change') {
          // After verifying current password, set the new one
          await onSubmit(password);
        }
        onClose();
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'set': return 'Set Password';
      case 'unlock': return 'Unlock Entry';
      case 'change': return 'Change Password';
      case 'remove': return 'Remove Password';
      default: return 'Password';
    }
  };

  const getIcon = () => {
    return mode === 'unlock' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-cream-50 border border-clay-200 rounded-softer shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-clay-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-soft bg-clay-100 text-clay-600">
              {getIcon()}
            </div>
            <h2 className="text-xl font-serif text-cocoa-700">
              {title || getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-soft hover:bg-clay-100 text-cocoa-500 hover:text-cocoa-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Current Password (for change/remove modes) */}
            {(mode === 'change' || mode === 'remove') && (
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-cocoa-600 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-clay-200 rounded-soft focus:outline-none focus:ring-2 focus:ring-clay-300 focus:border-transparent bg-white text-cocoa-700 placeholder-cocoa-300"
                  placeholder="Enter current password"
                  autoFocus
                  required
                />
              </div>
            )}

            {/* New Password (for set/change modes) */}
            {(mode === 'set' || mode === 'change') && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-cocoa-600 mb-2">
                    {mode === 'change' ? 'New Password' : 'Password'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-clay-200 rounded-soft focus:outline-none focus:ring-2 focus:ring-clay-300 focus:border-transparent bg-white text-cocoa-700 placeholder-cocoa-300"
                    placeholder="Enter password (min 4 characters)"
                    autoFocus={mode === 'set'}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-cocoa-600 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-clay-200 rounded-soft focus:outline-none focus:ring-2 focus:ring-clay-300 focus:border-transparent bg-white text-cocoa-700 placeholder-cocoa-300"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </>
            )}

            {/* Unlock Password */}
            {mode === 'unlock' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cocoa-600 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-clay-200 rounded-soft focus:outline-none focus:ring-2 focus:ring-clay-300 focus:border-transparent bg-white text-cocoa-700 placeholder-cocoa-300"
                  placeholder="Enter password to unlock"
                  autoFocus
                  required
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-soft bg-blush-100 border border-blush-300 text-blush-700 text-sm">
                {error}
              </div>
            )}

            {/* Info Message */}
            {mode === 'remove' && (
              <div className="p-3 rounded-soft bg-clay-100 border border-clay-200 text-cocoa-600 text-sm">
                This will remove password protection from this entry.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-soft border border-clay-200 text-cocoa-600 hover:bg-clay-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-soft bg-clay-400 text-white hover:bg-clay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : mode === 'unlock' ? 'Unlock' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
