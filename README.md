# Aurora Journal ✨

A soft, ethereal journaling web app designed for sensitive, creative souls. Built with a womb-healing aesthetic featuring warm neutrals, blush tones, and gentle rounded corners.

## 🌸 Features

- **Beautiful Markdown Editor**: Write journal entries with markdown support and live preview
- **Sidebar Navigation**: Browse all your entries with titles and dates
- **LocalStorage Persistence**: All entries are saved locally in your browser (no backend required)
- **CRUD Operations**: Create, read, update, and delete journal entries
- **Responsive Design**: Works beautifully on desktop and tablet
- **Calming Aesthetic**: Warm color palette with blush, cream, soft clay, and muted cocoa tones

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **React Markdown** for markdown rendering
- **Lucide React** for icons

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
aurora-journal/
├── app/
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Main journaling page with state management
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   ├── Header.tsx          # App header with branding
│   ├── Sidebar.tsx         # Entry list sidebar
│   └── Editor.tsx          # Markdown editor with preview
├── lib/
│   └── storage.ts          # LocalStorage utilities for CRUD operations
├── types/
│   └── journal.ts          # TypeScript type definitions
├── tailwind.config.ts      # Tailwind configuration with custom colors
└── package.json
```

## 🎨 Customization

### Colors
Update the color palette in `tailwind.config.ts`:
- `blush` - Soft pink tones
- `cream` - Warm neutral backgrounds
- `clay` - Terracotta accents
- `cocoa` - Text and borders

### Fonts
Change fonts in `app/layout.tsx`:
- Serif: Currently using Playfair Display
- Sans-serif: Currently using Inter

### Copy & Text
Update text content in:
- `components/Header.tsx` - App title and subtitle
- `components/Editor.tsx` - Placeholder text
- `components/Sidebar.tsx` - Empty state message

### Styling
All components use Tailwind utility classes. Modify className strings directly in each component to adjust:
- Spacing
- Colors
- Border radius
- Hover effects

## 📝 How It Works

1. **Creating Entries**: Click "New Entry" to start a new journal entry
2. **Editing**: Type your title and content. Use markdown for formatting
3. **Preview**: Toggle between edit and preview mode
4. **Saving**: Click "Save Entry" to persist to localStorage
5. **Browsing**: Click any entry in the sidebar to load it
6. **Deleting**: Hover over an entry and click the trash icon

## 🔒 Privacy

All journal entries are stored locally in your browser's localStorage. Nothing is sent to any server. Your entries remain completely private on your device.

## 🌙 Future Enhancements

Potential features to add:
- Export entries as PDF or markdown files
- Search and filter functionality
- Tags and categories
- Dark mode toggle
- Backup/restore functionality
- Custom themes

## 📄 License

This project is open source and available for personal use.

---

*Tiny rituals for your inner voice.* 🌸
