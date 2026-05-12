import { NextResponse } from "next/server";
import { z } from "zod";
import { AI_MODEL, getOpenAI } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELD_KINDS = [
  "tagline",
  "story",
  "dish_name",
  "dish_description",
  "chef",
  "section_name",
] as const;

const ACTIONS = ["improve", "shorten", "more_descriptive", "generate"] as const;

const RequestSchema = z.object({
  fieldKind: z.enum(FIELD_KINDS),
  current: z.string().max(2000).default(""),
  action: z.enum(ACTIONS),
  context: z
    .object({
      restaurantName: z.string().max(200).optional(),
      cuisine: z.string().max(200).optional(),
      vibe: z.string().max(400).optional(),
      dishName: z.string().max(200).optional(),
    })
    .default({}),
});

type FieldKind = (typeof FIELD_KINDS)[number];
type Action = (typeof ACTIONS)[number];

const FIELD_GUIDES: Record<FieldKind, string> = {
  tagline:
    "A single short sentence, max 80 characters, no quotation marks, no end punctuation other than periods.",
  story:
    "A 3-5 sentence brand story in confident first-person plural voice (we/our). Specific, sensory, no clichés.",
  dish_name:
    "A short, evocative dish name (1-5 words). Title case. Plain text only.",
  dish_description:
    "8-15 words describing key ingredients and preparation. No marketing fluff. Plain text only.",
  chef:
    "A plausible chef byline. Format: just the name (e.g. 'Chef Marta Russo'). 2-4 words.",
  section_name:
    "A short menu section name (1-3 words, e.g. 'Antipasti', 'Small Plates', 'From the Sea'). Title case.",
};

const ACTION_GUIDES: Record<Action, string> = {
  improve:
    "Improve the current value: better word choice, smoother flow, but keep the same meaning.",
  shorten: "Shorten the current value while preserving meaning.",
  more_descriptive:
    "Make the value more descriptive and evocative without changing its meaning.",
  generate:
    "Generate a fresh value. Current value may be empty; ignore it or use it only as a loose hint.",
};

function buildPrompt(input: z.infer<typeof RequestSchema>): string {
  const ctxBits: string[] = [];
  if (input.context.restaurantName) {
    ctxBits.push(`Restaurant: ${input.context.restaurantName}`);
  }
  if (input.context.cuisine) {
    ctxBits.push(`Cuisine: ${input.context.cuisine}`);
  }
  if (input.context.vibe) {
    ctxBits.push(`Vibe: ${input.context.vibe}`);
  }
  if (input.context.dishName) {
    ctxBits.push(`Dish: ${input.context.dishName}`);
  }
  const ctx = ctxBits.length > 0 ? ctxBits.join("\n") : "(no extra context)";
  return [
    `Field: ${input.fieldKind}`,
    `Action: ${input.action}`,
    `Field guide: ${FIELD_GUIDES[input.fieldKind]}`,
    `Action guide: ${ACTION_GUIDES[input.action]}`,
    `Context:\n${ctx}`,
    `Current value: ${JSON.stringify(input.current)}`,
    `Respond as JSON: { "value": <new value as plain string> }`,
  ].join("\n\n");
}

const SYSTEM_PROMPT = `You rewrite short pieces of restaurant website copy.

Always return ONLY a JSON object of the shape {"value": string}. No prose outside the JSON. The string must respect the field's length and tone guide. Never wrap the value in quotes or markdown.`;

const ResponseShape = z.object({
  value: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json(
      {
        error:
          "AI features are not configured. Set OPENAI_API_KEY to enable.",
      },
      { status: 503 },
    );
  }

  let completion;
  try {
    completion = await openai.chat.completions.create(
      {
        model: AI_MODEL,
        response_format: { type: "json_object" },
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildPrompt(parsed.data) },
        ],
      },
      { timeout: 20_000 },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `OpenAI request failed: ${msg}` },
      { status: 502 },
    );
  }

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return NextResponse.json(
      { error: "OpenAI returned an empty response" },
      { status: 502 },
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "OpenAI returned non-JSON output" },
      { status: 502 },
    );
  }

  const ok = ResponseShape.safeParse(json);
  if (!ok.success) {
    return NextResponse.json(
      { error: "OpenAI returned an unexpected shape" },
      { status: 502 },
    );
  }

  // Strip any wrapping quotes the model may add despite the system prompt.
  const value = ok.data.value.trim().replace(/^["']+|["']+$/g, "");

  return NextResponse.json({ value });
}
