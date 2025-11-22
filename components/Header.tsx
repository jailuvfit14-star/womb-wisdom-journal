/**
 * Header Component
 * Displays the app name and gentle subtitle
 * Customization: Update the title, subtitle, or colors in the className strings
 */

import ThemeSwitch from './ThemeSwitch';

export default function Header() {
  return (
    <header className="w-full theme-bg border-b theme-border-light px-8 py-6">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
        <div>
          {/* App title - using serif font for elegance */}
          <h1 className="font-serif text-3xl md:text-4xl theme-text mb-1">
            Aurora Journal
          </h1>

          {/* Gentle subtitle - softer color for subtle hierarchy */}
          <p className="font-sans text-sm md:text-base theme-text-light italic">
            Tiny rituals for your inner voice.
          </p>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitch />
      </div>
    </header>
  );
}
