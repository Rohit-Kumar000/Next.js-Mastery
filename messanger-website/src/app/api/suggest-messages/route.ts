import { getClientIp, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const SUGGESTION_COUNT = 3;

type GeminiResponse = {
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  error?: { message?: string };
};

const topics = [
  'favorite music and songs',
  'movies and series',
  'food and cooking',
  'travel and dream places',
  'childhood memories',
  'hobbies and weekend plans',
  'books and learning',
  'goals and ambitions',
  'gratitude and kindness',
  'friendship',
  'funny "would you rather" ideas',
  'nature and weather',
  'technology and gadgets',
  'sports and games',
  'superpowers and imagination',
  'daily habits and routines',
  'proud moments',
  'new skills to learn',
  'festivals and celebrations',
  'inspiring people',
];

const tones = [
  'curious and playful',
  'warm and encouraging',
  'light-hearted and funny',
  'thoughtful and sincere',
  'cheerful and casual',
];

const fallbackPool = [
  'What is something small that made you smile recently?',
  'What is one thing you are looking forward to this week?',
  'What is a memory that always makes you happy?',
  'If you could learn any skill overnight, what would it be?',
  'Which song has been stuck in your head lately?',
  'What is the best meal you have had this month?',
  'Where would you travel tomorrow if there were no limits?',
  'What is one thing you are really proud of this year?',
  'Which movie could you watch again and again?',
  'What is a simple habit that makes your day better?',
  'If you could have dinner with anyone, who would it be?',
  'What is the kindest thing someone has done for you?',
  'What hobby would you love to pick up this year?',
  'Which book has changed the way you think?',
  'What is your favorite way to spend a lazy Sunday?',
  'What is one goal you want to finish before the year ends?',
  'Which childhood game do you miss the most?',
  'What would your perfect weekend look like?',
  'What is something you are grateful for today?',
  'If you had a superpower for a day, how would you use it?',
  'What is the best advice you have ever received?',
  'Which place makes you feel the most relaxed?',
  'What is a small win you want to celebrate today?',
  'What is something new you learned recently?',
];

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
}

async function readExcluded(request: Request): Promise<string[]> {
  try {
    const body = (await request.json()) as { exclude?: unknown };
    if (!Array.isArray(body.exclude)) return [];
    return body.exclude
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, 300))
      .filter(Boolean)
      .slice(0, 15);
  } catch {
    return [];
  }
}

/** Fills the list up to 3 using built-in suggestions that were not shown yet. */
function topUp(current: string[], excluded: Set<string>): string[] {
  const result = [...current];
  const used = new Set([...excluded, ...result.map(normalize)]);
  for (const item of shuffle(fallbackPool)) {
    if (result.length >= SUGGESTION_COUNT) break;
    if (!used.has(normalize(item))) {
      result.push(item);
      used.add(normalize(item));
    }
  }
  // Pool exhausted by the exclude list: allow repeats rather than returning fewer than 3.
  for (const item of shuffle(fallbackPool)) {
    if (result.length >= SUGGESTION_COUNT) break;
    if (!result.includes(item)) result.push(item);
  }
  return result;
}

function buildPrompt(excluded: string[]): string {
  const [topicA, topicB, topicC] = shuffle(topics);
  const tone = shuffle(tones)[0];
  const variationId = Math.random().toString(36).slice(2, 10);
  const avoid = excluded.length
    ? `\nDo not repeat or reword any of these earlier messages:\n${excluded.map((item) => `- ${item}`).join('\n')}\n`
    : '';

  return [
    `Write exactly ${SUGGESTION_COUNT} short, friendly, open-ended anonymous messages someone could send to a friend.`,
    `Each message must be about a different topic. Take inspiration from: ${topicA}; ${topicB}; ${topicC}.`,
    `Tone: ${tone}. Keep every message under 140 characters.`,
    'Avoid sensitive topics such as politics, religion, health, romance and appearance. Keep them inclusive.',
    avoid,
    `Variation id: ${variationId}.`,
    'Return only the messages, one per line, with no numbering, bullets, quotes or extra text.',
  ].join('\n');
}

function parseSuggestions(data: GeminiResponse, excluded: Set<string>): string[] {
  const text =
    data.steps
      ?.filter((step) => step.type === 'model_output')
      .flatMap((step) => step.content ?? [])
      .filter((part) => part.type === 'text')
      .map((part) => part.text ?? '')
      .join('\n') ?? '';

  const seen = new Set(excluded);
  const suggestions: string[] = [];

  for (const rawLine of text.split('\n')) {
    const line = rawLine
      .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '')
      .replace(/^['"“”]+|['"“”]+$/g, '')
      .trim();
    const key = normalize(line);
    if (line.length < 10 || line.length > 200 || seen.has(key)) continue;
    seen.add(key);
    suggestions.push(line);
    if (suggestions.length === SUGGESTION_COUNT) break;
  }

  return suggestions;
}

export async function POST(request: Request) {
  const limit = rateLimit(`suggest:${getClientIp(request)}`, 20, 60_000);
  if (!limit.ok) {
    return Response.json(
      { success: false, message: `Too many requests. Please try again in ${limit.retryAfter} seconds.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { success: false, message: 'AI suggestions need GEMINI_API_KEY. Add it to .env.local and restart the app.' },
      { status: 503 }
    );
  }

  const excludedList = await readExcluded(request);
  const excluded = new Set(excludedList.map(normalize));

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'Api-Revision': '2026-05-20',
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input: buildPrompt(excludedList),
        generation_config: { thinking_level: 'low' },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok) {
      const providerMessage = data.error?.message ?? response.statusText;
      const isOverloaded =
        response.status === 429 ||
        response.status === 503 ||
        /high demand|overload|resource exhausted/i.test(providerMessage);

      if (isOverloaded) {
        console.warn('Gemini is temporarily overloaded; returning built-in suggestions.');
        return Response.json({ success: true, suggestions: topUp([], excluded), fallback: true });
      }

      console.error('Gemini suggestion request failed:', providerMessage);
      return Response.json(
        { success: false, message: 'Gemini could not generate suggestions. Check your API key and try again.' },
        { status: 502 }
      );
    }

    const suggestions = parseSuggestions(data, excluded);
    if (suggestions.length === 0) {
      return Response.json(
        { success: false, message: 'Gemini returned no usable suggestions. Please try again.' },
        { status: 502 }
      );
    }

    return Response.json({ success: true, suggestions: topUp(suggestions, excluded) });
  } catch (error) {
    console.error('Unable to generate message suggestions:', error instanceof Error ? error.message : error);
    if (error instanceof Error && (error.name === 'TimeoutError' || /timeout|timed out/i.test(error.message))) {
      return Response.json({ success: true, suggestions: topUp([], excluded), fallback: true });
    }
    return Response.json(
      { success: false, message: 'Unable to reach Gemini right now. Please try again.' },
      { status: 502 }
    );
  }
}
