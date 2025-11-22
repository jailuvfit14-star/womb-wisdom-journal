# Aurora Journal ✨

A soft, ethereal journaling web app designed for sensitive, creative souls. Built with a womb-healing aesthetic featuring warm neutrals, blush tones, and gentle rounded corners.

## 🌸 Features

- **Beautiful Markdown Editor**: Write journal entries with markdown support and live preview
- **AI Reflection Prompts**: Get personalized, gentle journaling prompts based on your last entry
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
- **OpenAI API** for AI-powered reflection prompts

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure OpenAI API (for AI Reflection feature):**
   - Copy `.env.local.example` to `.env.local`
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add your key to `.env.local`:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - Note: The app will work without this, but the "Reflect With Me" feature requires it

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
aurora-journal/
├── app/
│   ├── api/
│   │   └── reflect/
│   │       └── route.ts    # API endpoint for AI reflection prompts
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Main journaling page with state management
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   ├── Header.tsx          # App header with branding
│   ├── Sidebar.tsx         # Entry list sidebar
│   ├── Editor.tsx          # Markdown editor with preview
│   └── ReflectionModal.tsx # AI reflection prompt modal
├── lib/
│   └── storage.ts          # LocalStorage utilities for CRUD operations
├── types/
│   └── journal.ts          # TypeScript type definitions
├── tailwind.config.ts      # Tailwind configuration with custom colors
├── .env.local.example      # Environment variables template
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
7. **AI Reflection**: Click "Reflect With Me" to get a personalized journaling prompt based on your last saved entry

## 🔒 Privacy

All journal entries are stored locally in your browser's localStorage. Your entries remain completely private on your device.

**Note about AI Reflection:** When you use the "Reflect With Me" feature, your most recent journal entry is sent to OpenAI's API to generate a personalized reflection prompt. This is the only feature that sends data externally. You can use the app without this feature for complete offline privacy.

## 🌙 Future Enhancements

Potential features to add:
- Export entries as PDF or markdown files
- Search and filter functionality
- Tags and categories
- Dark mode toggle
- Backup/restore functionality
- Custom themes
- Mood tracking
- Voice journaling

## 📄 License

This project is open source and available for personal use.

---

*Tiny rituals for your inner voice.* 🌸
