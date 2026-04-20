import { MCQ, FillInBlank, answerLeaksIntoQuestion } from './puroEngine';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class CognitiveSeparationValidator {
  private static FORBIDDEN_PATTERNS = [
    /\[.*?\]/,
    /\(.*?:\s*.*?\)/,
    /^[A-Z][a-z]+\s*[-:]\s*/,
    /hint:/i,
    /category:/i,
    /topic:/i,
  ];

  static validateMCQ(mcq: MCQ): ValidationResult {
    const errors: string[] = [];

    for (const pattern of this.FORBIDDEN_PATTERNS) {
      if (pattern.test(mcq.question)) {
        errors.push(`Question contains forbidden pattern: ${pattern.source}`);
      }
    }

    // Anti-leak: answer must never appear in question (works for all adaptive styles)
    if (answerLeaksIntoQuestion(mcq.question, mcq.correctAnswer)) {
      errors.push(`ANTI-LEAK FAIL: answer "${mcq.correctAnswer}" found in question`);
    }

    if (mcq.metadata?.topic && mcq.question.toLowerCase().includes(mcq.metadata.topic.toLowerCase())) {
      errors.push(`Question contains topic label: "${mcq.metadata.topic}"`);
    }

    return { valid: errors.length === 0, errors };
  }

  static validateFillInBlank(blank: FillInBlank): ValidationResult {
    const errors: string[] = [];

    for (const pattern of this.FORBIDDEN_PATTERNS) {
      if (pattern.test(blank.sentence)) {
        errors.push(`Sentence contains forbidden pattern: ${pattern.source}`);
      }
    }

    if (!blank.sentence.includes('______')) {
      errors.push('Sentence must contain blank (______)');
    }

    if (blank.metadata?.topic && blank.sentence.toLowerCase().includes(blank.metadata.topic.toLowerCase())) {
      errors.push(`Sentence contains topic label: "${blank.metadata.topic}"`);
    }

    return { valid: errors.length === 0, errors };
  }

  static validateMCQArray(mcqs: MCQ[]): { valid: boolean; invalidItems: { index: number; errors: string[] }[] } {
    const invalidItems: { index: number; errors: string[] }[] = [];
    mcqs.forEach((mcq, index) => {
      const result = this.validateMCQ(mcq);
      if (!result.valid) invalidItems.push({ index, errors: result.errors });
    });
    return { valid: invalidItems.length === 0, invalidItems };
  }

  static validateFillInBlankArray(blanks: FillInBlank[]): { valid: boolean; invalidItems: { index: number; errors: string[] }[] } {
    const invalidItems: { index: number; errors: string[] }[] = [];
    blanks.forEach((blank, index) => {
      const result = this.validateFillInBlank(blank);
      if (!result.valid) invalidItems.push({ index, errors: result.errors });
    });
    return { valid: invalidItems.length === 0, invalidItems };
  }

  static sanitizeQuestionText(text: string): string {
    let s = text;
    s = s.replace(/\[.*?\]/g, '').trim();
    s = s.replace(/\([^)]*?:\s*[^)]*?\)/g, '').trim();
    s = s.replace(/^[A-Z][a-z]+\s*[-:]\s*/, '').trim();
    s = s.replace(/hint:\s*/gi, '').trim();
    return s;
  }
}
