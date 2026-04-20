export type ConceptType = 'definition' | 'process' | 'comparison' | 'function' | 'identification' | 'purpose';

export interface Flashcard {
  term: string;
  definition: string;
  sourceIndex: number;
}

export interface FillInBlank {
  sentence: string;
  blank: string;
  answer: string;
  sourceIndex: number;
  metadata?: {
    topic?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  };
}

export interface MCQ {
  question: string;
  correctAnswer: string;
  distractors: string[];
  sourceIndex: number;
  explanation?: string;
  hint?: string;
  metadata?: {
    topic?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    conceptType?: ConceptType;
    domain?: string;
  };
}

export interface Topic {
  title: string;
  keywords: string[];
  conceptType?: ConceptType;
  domain?: string;
  definition?: string; // full source sentence from analyze step
}

// ─── Anti-Leak Core ───────────────────────────────────────────────────────────

/**
 * Returns true if the answer term (or any of its words) appears in the question.
 * This is the CRITICAL anti-leak check.
 */
export function answerLeaksIntoQuestion(question: string, answer: string): boolean {
  const qLower = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const aWords = answer.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  // Full phrase match
  if (qLower.includes(answer.toLowerCase())) return true;
  // All significant words of answer appear in question
  if (aWords.length > 1 && aWords.every(w => qLower.includes(w))) return true;
  return false;
}

/**
 * Remove all occurrences of the answer term from a sentence.
 * Handles multi-word terms and partial word matches.
 */
function stripAnswerFromSentence(sentence: string, answer: string): string {
  const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Remove full phrase (case-insensitive)
  let result = sentence.replace(new RegExp(escaped, 'gi'), '').trim();
  // Clean up double spaces and leading/trailing punctuation artifacts
  result = result.replace(/\s{2,}/g, ' ').replace(/^[,;:\s]+|[,;:\s]+$/g, '').trim();
  return result;
}

// ─── Adaptive Question Phrasing ───────────────────────────────────────────────

/**
 * Builds a clean, exam-style question from a definition sentence.
 * Style is chosen based on conceptType — NOT a fixed template.
 * Answer term is ALWAYS removed from the output.
 */
export function buildAdaptiveQuestion(sentence: string, answer: string, conceptType: ConceptType = 'definition'): string {
  const stripped = stripAnswerFromSentence(sentence, answer);

  // Verify strip worked — if answer still leaks, force generic form
  if (answerLeaksIntoQuestion(stripped, answer)) {
    return `Which term is described as: "${stripped.trim()}"?`;
  }

  switch (conceptType) {
    case 'definition':
      // "X is a Y" → "What is the term for Y?"
      return `What term refers to ${stripped.replace(/^(is|are|refers to|is defined as)\s*/i, '').trim()}?`;

    case 'function':
      return `Which concept is responsible for ${stripped.replace(/^(is used to|is responsible for|enables|allows|provides)\s*/i, '').trim()}?`;

    case 'process':
      return `Which process involves ${stripped.replace(/^(involves|consists of|is the process of)\s*/i, '').trim()}?`;

    case 'purpose':
      return `What is the name of the mechanism designed to ${stripped.replace(/^(is designed to|is used to|allows|enables)\s*/i, '').trim()}?`;

    case 'comparison':
      return `Which term is distinguished by the following characteristic: ${stripped.trim()}?`;

    case 'identification':
      return `What is the specific name for ${stripped.replace(/^(is a|is an|is the)\s*/i, '').trim()}?`;

    default:
      return `Which of the following best describes: "${stripped.trim()}"?`;
  }
}

// ─── PuroEngine ───────────────────────────────────────────────────────────────

export class PuroEngine {
  private sentences: { text: string; index: number }[] = [];
  private topics: Topic[] = [];

  constructor(text: string, topics: Topic[] = []) {
    this.topics = topics;
    this.sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .map((text, index) => ({ text, index }));
  }

