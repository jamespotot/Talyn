# Talyn Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account (optional for now)

## Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials (optional for basic functionality)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`

## Features Available

- Upload documents (TXT, PDF, DOCX)
- Manual text input
- Generate flashcards
- Generate fill-in-the-blank quizzes
- Generate multiple choice questions
- Puro Mode (zero content modification)

## Project Structure

```
talyn/
├── components/       # React components
├── core/            # Puro Engine logic
├── lib/             # Supabase client
├── pages/           # Next.js pages
├── parsers/         # File parsers
├── styles/          # CSS modules
└── README.md
```

## Design System

- **Fonts**: Karla (UI), Inconsolata (content)
- **Colors**: 
  - Background: #F8F8F6
  - Text: #1A1A1A
  - Accent: #4F7CFF
  - Borders: #E6E6E6
- **Style**: Modern, minimal, academic, premium learning platform
- **Full Specs**: See `DESIGN_SYSTEM.md` for complete design documentation

## Next Steps

- Test with sample documents
- Customize quiz generation parameters
- Add Supabase integration for saving progress
- Export to PDF functionality
