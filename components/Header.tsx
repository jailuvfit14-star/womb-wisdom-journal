/**
 * Header Component
 * Displays the app name and gentle subtitle
 * Customization: Update the title, subtitle, or colors in the className strings
 */

export default function Header() {
  return (
    <header className="w-full bg-cream-50 border-b border-cream-200 px-8 py-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* App title - using serif font for elegance */}
        <h1 className="font-serif text-3xl md:text-4xl text-cocoa-700 mb-1">
          Aurora Journal
        </h1>

        {/* Gentle subtitle - softer color for subtle hierarchy */}
        <p className="font-sans text-sm md:text-base text-cocoa-400 italic">
          Tiny rituals for your inner voice.
        </p>
      </div>
    </header>
  );
}
