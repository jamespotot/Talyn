import type { NextApiRequest, NextApiResponse } from 'next';
import { callGroq, callGroqWithSystem } from '@/lib/groq';
import { PuroEngine, MCQ, answerLeaksIntoQuestion } from '@/core/puroEngine';
import type { Topic } from '@/core/puroEngine';

export type QuizType = 'flashcards' | 'fillblank' | 'mcq';
export type LearningMode = 'puro' | 'talyno';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, topics, quizType, mode } = req.body as {
    text: string;
    topics: Topic[];
    quizType: QuizType;
    mode: LearningMode;
  };

  if (!text || !topics || !quizType || !mode)
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    if (mode === 'puro') {
      const engine = new PuroEngine(text, topics);
      if (quizType === 'flashcards') return res.status(200).json({ data: engine.generateFlashcards(15) });
      if (quizType === 'fillblank') return res.status(200).json({ data: engine.generateFillInBlanks(15) });
      if (quizType === 'mcq') {
        const mcqs = engine.generateMCQs(15, false);
        return res.status(200).json({ data: mcqs });
      }
    }

    // ── TALYNO MODE ──────────────────────────────────────────────────────────
    if (quizType === 'mcq') {
      const engine = new PuroEngine(text, topics);
      const baseMCQs = engine.generateMCQs(15, true);
      const enhanced = await runTalynoMCQPipeline(baseMCQs, text, topics);
      return res.status(200).json({ data: enhanced });
    }

    // Flashcards + FillBlank: AI-enhanced generation
    const topicSummary = topics.map(t => `${t.title} [${t.conceptType ?? 'definition'}]: ${t.keywords.join(', ')}`).join('\n');
    const prompt = buildTalynoPrompt(quizType, text, topicSummary);
    const raw = await callGroq(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error(`Groq returned unexpected format: ${cleaned.slice(0, 200)}`);
    res.status(200).json({ data: JSON.parse(jsonMatch[0]) });
  } catch (e: any) {
    console.error('[generate]', e);
    res.status(500).json({ error: e?.message ?? 'Generation failed. Please try again.' });
  }
}

// ─── Talyno MCQ Pipeline ─────────────────────────────────────────────────────
// Step 1: Enhance distractors
// Step 2: Upgrade question phrasing to exam-quality adaptive style
// Step 3: Generate explanation + hint
// Step 4: QC anti-leak pass — reject or regenerate any leaking question

async function runTalynoMCQPipeline(mcqs: MCQ[], text: string, topics: Topic[]): Promise<MCQ[]> {
  const allTitles = topics.map(t => t.title);
  const domain = topics[0]?.domain ?? 'general';

  // Run all enhancements in parallel per MCQ for speed
  const results = await Promise.all(
    mcqs.map(mcq => enhanceSingleMCQ(mcq, allTitles, domain, text))
  );

  // Final QC pass: drop any item where answer still leaks into question
  return results.filter(mcq => !answerLeaksIntoQuestion(mcq.question, mcq.correctAnswer));
}

async function enhanceSingleMCQ(
  mcq: MCQ,
  allTitles: string[],
  domain: string,
  text: string
): Promise<MCQ> {
  const conceptType = mcq.metadata?.conceptType ?? 'definition';

  const system = `You are a professional certification exam question writer.
ABSOLUTE RULE: The correct answer "${mcq.correctAnswer}" must NEVER appear anywhere in the question text.
If you cannot write the question without including the answer, rephrase using synonyms or indirect description.
Return ONLY valid JSON. No markdown.`;

  const user = `You are upgrading an MCQ for a high-quality adaptive exam system.

CONCEPT: ${mcq.correctAnswer}
CONCEPT TYPE: ${conceptType}
DOMAIN: ${domain}
CURRENT QUESTION: ${mcq.question}
CURRENT DISTRACTORS: ${mcq.distractors.join(', ') || 'None'}
ALL DOCUMENT TOPICS: ${allTitles.join(', ')}

TASK: Return a single improved MCQ as JSON:
{
  "question": "Exam-quality question. MUST NOT contain '${mcq.correctAnswer}' or any part of it.",
  "distractors": ["D1", "D2", "D3"],
  "explanation": {
    "correct": "Why '${mcq.correctAnswer}' is the right answer (functional reasoning)",
    "distractors": ["Why D1 is wrong", "Why D2 is wrong", "Why D3 is wrong"]
  }
}

QUESTION STYLE RULES by conceptType:
- definition → "What term refers to [description without answer]?"
- function → "Which concept is responsible for [function without answer]?"
- process → "Which process involves [steps without answer]?"
- purpose → "What mechanism is designed to [goal without answer]?"
- comparison → "Which term is distinguished by [characteristic without answer]?"
- identification → "What is the specific name for [category without answer]?"

DISTRACTOR RULES:
- Prefer other document topics first: ${allTitles.filter(t => t !== mcq.correctAnswer).slice(0, 6).join(', ')}
- If fewer than 3, generate domain-plausible alternatives from ${domain}
- Must be conceptually similar and commonly confused
- Never random, never variations of correct answer

ANTI-LEAK CHECK: Before returning, verify the word "${mcq.correctAnswer}" does NOT appear in "question".`;

  try {
    const raw = await callGroqWithSystem(system, user, 0.4);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return mcq;

    const parsed = JSON.parse(jsonMatch[0]);

    // Hard anti-leak guard: if AI still leaked the answer, fall back to original
    if (answerLeaksIntoQuestion(parsed.question ?? '', mcq.correctAnswer)) {
      return mcq;
    }

    const explanationCorrect: string = parsed.explanation?.correct ?? '';
    const explanationDistractors: string[] = parsed.explanation?.distractors ?? [];
    const fullExplanation = [
      explanationCorrect,
      ...explanationDistractors.map((d: string, i: number) => `Option ${String.fromCharCode(66 + i)}: ${d}`),
    ].filter(Boolean).join('\n');

    // Generate hint in a separate, strictly controlled call
    const safeHint = await generateSafeHint(mcq.correctAnswer, mcq.question, conceptType, domain);

    return {
      ...mcq,
      question: parsed.question ?? mcq.question,
      distractors: Array.isArray(parsed.distractors) && parsed.distractors.length >= 3
        ? parsed.distractors.slice(0, 3)
        : mcq.distractors,
      explanation: fullExplanation || undefined,
      hint: safeHint,
    };
  } catch {
    return mcq;
  }
}

