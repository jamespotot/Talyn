# MCQ Generation System Specification

## Core Principle

**MEANING/DEFINITION = QUESTION**  
**TITLE/KEY TERM = ANSWER**

The correct answer must ALWAYS be the exact concept name (title) that matches the definition.

---

## MCQ Structure

```
QUESTION:
Full meaning / definition from document

OPTIONS:
A. Correct Answer (Title / Concept Name)
B. Distractor
C. Distractor
D. Distractor

ANSWER KEY:
Always the correct concept title
```

---

## Mode-Specific Behavior

### PURO MODE (Strict Document-Only)

**Rules:**
- Correct answer: ONLY from document topics
- Distractors: ONLY from other document topics
- No AI-generated content
- No external knowledge
- Minimum 1 distractor required (from document)

**Example:**
```
Q: A systematic, evidence-based approach to studying the physical and natural world.

A. Science
B. Mathematics  ← from document
C. Biology      ← from document
D. Geography    ← from document

ANSWER: A. Science
```

---

### TALYNO MODE (AI-Enhanced)

**Rules:**
- Correct answer: ONLY from document topics (never AI-generated)
- Distractors: Document topics FIRST, then AI-generated if needed
- AI distractors must be:
  - Same domain/subject area
  - Semantically related
  - Plausible but incorrect
  - NOT random nonsense
  - NOT variations of correct answer

**Example (AI-Enhanced):**
```
Q: The process by which plants make their own food using sunlight, water, and carbon dioxide.

A. Photosynthesis  ← from document (correct)
B. Respiration     ← from document (distractor)
C. Osmosis         ← AI-generated (related biology term)
D. Evaporation     ← AI-generated (related process)

ANSWER: A. Photosynthesis
```

---

## Distractor Quality Rules

### GOOD Distractors
✓ Same subject area (science → science terms)  
✓ Similar processes or concepts  
✓ Plausible confusion options  
✓ Common misconceptions  
✓ Semantically close but factually wrong  

### BAD Distractors
✗ Random unrelated words  
✗ Joke answers  
✗ Obvious incorrect nonsense  
✗ Copy variations of correct answer  
✗ Completely different domains  

---

## Implementation Flow

### Puro Mode Flow
1. Extract topics from document
2. For each topic, find definition sentence
3. Use definition as question
4. Use topic title as correct answer
5. Use OTHER topic titles as distractors (document-only)
6. Require minimum 1 distractor from document

### Talyno Mode Flow
1. Extract topics from document
2. For each topic, find definition sentence
3. Use definition as question
4. Use topic title as correct answer (NEVER AI-generated)
5. Use OTHER topic titles as distractors first
6. If < 3 distractors available:
   - Call AI to generate additional plausible distractors
   - AI considers: correct answer, existing distractors, document context
   - AI generates same-domain, semantically related options
7. Combine document + AI distractors (max 3 total)

---

## AI Distractor Generation Prompt Logic

When AI assistance is needed:

```
INPUT:
- Question (definition)
- Correct answer (title)
- Existing distractors (from document)
- Document topic list (for context)

OUTPUT:
- N additional plausible distractors
- Same domain as correct answer
- Believable but incorrect
- No nonsense or random words

CONSTRAINTS:
- Must be educationally meaningful
- Must test real understanding
- Must not be trivially wrong
```

---

## Examples

### Example 1: Full Document Support (Puro Mode)
```json
{
  "question": "A systematic, evidence-based approach to studying the physical and natural world through observation, experimentation, and testing of hypotheses.",
  "correctAnswer": "Science",
  "distractors": ["Mathematics", "Biology", "Geography"],
  "sourceIndex": 0
}
```

### Example 2: AI-Enhanced (Talyno Mode)
```json
{
  "question": "The process by which plants convert light energy into chemical energy stored in glucose.",
  "correctAnswer": "Photosynthesis",
  "distractors": [
    "Cellular Respiration",  // from document
    "Osmosis",               // AI-generated (related biology)
    "Transpiration"          // AI-generated (related plant process)
  ],
  "sourceIndex": 5
}
```

### Example 3: Minimal Document Topics (Talyno Mode)
```json
{
  "question": "The study of living organisms and their interactions with the environment.",
  "correctAnswer": "Biology",
  "distractors": [
    "Ecology",      // AI-generated (related field)
    "Zoology",      // AI-generated (biology subfield)
    "Botany"        // AI-generated (biology subfield)
  ],
  "sourceIndex": 2
}
```

---

## Quality Assurance

### Correct Answer Validation
- ✓ Must exist in document topics
- ✓ Must match the definition in question
- ✓ Must be exact term (no paraphrasing)

### Distractor Validation (Puro Mode)
- ✓ Must come from document topics only
- ✓ Must be different from correct answer
- ✓ Minimum 1 distractor required

### Distractor Validation (Talyno Mode)
- ✓ Document distractors used first
- ✓ AI distractors only when needed
- ✓ AI distractors must be domain-appropriate
- ✓ Total 1-3 distractors per question

---

## System Goals

Create MCQs that are:
- ✓ Concept-accurate
- ✓ Logically structured
- ✓ Educationally meaningful
- ✓ Balanced between extracted + AI-assisted content
- ✓ Designed for real learning assessment
- ✓ Preserve document integrity (correct answers always from source)
