const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function groqFetch(messages: { role: string; content: string }[], temperature = 0.2, max_tokens = 3000): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY is not set');

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, temperature, max_tokens }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq API error: ${res.status} — ${err?.error?.message ?? 'unknown'}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function callGroq(prompt: string): Promise<string> {
  return groqFetch([{ role: 'user', content: prompt }]);
}

// System-role call for better instruction adherence (used by adaptive engine)
export async function callGroqWithSystem(system: string, user: string, temperature = 0.3): Promise<string> {
  return groqFetch([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ], temperature, 3000);
}
