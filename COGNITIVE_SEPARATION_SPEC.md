# Cognitive Separation System Specification

## Core Principle

**QUESTION CONTENT MUST NEVER CONTAIN METADATA**

All learning content must be PURE QUESTION ONLY.
Labels, hints, and metadata are displayed in a separate UI container.

---

## Architecture

### 1. Data Layer (puroEngine.ts)

```typescript
interface MCQ {
  question: string;           // PURE question text only
  correctAnswer: string;
  distractors: string[];
  sourceIndex: number;
  metadata?: {                // SEPARATE metadata object
    topic?: string;
    category?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  };
}
```

### 2. UI Layer (Components)

```
┌─────────────────────────────────────┐
│ METADATA CONTAINER (separate)      │
│ ┌─────────┐ ┌──────────┐          │
│ │ Topic   │ │ Difficulty│          │
│ └─────────┘ └──────────┘          │
├─────────────────────────────────────┤
│ QUESTION CONTAINER (pure)          │
│                                     │
│ A conceptual framework developed   │
│ by ISO that divides network        │
│ communication into seven layers    │
│ is called ________.                │
│                                     │
└─────────────────────────────────────┘
```

---

## Rules

### ✅ CORRECT OUTPUT

**Question Text:**
```
A conceptual framework developed by ISO that divides network 
communication into seven layers is called ________.
```

**Metadata (separate UI):**
- Topic: Networking Models
- Difficulty: Medium

---

### ❌ FORBIDDEN OUTPUT

```
❌ Networking Models OSI Model A conceptual framework...
❌ OSI Model (Networking Models) A conceptual framework...
❌ [Topic: OSI Model] A conceptual framework...
❌ Hint: Networking - A conceptual framework...
```

**All of these contaminate the question area.**

---

## Implementation

### Engine Rule (puroEngine.ts)

```typescript
// ✅ CORRECT: Metadata separate from question
{
  question: "A conceptual framework... is called ________.",
  correctAnswer: "OSI Model",
  metadata: {
    topic: "Networking Models",
    difficulty: "Medium"
  }
}

// ❌ INCORRECT: Metadata in question
{
  question: "[Networking] A conceptual framework... is called ________.",
  correctAnswer: "OSI Model"
}
```

### UI Rule (Components)

```tsx
// ✅ CORRECT: Separate containers
<div className={styles.card}>
  {mcq.metadata && (
    <div className={styles.metadata}>
      <span className={styles.topic}>{mcq.metadata.topic}</span>
      <span className={styles.difficulty}>{mcq.metadata.difficulty}</span>
    </div>
  )}
  <p className={styles.question}>{mcq.question}</p>
</div>

// ❌ INCORRECT: Mixed content
<p className={styles.question}>
  {mcq.metadata?.topic}: {mcq.question}
</p>
```

---

## Design Goal

This system behaves like:
- **Exam paper** = clean question only
- **Teacher notes** = separate side panel
- **No mixed information layers**

### Result:
✔ High cognitive load (good for learning)  
✔ No visual hints inside question  
✔ Clean UI separation  
✔ Professional quiz system behavior  

---

## Validation Checklist

Before generating any quiz output:

1. [ ] Question text contains ONLY the definition/sentence
2. [ ] Question ends with blank (________)
3. [ ] NO topic labels in question text
4. [ ] NO category names in question text
5. [ ] NO hint tags in question text
6. [ ] Metadata stored in separate `metadata` object
7. [ ] UI displays metadata in separate container
8. [ ] Clear visual separation between metadata and question

---

## Difficulty Calculation

Automatic difficulty assignment based on complexity:

### Fill-in-the-Blank
- **Easy**: < 10 words
- **Medium**: 10-15 words
- **Hard**: > 15 words

### Multiple Choice
- **Easy**: < 12 words in definition
- **Medium**: 12-20 words in definition
- **Hard**: > 20 words in definition

---

## CSS Architecture

```css
/* Metadata container - visually separate */
.metadata {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(15, 50, 99, 0.06);
}

/* Topic badge */
.topic {
  font-size: 11px;
  font-weight: 600;
  color: rgba(15, 50, 99, 0.5);
  background: rgba(134, 206, 231, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

/* Question content - pure and clean */
.question {
  font-size: 16px;
  line-height: 1.8;
  font-family: 'Inconsolata', monospace;
  color: #0F172A;
}
```

---

## Benefits

1. **Cognitive Clarity**: Students see pure questions without hints
2. **Exam Realism**: Mimics real test conditions
3. **Memory Activation**: Forces genuine recall, not recognition
4. **Professional UI**: Clean separation of concerns
5. **Scalability**: Easy to add more metadata without polluting questions

---

## Future Enhancements

- Category tags (e.g., "Conceptual", "Factual", "Applied")
- Source highlighting (link to original document section)
- Custom metadata fields per quiz type
- Metadata filtering/sorting in quiz selection

---

## Enforcement

**IF label appears inside question text:**
→ INVALID OUTPUT  
→ MUST REGENERATE QUESTION  

**ONLY ACCEPTABLE PLACE FOR LABELS:**
→ Separate metadata UI container  
→ Sidebar  
→ Card header outside question body  

---

## Summary

The Cognitive Separation System ensures that:
- Questions remain pure and uncontaminated
- Metadata is displayed separately and clearly
- UI architecture supports focused learning
- System behavior matches professional exam standards
