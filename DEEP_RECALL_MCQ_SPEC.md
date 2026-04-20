# Deep Recall MCQ System - "Definition is Called" Format

## Core Rule (NON-NEGOTIABLE)

**NEVER include the correct term/title inside the question.**

If the term appears in the input:
→ YOU MUST REMOVE IT COMPLETELY  
→ CONVERT TO "[DEFINITION] is called ________." FORMAT  

**Goal: EXAM-LEVEL RECALL QUESTIONS WITH FORCED MEMORY RETRIEVAL**

---

## Question Transformation Rule

Each concept must become:

**A PURE DEFINITION SENTENCE WITH "is called ________." ENDING**

Format:
```
[Definition without term] is called ________.
```

---

## Transformation Examples

### Example 1: Ecosystem
```
INPUT CONCEPT:
Ecosystem = a community of living organisms interacting with their environment

OUTPUT QUESTION:
A community of living organisms interacting with each other and their physical environment is called ________.

OPTIONS:
A. Ecosystem
B. Energy Flow
C. Carbon Cycle
D. Biosphere

ANSWER: A. Ecosystem
```

### Example 2: Photosynthesis
```
INPUT CONCEPT:
Photosynthesis = process by which plants convert light energy into chemical energy

OUTPUT QUESTION:
The process by which plants convert light energy into chemical energy stored in glucose is called ________.

OPTIONS:
A. Photosynthesis
B. Cellular Respiration
C. Transpiration
D. Osmosis

ANSWER: A. Photosynthesis
```

### Example 3: Carbon Cycle
```
INPUT CONCEPT:
Carbon Cycle = continuous exchange of carbon between atmosphere, organisms, soil, and oceans

OUTPUT QUESTION:
A continuous natural process where carbon circulates between living organisms, soil, water, and the atmosphere through biological and physical processes is called ________.

OPTIONS:
A. Carbon Cycle
B. Water Cycle
C. Nitrogen Cycle
D. Energy Flow

ANSWER: A. Carbon Cycle
```

---

## Step-by-Step Transformation Process

### Step 1: Extract Concept
- Concept name (to be hidden)
- Definition from document
- Related keywords

### Step 2: Remove Answer Term
- Scan definition for answer term
- Remove ALL instances of the term
- Keep definition meaning intact

### Step 3: Add "is called ________." Format
- Append "is called ________." to cleaned definition
- Ensure grammatical correctness
- Maintain natural sentence flow

### Step 4: Generate Options
- Correct answer = original concept title
- Distractors = other document topics OR AI-generated same-domain terms

---

## BAD vs GOOD Transformations

### ❌ BAD (Answer Leaked)
```
Q: The carbon cycle is an important process in ecosystems.
A. Carbon Cycle  ← Answer visible in question!
```

### ❌ BAD (No Blank Format)
```
Q: A process where carbon moves between atmosphere and organisms.
A. Carbon Cycle  ← Missing "is called ________" format
```

### ✅ GOOD (Proper Format)
```
Q: A natural process in which an element circulates between the atmosphere, living organisms, soil, and oceans is called ________.
A. Carbon Cycle  ← Answer hidden, proper format
```

---

## Multiple Topics Handling

Each concept MUST become:
- 1 separate question
- No merging of concepts
- No keyword grouping

Example:
- Ecosystem → "A community of living organisms... is called ________." 
- Energy Flow → "The transfer of energy through organisms... is called ________." 
- Carbon Cycle → "A process where carbon circulates... is called ________." 

---

## Distractor Rules

### Puro Mode (Document-Only)
- Use other topic titles from document
- Minimum 1 distractor required
- All distractors must be from source

### Talyno Mode (AI-Enhanced)
- Use document topics first
- If < 3 distractors, AI generates additional
- AI distractors must be:
  - Same domain/subject area
  - Plausible but incorrect
  - Semantically related
  - NOT variations of correct answer

---

## Implementation Logic

### Puro Mode Flow
```
1. Extract topic title and definition sentence
2. Remove answer term from definition
3. Add "is called ________." ending
4. Use other document topics as distractors
5. Require minimum 1 distractor
```

### Talyno Mode Flow
```
1. Extract topic title and definition
2. AI rewrites definition removing answer term
3. AI adds "is called ________." format
4. AI uses document topics as distractors first
5. AI generates additional distractors if needed
6. Ensure 1-3 distractors total
```

---

## Why This Format Works

✅ **Forces active recall** → Must retrieve term from memory  
✅ **No visual scanning** → Can't find answer in question  
✅ **Exam-level difficulty** → Tests true understanding  
✅ **Clear structure** → Consistent "is called" format  
✅ **Natural language** → Reads like a proper question  

---

## Quality Checklist

Before finalizing an MCQ:

- [ ] Answer term does NOT appear in question
- [ ] Question ends with "is called ________."
- [ ] Definition is clear and complete
- [ ] Correct answer matches the definition
- [ ] Distractors are plausible alternatives
- [ ] All options from same domain
- [ ] Grammatically correct sentence
- [ ] No obvious giveaways

---

## Final Output Goal

You are NOT generating notes.

You are generating:
→ **EXAM-LEVEL RECALL QUESTIONS**  
→ **WITH HIDDEN ANSWERS**  
→ **FORCED MEMORY RETRIEVAL**  
→ **CONSISTENT "IS CALLED" FORMAT**
