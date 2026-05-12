import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AI_MODEL,
  buildUserPrompt,
  GENERATE_SYSTEM_PROMPT,
  getOpenAI,
} from "@/lib/ai";
import {
  DIETARY_TAGS,
  DAYS,
  PRICE_LEVELS,
  RestaurantData,
} from "@/lib/schema";
import { uid } from "@/lib/utils";
import { STOCK_HERO_IMAGES } from "@/lib/sample";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  cuisine: z.string().min(1).max(200),
  vibe: z.string().max(200).optional(),
  city: z.string().max(200).optional(),
});

const AIMenuItem = z.object({
  name: z.string(),
  description: z.string().default(""),
  price: z.string().default(""),
  tags: z.array(z.enum(DIETARY_TAGS)).default([]),
});

const AIMenuSection = z.object({
  name: z.string(),
  items: z.array(AIMenuItem).default([]),
});

const AIHours = z.object({
  day: z.enum(DAYS),
  open: z.string().default("11:00"),
  close: z.string().default("22:00"),
  closed: z.boolean().default(false),
});

const AIResponse = z.object({
  name: z.string(),
  tagline: z.string().default(""),
  story: z.string().default(""),
  cuisine: z.string().default(""),
  priceLevel: z.enum(PRICE_LEVELS).default("$$"),
  menu: z.array(AIMenuSection).default([]),
  hours: z.array(AIHours).default([]),
  contact: z
    .object({
      phone: z.string().default(""),
      email: z.string().default(""),
      address: z.string().default(""),
      instagram: z.string().default(""),
    })
    .default({ phone: "", email: "", address: "", instagram: "" }),
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
        temperature: 0.85,
        messages: [
          { role: "system", content: GENERATE_SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(parsed.data) },
        ],
      },
      { timeout: 30_000 },
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

  const ai = AIResponse.safeParse(json);
  if (!ai.success) {
    return NextResponse.json(
      {
        error: "OpenAI returned an unexpected shape",
        details: ai.error.flatten(),
      },
      { status: 502 },
    );
  }

  // Map AI shape -> RestaurantData (add ids, hero image, theme default)
  const heroImage =
    STOCK_HERO_IMAGES[Math.floor(Math.random() * STOCK_HERO_IMAGES.length)]!;

  const data: RestaurantData = {
    name: ai.data.name,
    tagline: ai.data.tagline,
    story: ai.data.story,
    cuisine: ai.data.cuisine || parsed.data.cuisine,
    priceLevel: ai.data.priceLevel,
    heroImageUrl: heroImage,
    gallery: [],
    menu: ai.data.menu.map((section) => ({
      id: uid("sec"),
      name: section.name,
      items: section.items.map((item) => ({
        id: uid("itm"),
        name: item.name,
        description: item.description,
        price: item.price,
        tags: item.tags,
      })),
    })),
    hours:
      ai.data.hours.length > 0
        ? ai.data.hours
        : DAYS.map((day) => ({
            day,
            open: "11:00",
            close: "22:00",
            closed: false,
          })),
    contact: {
      phone: ai.data.contact.phone,
      email: ai.data.contact.email,
      address: ai.data.contact.address,
      mapsUrl: "",
      instagram: ai.data.contact.instagram,
    },
    theme: "modernBistro",
  };

  const final = RestaurantData.safeParse(data);
  if (!final.success) {
    return NextResponse.json(
      { error: "Generated data failed final validation" },
      { status: 502 },
    );
  }

  return NextResponse.json({ data: final.data });
}
