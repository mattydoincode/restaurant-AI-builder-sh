# Restaurant Website Builder

An opinionated, AI-assisted website builder for restaurant owners. Edit on the left, see your site on the right. Pick a theme. Publish by sharing the screen.

## What it does

- **AI onboarding** - describe your concept and get a fully populated draft in seconds (cuisine, vibe, city -> name, tagline, story, menu, hours, contact).
- **Live editor** - edit hero, story, menu (sections + items + prices + dietary tags), hours, contact info, and theme. All updates render instantly in the preview.
- **Three visually distinct themes** - Modern Bistro (dark / fine-dining), Cozy Cafe (warm / casual), Sunny Coastal (bright / breezy). Same data, three completely different sites.
- **Preview is the site** - toggle "View as visitor" to fullscreen the preview with no editor chrome. That is the published site.
- **Mobile + desktop preview** - one click to see how it looks on a phone.
- **Auto-save** - every keystroke is persisted to `localStorage`. Refresh is safe.
- **Export** - download your full site config as JSON.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand (with persist middleware)
- Zod (single source of truth for the data shape)
- OpenAI (gpt-4o-mini) for AI generation
- lucide-react, sonner

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To try the AI features, copy `.env.example` to `.env.local` and add your OpenAI key.

## Deploy

See [`instructions.md`](./instructions.md).

## Architecture

```
app/
  layout.tsx              Root layout + toast mount
  page.tsx                Renders the EditorShell
  api/ai/generate/        OpenAI -> validated RestaurantData (JSON mode + Zod gate)
  api/ai/health/          Reports whether OPENAI_API_KEY is configured
components/
  editor/                 Section editors + AI onboarding dialog + shell
  preview/                Themes + responsive frame + fullscreen toggle
  ui/                     Minimal shadcn-style primitives (Button, Input, etc.)
lib/
  schema.ts               Zod schema (the single source of truth)
  store.ts                Zustand store with localStorage persistence
  ai.ts                   OpenAI client + prompt templates
  sample.ts               Sample restaurant pre-loaded on first visit
  utils.ts                cn(), uid(), formatTime(), formatPrice()
```
