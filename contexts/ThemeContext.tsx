/**
 * Theme Context
 * Provides theme state and switching functionality throughout the app
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme, ThemeId, Theme } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('aurora-theme') as ThemeId;
    if (savedTheme && themes[savedTheme]) {
      setThemeId(savedTheme);
    }
  }, []);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const theme = themes[themeId];
    const root = document.documentElement;

    // Set CSS custom properties for smooth transitions
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-light', theme.colors.textLight);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-border-light', theme.colors.borderLight);
    root.style.setProperty('--color-hover', theme.colors.hover);
    root.style.setProperty('--color-button-bg', theme.colors.buttonBg);
    root.style.setProperty('--color-button-hover', theme.colors.buttonHover);
    root.style.setProperty('--color-button-text', theme.colors.buttonText);

    // Save to localStorage
    localStorage.setItem('aurora-theme', themeId);
  }, [themeId]);

  const setTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
  };

  const value: ThemeContextType = {
    currentTheme: themes[themeId],
    themeId,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
