# Talyn

## Overview
Talyn is a document-based reviewer platform that converts user-provided content into structured study materials such as flashcards, quizzes, and multiple-choice exams.

It strictly preserves original content without rewriting or modifying meaning.

Core principle:
AI is used for structure, not content alteration.

---

## Core Feature: Puro Mode
Puro Mode ensures that all generated outputs are directly derived from the original text with zero modification.

Rules:
- No paraphrasing
- No rewriting
- No content alteration
- All questions and answers must be traceable to the source text

---

## Input Methods
1. File Upload
   - DOCX
   - PDF
   - TXT
   - Other text-based formats

2. Manual Input
   - Direct text input via textarea

---

## Output Features

### Flashcards
- Term → Exact sentence definition from source
- No modification of content

### Fill-in-the-Blank
- Original sentence with selected words masked
- Structure remains unchanged

### Multiple Choice (MCQ)
- Question: Exact sentence from document
- Correct answer: Extracted key term from same sentence
- Distractors: Taken only from other parts of the same document

---

## System Flow
1. Input ingestion (file or text)
2. Text extraction and cleaning
3. Sentence segmentation
4. Content structuring (no rewriting)
5. Reviewer generation

---sss

## Project Structure

talyn/
│
├── frontend/
│   ├── pages/
│   │   └── index.tsx
│   ├── components/
│   ├── styles/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── parsers/   (PDF, DOCX, TXT extraction)
│
├── core/
│   ├── puroEngine.ts
│   ├── quizGenerator.ts
│
├── uploads/
├── config/
└── README.md

## Database
- Supabase

---

## Core Engine
PuroEngine is the heart of the system:
- Ensures zero content modification
- Extracts structured learning elements
- Maintains alignment between source and output

---

## Future Features
- Source highlighting per question
- Difficulty adjustment via masking level
- Export to PDF reviewer
- Study progress tracking system

---

## Goal
To create a reviewer system that preserves exact knowledge from user materials while transforming it into effective study formats.

## Design

You are a senior UI/UX designer and frontend design system architect.

Your task is to design the visual identity and UI direction for a web application called "Talyn".

Talyn is a clean, learning-focused reviewer platform that converts user documents into study tools (flashcards, quizzes, and exams). The UI must support focus, readability, and academic clarity.

---

## DESIGN GOAL
Create a clean, distraction-free learning environment that feels:
- Minimal
- Academic
- Structured
- Calm
- Highly readable

The interface should feel like a modern study tool, not a game or entertainment app.

---

## VISUAL STYLE REQUIREMENTS

### 1. Typography
Primary font:
- Karla (for UI text, headings, labels)

Secondary font:
- Inconsolata (for code, extracted content, and raw text display)

Font rules:
- Use large spacing for readability
- Avoid decorative or playful fonts
- Prioritize clarity over style

---

### 2. COLOR SYSTEM

Base theme:
- Light, neutral, and soft academic palette

Suggested colors:
- Background: off-white / soft gray (#F7F7F5 or similar)
- Primary text: near-black (#1C1C1C)
- Secondary text: muted gray (#6B6B6B)
- Accent color: calm blue or soft indigo (used sparingly for buttons and highlights)
- Borders: very light gray (#E5E5E5)

Rules:
- No neon colors
- No saturated gradients
- No distracting backgrounds

---

### 3. LAYOUT STYLE

Principles:
- Grid-based layout
- Strong spacing system (8px or 12px base scale)
- Clear separation between sections
- White space is important

Structure:
- Left sidebar (optional navigation)
- Main content centered or wide reading layout
- Cards for quizzes and flashcards
- Minimal UI noise

---

### 4. COMPONENT STYLE

Buttons:
- Simple rounded rectangles (6–10px radius)
- No heavy shadows
- Subtle hover states only

Cards:
- Clean borders or soft shadow
- High padding for readability
- Clearly separated question and answer sections

Inputs:
- Large, readable text areas
- Soft borders
- Focus highlight in accent color only

---

### 5. LEARNING EXPERIENCE FEEL

The UI should feel like:
- A digital notebook
- A study workspace
- A structured knowledge system

NOT:
- A game
- A social media app
- A flashy AI tool

---

## SPECIAL FEATURE VISUAL DESIGN

### Puro Mode Indicator
- Simple toggle or badge
- Label: "Puro Mode Active"
- Color: neutral or soft green/blue
- Must visually communicate "strict no-modification mode"

---

## RESPONSIVENESS

- Mobile-first layout support
- Study cards must stack cleanly on small screens
- Text readability must remain high on all devices

---

## OUTPUT EXPECTATION

Provide:
1. Full UI/UX design direction summary
2. Color palette (hex codes)
3. Typography usage rules
4. Component style guidelines
5. Layout structure suggestion
6. Overall design philosophy statement

Keep the output clean, structured, and implementation-ready for a frontend developer using Next.js.