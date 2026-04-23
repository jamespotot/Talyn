# Talyn

**A document-based study material generator that transforms your notes into structured learning tools.**

---

## 📖 What is Talyn?

Talyn is an AI-powered web application that converts documents (PDF, DOCX, TXT) or manual text input into interactive study materials:

- **Flashcards** — Term-definition pairs extracted from your content
- **Fill-in-the-Blank Quizzes** — Sentences with key terms masked
- **Multiple Choice Questions (MCQ)** — Exam-style questions with distractors

Talyn operates in two modes:

1. **Puro Mode** — Strict preservation of original text. Zero paraphrasing or rewriting.
2. **Talyno Mode** — AI-enhanced questions with explanations, hints, and exam-quality phrasing.

---

## 🎯 Purpose

Talyn helps students, educators, and professionals:

- **Save time** — Automatically generate study materials from lecture notes, textbooks, or documentation
- **Preserve accuracy** — Puro Mode ensures content fidelity for technical or legal material
- **Enhance learning** — Talyno Mode provides adaptive, exam-style questions with reasoning
- **Study efficiently** — Switch between flashcards, fill-in-the-blank, and MCQ formats on-demand

---

## 🚀 How to Use

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/talyn.git
cd talyn

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GROQ_API_KEY and SUPABASE credentials to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Process Flow

**Step 1: Upload or Paste Content**
- Upload a document (PDF, DOCX, TXT) or paste text directly
- Talyn extracts and cleans the text

**Step 2: Review Analysis**
- AI analyzes your document and extracts key topics, keywords, and concept types
- Review and confirm the detected topics (edit or remove as needed)

**Step 3: Select Mode & Quiz Type**
- Choose **Puro Mode** (strict preservation) or **Talyno Mode** (AI-enhanced)
- Select quiz type: Flashcards, Fill-in-the-Blank, or Multiple Choice

**Step 4: Study**
- Navigate through generated questions
- Switch between quiz types on-demand (lazy-loaded)
- Track progress and review explanations (Talyno Mode only)

**Step 5: Start Over**
- Click "New Document" to upload another file

---

## ✨ Features

### Core Features
- **Multi-format document parsing** — PDF, DOCX, TXT support
- **AI-powered topic extraction** — Automatic concept identification and categorization
- **Dual learning modes** — Puro (strict) and Talyno (adaptive)
- **Three quiz formats** — Flashcards, Fill-in-the-Blank, MCQ
- **On-demand generation** — Switch quiz types without re-uploading
- **Dark/Light theme** — Persistent theme toggle with system preference detection

### Puro Mode
- Zero content modification
- Verbatim extraction from source text
- Distractors pulled only from document topics
- Ideal for technical, legal, or medical content

### Talyno Mode
- Exam-quality question phrasing
- Intelligent distractor generation
- Explanations for correct and incorrect answers
- Contextual hints (anti-leak protected)
- Adaptive difficulty based on concept type

### UI/UX
- Clean, academic design (Karla + Inconsolata fonts)
- Minimal, distraction-free interface
- Responsive layout (mobile-first)
- Smooth transitions and loading states
- Mode indicator badge

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** — React framework with API routes
- **TypeScript** — Type-safe development
- **CSS Modules** — Scoped styling
- **React 19** — UI library

### Backend / API
- **Next.js API Routes** — Serverless functions
- **Groq AI** — LLM for document analysis and question generation

### Document Parsing
- **pdf-parse** — PDF text extraction
- **mammoth** — DOCX to HTML/text conversion
- **formidable** — File upload handling

### Deployment
- **Vercel** — Recommended (zero-config Next.js deployment)
- **Node.js 20+** — Runtime environment

---

## 📁 File Structure

```
talyn/
│
├── pages/
│   ├── index.tsx              # Main app (upload → analysis → quiz flow)
│   ├── _app.tsx               # Global app wrapper (theme, favicon)
│   └── api/
│       ├── analyze.ts         # AI document analysis endpoint
│       ├── generate.ts        # Quiz generation endpoint (Puro + Talyno)
│       └── parse-pdf.ts       # File upload & text extraction
│
├── components/
│   ├── Upload.tsx             # File upload + manual text input
│   ├── AnalysisReview.tsx     # Topic confirmation UI
│   ├── ModeSelector.tsx       # Puro/Talyno + quiz type selection
│   ├── Flashcards.tsx         # Flashcard viewer (flip animation)
│   ├── FillInBlankQuiz.tsx    # Fill-in-the-blank quiz UI
│   └── MCQQuiz.tsx            # Multiple choice quiz UI
│
├── core/
│   ├── puroEngine.ts          # Puro Mode logic (strict extraction)
│   └── validator.ts           # Input validation utilities
│
├── lib/
│   ├── groq.ts                # Groq AI API wrapper
│   └── supabase.ts            # Supabase client (optional)
│
├── parsers/
│   └── fileParser.ts          # PDF/DOCX/TXT parsing logic
│
├── styles/
│   ├── globals.css            # Global styles + CSS variables (theme)
│   └── Home.module.css        # Main page styles
│
├── public/
│   ├── talyn-logo-final.png           # Logo (header)
│   └── talyn-logo-final-modified.png  # Favicon
│
├── .env.local                 # Environment variables (API keys)
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

---

## 🎨 Design Philosophy

**Goal:** Create a calm, distraction-free learning environment that feels like a digital study workspace.

### Visual Identity
- **Typography:** Karla (UI), Inconsolata (content)
- **Color Palette:**
  - Light mode: Off-white background (#F7F7F5), near-black text (#1C1C1C)
  - Dark mode: Deep navy background, soft white text
  - Accent: Calm sky blue (#4A90E2)
- **Layout:** Grid-based, 8px spacing scale, generous white space
- **Components:** Rounded rectangles (8px radius), soft shadows, subtle hover states

### Principles
- Minimal UI noise
- High readability on all devices
- Academic, not gamified
- Focus on content, not decoration

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url (optional)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key (optional)
```

### API Keys
- **Groq API:** Sign up at [groq.com](https://groq.com) for LLM access

---

## 🚧 Future Features

- [ ] Source highlighting per question
- [ ] Difficulty adjustment via masking level
- [ ] Export to PDF reviewer
- [ ] Study progress tracking system
- [ ] Spaced repetition algorithm
- [ ] Multi-user support with authentication
- [ ] Custom quiz templates

---

## 📄 License

MIT License — Free to use and modify.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ for learners who value accuracy and efficiency.**
