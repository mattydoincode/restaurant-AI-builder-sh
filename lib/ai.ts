import OpenAI from "openai";

export const AI_MODEL = "gpt-4o-mini";

export function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export function isAIEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export const GENERATE_SYSTEM_PROMPT = `You generate complete, believable restaurant website content as strict JSON.

Given a brief description (cuisine, vibe, optional city), produce a fully populated restaurant. Names should feel real (not generic). Menu items should be on-brand for the cuisine. Prices should be realistic for the price level. The "story" field should be 3-5 sentences, written in confident first-person plural ("we") voice.

You MUST respond with ONLY a JSON object matching this exact shape:

{
  "name": string,
  "tagline": string (one short sentence, max ~80 chars),
  "story": string (3-5 sentences),
  "cuisine": string (the cuisine label),
  "priceLevel": "$" | "$$" | "$$$" | "$$$$",
  "menu": [
    {
      "name": string (section name, e.g. "Starters"),
      "items": [
        {
          "name": string,
          "description": string (8-15 words),
          "price": string (e.g. "$14"),
          "tags": array of zero or more of ["V","VG","GF","DF","Spicy"]
        }
      ]
    }
  ],
  "hours": [
    { "day": "Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun", "open": "HH:MM" 24h, "close": "HH:MM" 24h, "closed": boolean }
  ],
  "contact": {
    "phone": string (use a clearly fake but realistic-looking number),
    "email": string (using example.com domain),
    "address": string,
    "instagram": string (starts with @)
  }
}

Generate 3-4 menu sections with 3-5 items each. Include hours for all 7 days. Do NOT include any prose outside the JSON object.`;

export interface AIGenerateInput {
  cuisine: string;
  vibe?: string;
  city?: string;
}

export function buildUserPrompt(input: AIGenerateInput): string {
  const bits = [
    `Cuisine / concept: ${input.cuisine}`,
    input.vibe ? `Vibe / atmosphere: ${input.vibe}` : null,
    input.city ? `City / location: ${input.city}` : null,
  ].filter(Boolean);
  return `Generate a complete restaurant for the following brief:\n\n${bits.join("\n")}`;
}