// ─── Safe Hint Generator ─────────────────────────────────────────────────────
// Hint is generated in a fully isolated call with its own strict system prompt.
// Post-generation: checked against answer term AND all significant answer keywords.

function hintLeaksAnswer(hint: string, answer: string): boolean {
  const hLower = hint.toLowerCase();
  // Check full answer phrase
  if (hLower.includes(answer.toLowerCase())) return true;
  // Check each significant word of the answer (length > 3 to skip articles/prepositions)
  const answerWords = answer.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  // If ALL significant words appear in hint, it's a leak
  if (answerWords.length > 0 && answerWords.every(w => hLower.includes(w))) return true;
  return false;
}

async function generateSafeHint(
  answer: string,
  question: string,
  conceptType: string,
  domain: string
): Promise<string | undefined> {
  const system = `You are a hint writer for a strict exam system.

YOUR ONLY JOB: Write a hint that helps the student think — without revealing the answer.

ABSOLUTE FORBIDDEN LIST — never include in hint:
- The answer term: "${answer}"
- Any word that is part of "${answer}"
- Any phrase that directly paraphrases the answer name
- Any fragment that uniquely identifies the answer by name

HINT MUST ONLY DESCRIBE:
- What the concept DOES (behavior)
- What PURPOSE it serves
- What PROBLEM it solves
- What CONTEXT it operates in

HINT MUST NOT:
- Name the concept
- Repeat the question
- Contain the answer or any synonym of it

Return ONLY the hint sentence. No JSON. No label. No prefix.`;

  const user = `CONCEPT TO HINT ABOUT: "${answer}"
CONCEPT TYPE: ${conceptType}
DOMAIN: ${domain}
QUESTION CONTEXT: ${question}

Write ONE hint sentence that describes what this concept does or what problem it solves.
Do NOT name the concept. Do NOT include "${answer}" or any part of it.

Hint:`;

  try {
    const raw = await callGroqWithSystem(system, user, 0.5);
    const hint = raw.replace(/^hint[:\s]*/i, '').trim();

    // Hard post-generation leak check
    if (!hint || hintLeaksAnswer(hint, answer)) return undefined;

    return hint;
  } catch {
    return undefined;
  }
}

// ─── Talyno Flashcard / FillBlank Prompts ────────────────────────────────────

function buildTalynoPrompt(quizType: QuizType, text: string, topics: string): string {
  const base = `You are an educational content generator. Use ONLY the document below.
CORE RULE: MEANING/DESCRIPTION = QUESTION. TITLE/KEY TERM = ANSWER.
Topics:\n${topics}\n\nDocument:\n${text.slice(0, 8000)}\n\n`;

  if (quizType === 'flashcards') {
    return base + `Generate 15 flashcards. Return ONLY a JSON array:
[{ "term": "Key Term", "definition": "Full meaning from document", "sourceIndex": 0 }]
- definition (FRONT) = meaning the student reads
- term (BACK) = the answer
- Slight readability improvement allowed, meaning unchanged`;
  }

  return base + `Generate 15 fill-in-the-blank questions. Return ONLY a JSON array:
[{ "sentence": "Definition with KEY TERM replaced by ______", "blank": "______", "answer": "Key Term", "sourceIndex": 0 }]
- Blank must replace the KEY TERM, not a random word
- Answer = exact key term from document`;
}
