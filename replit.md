# Aurora Journal - Replit Project

## Overview
Aurora Journal is a soft, ethereal journaling web app designed for sensitive, creative souls. It features a beautiful markdown editor with live preview and uses browser localStorage for data persistence. The app has been configured to run on Replit's environment.

**Project Type:** Next.js 14 (App Router) frontend application  
**Last Updated:** November 22, 2025

## Recent Changes
- **Nov 22, 2025:** Initial Replit setup completed
  - Configured Next.js to run on port 5000 with host 0.0.0.0
  - Added CORS headers for Replit proxy compatibility
  - Set up deployment configuration for autoscale
  - Created workflow for development server

## Project Architecture

### Tech Stack
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3 with custom color palette
- **Icons:** Lucide React
- **Markdown:** React Markdown for rendering
- **Storage:** Browser localStorage (client-side only)
- **PDF/Export:** html2canvas and jspdf libraries

### Project Structure
```
aurora-journal/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Main journaling page with state management
│   └── globals.css        # Global styles and Tailwind directives
├── components/            # React components
│   ├── Header.tsx         # App header with branding
│   ├── Sidebar.tsx        # Entry list sidebar
│   └── Editor.tsx         # Markdown editor with preview
├── lib/                   # Utilities
│   ├── storage.ts         # LocalStorage CRUD operations
│   └── pdfGenerator.ts    # PDF export functionality
├── types/                 # TypeScript definitions
│   └── journal.ts         # Journal entry types
└── [config files]         # Next.js, Tailwind, TypeScript configs
```

### Key Features
- Beautiful markdown editor with live preview toggle
- Sidebar navigation for browsing entries
- Full CRUD operations (Create, Read, Update, Delete)
- LocalStorage persistence (no backend required)
- Responsive design (desktop and tablet)
- Warm, calming aesthetic with custom color palette
- Export capabilities (PDF generation)

### Data Storage
All journal entries are stored in the browser's localStorage. No backend server or database is used. This means:
- Data is private and never leaves the user's device
- Data persists across browser sessions
- Data is specific to the browser/device being used
- Clearing browser data will remove all entries

## Replit Configuration

### Development
- **Port:** 5000
- **Host:** 0.0.0.0 (required for Replit proxy)
- **Workflow:** "Next.js Dev Server" runs `npm run dev`
- **Dev Server:** Next.js development server with hot reload

### Deployment
- **Type:** Autoscale (stateless frontend)
- **Build:** `npm run build`
- **Start:** `npm start`
- **Port:** 5000 (configured in package.json)

### Environment Notes
- No environment variables or secrets required
- No database connections
- No external API integrations in base setup
- All dependencies are managed via npm/package.json

## Color Palette
Custom Tailwind colors defined in `tailwind.config.ts`:
- **blush:** Soft pink tones (#f8d7da, #f4c2c7, #e8a6ad)
- **cream:** Warm neutral backgrounds (#faf8f6, #f5f2ed, #e8e3db)
- **clay:** Terracotta accents (#d4a79a, #c8917f, #b87b64)
- **cocoa:** Text and borders (#6b5b55, #4a3f3a, #2d2421)

## User Preferences
None specified yet - this section will be updated as preferences are expressed.

## Development Notes
- The app uses client-side rendering exclusively (`'use client'` directive)
- Hydration is prevented during initial load by checking localStorage after mount
- All state management is handled with React useState hooks
- No server-side rendering or API routes are used

## Future Enhancement Ideas
- Export entries as PDF or markdown files ✓ (PDF library already included)
- Search and filter functionality
- Tags and categories
- Dark mode toggle
- Backup/restore functionality
- Custom themes
- Cloud sync option
