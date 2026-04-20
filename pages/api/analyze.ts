import type { NextApiRequest, NextApiResponse } from 'next';
import { callGroqWithSystem } from '@/lib/groq';

export interface Topic {
  title: string;
  keywords: string[];
  conceptType: 'definition' | 'process' | 'comparison' | 'function' | 'identification' | 'purpose';
  domain: string;
  definition: string; // full source sentence for this concept
}

export interface AnalysisResult {
  summary: string;
  topics: Topic[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body as { text: string };
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' });

  const system = `You are a precise document analysis engine for an adaptive exam question generator.
Your job is to extract structured concept data that will drive intelligent question generation.
Return ONLY valid JSON. No markdown. No explanation.`;

  const user = `Analyze the document below and return a JSON object:
{
  "summary": "2-3 sentence summary",
  "topics": [
    {
      "title": "Exact Key Term or Concept Name",
      "keywords": ["word1", "word2", "word3"],
      "conceptType": "definition|process|comparison|function|identification|purpose",
      "domain": "subject area (e.g. Networking, Biology, History)",
      "definition": "The exact sentence from the document that best describes this concept"
    }
  ]
}

conceptType rules:
- definition: concept IS something ("X is a...", "X refers to...")
- process: concept DOES something step-by-step
- comparison: concept is contrasted with another
- function: concept serves a purpose or role
- identification: concept is a named instance of a category
- purpose: concept exists to achieve a goal

Rules:
- title = exact key term (will be the ANSWER in quizzes — never put it in the question)
- definition = verbatim or near-verbatim sentence from the document
- Extract 5 to 12 topics
- keywords = 3-6 words from the definition sentence (NOT the title)
- domain = infer from context
- All content from document only

Document:
${text.slice(0, 8000)}`;

  try {
    const raw = await callGroqWithSystem(system, user, 0.1);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`Groq returned unexpected format: ${cleaned.slice(0, 200)}`);
    const result: AnalysisResult = JSON.parse(jsonMatch[0]);
    res.status(200).json(result);
  } catch (e: any) {
    console.error('[analyze]', e);
    res.status(500).json({ error: e?.message ?? 'Analysis failed. Please try again.' });
  }
}
