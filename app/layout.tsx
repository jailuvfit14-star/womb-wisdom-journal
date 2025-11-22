/**
 * Root Layout
 * Sets up the HTML structure, fonts, and global styles
 * Customization: Update metadata or add additional providers
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aurora Journal - Tiny rituals for your inner voice',
  description: 'A soft, ethereal journaling space for sensitive, creative souls.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