  private findDefinitionSentence(topic: Topic): { text: string; index: number } | null {
    // Prefer the pre-extracted definition from analyze step
    if (topic.definition && topic.definition.length > 10) {
      return { text: topic.definition, index: 0 };
    }

    const titleLower = topic.title.toLowerCase();
    const kwLower = topic.keywords.map(k => k.toLowerCase());

    const byTitle = this.sentences.filter(s => s.text.toLowerCase().includes(titleLower));
    if (byTitle.length) return byTitle[0];

    const scored = this.sentences.map(s => ({
      s,
      score: kwLower.filter(k => s.text.toLowerCase().includes(k)).length,
    }));
    const best = scored.sort((a, b) => b.score - a.score)[0];
    return best?.score > 0 ? best.s : null;
  }

  private pickUnique<T>(pool: T[], count: number): T[] {
    return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
  }

  generateFlashcards(count = 15): Flashcard[] {
    const results: Flashcard[] = [];
    for (const topic of this.pickUnique(this.topics, count)) {
      const defSentence = this.findDefinitionSentence(topic);
      if (!defSentence) continue;
      results.push({
        term: topic.title,
        definition: defSentence.text,
        sourceIndex: defSentence.index,
      });
    }
    return results;
  }

  generateFillInBlanks(count = 15): FillInBlank[] {
    const results: FillInBlank[] = [];
    for (const topic of this.pickUnique(this.topics, count)) {
      const defSentence = this.findDefinitionSentence(topic);
      if (!defSentence) continue;

      const words = defSentence.text.split(' ');
      if (words.length < 5) continue;

      const titleWords = topic.title.toLowerCase().split(' ');
      const titleIdx = words.findIndex(w =>
        titleWords.some(t => w.toLowerCase().replace(/[^a-z]/g, '') === t)
      );

      const kwLower = topic.keywords.map(k => k.toLowerCase());
      const kwIdx = words.findIndex(w =>
        kwLower.some(k => w.toLowerCase().includes(k)) &&
        !titleWords.includes(w.toLowerCase().replace(/[^a-z]/g, ''))
      );

      const targetIdx = titleIdx >= 0 ? titleIdx : kwIdx >= 0 ? kwIdx : Math.floor(words.length / 2);
      const answer = words[targetIdx].replace(/[^a-zA-Z0-9]/g, '');
      if (!answer) continue;

      const masked = [...words];
      masked[targetIdx] = '______';
      results.push({
        sentence: masked.join(' '),
        blank: '______',
        answer,
        sourceIndex: defSentence.index,
        metadata: {
          topic: topic.title,
          difficulty: words.length > 15 ? 'Hard' : words.length > 10 ? 'Medium' : 'Easy',
        },
      });
    }
    return results;
  }

  generateMCQs(count = 15, useAIDistractors = false): MCQ[] {
    const results: MCQ[] = [];
    const allTitles = this.topics.map(t => t.title);
    if (allTitles.length < 1) return results;

    for (const topic of this.pickUnique(this.topics, count)) {
      const defSentence = this.findDefinitionSentence(topic);
      if (!defSentence) continue;

      // Build adaptive question — answer is NEVER in the question
      const question = buildAdaptiveQuestion(
        defSentence.text,
        topic.title,
        topic.conceptType ?? 'definition'
      );

      // QC: reject if answer still leaks
      if (answerLeaksIntoQuestion(question, topic.title)) continue;

      const documentDistractors = allTitles
        .filter(t => t !== topic.title)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (!useAIDistractors && documentDistractors.length < 1) continue;

      const wordCount = defSentence.text.split(' ').length;
      results.push({
        question,
        correctAnswer: topic.title,
        distractors: documentDistractors,
        sourceIndex: defSentence.index,
        metadata: {
          topic: topic.title,
          difficulty: wordCount > 20 ? 'Hard' : wordCount > 12 ? 'Medium' : 'Easy',
          conceptType: topic.conceptType,
          domain: topic.domain,
        },
      });
    }
    return results;
  }
}
