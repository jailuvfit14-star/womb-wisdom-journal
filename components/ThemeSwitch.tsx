/**
 * Theme Switcher Component
 * Displays a dropdown to switch between available themes
 */

'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { themes, ThemeId } from '@/lib/themes';
import { Palette } from 'lucide-react';
import { useState } from 'react';

export default function ThemeSwitch() {
  const { themeId, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newThemeId: ThemeId) => {
    setTheme(newThemeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 theme-surface theme-text rounded-soft hover:opacity-80 transition-all duration-200 font-sans text-sm font-medium border-2 theme-border"
        aria-label="Switch theme"
      >
        <Palette size={16} />
        <span className="hidden sm:inline">{themes[themeId].name}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 theme-surface rounded-soft shadow-lg border-2 theme-border z-20 overflow-hidden">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id as ThemeId)}
                className={`w-full text-left px-4 py-3 theme-text hover:theme-hover transition-all duration-200 font-sans text-sm ${
                  themeId === theme.id ? 'font-semibold theme-accent-text' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Color preview dot */}
                  <div
                    className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                    style={{
                      backgroundColor: theme.colors.accent,
                      borderColor: theme.colors.border,
                    }}
                  />
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
