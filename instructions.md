# Deploy Instructions

A single-container Next.js app. No external database, no external services required.

## Build & run

```bash
npm ci
npm run build
npm start
```

Next.js respects the `PORT` env var on `next start`, so Railway's auto-injected port works out of the box.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | Optional | Enables the "Generate with AI" onboarding. **The app works fully without it** - AI buttons soft-disable with a clear in-UI message. |
| `PORT` | Auto (Railway) | Port to bind to. Defaults to 3000 locally. |

No `OPENAI_API_KEY` is needed to deploy or grade the app. Set one if you want to try the AI generation feature.

## Persistence

All restaurant data is stored in the reviewer's browser via `localStorage` (`restaurant-builder:v1`). The container has **no** disk state, so redeploys are safe and there is nothing to back up.

## Try this in 60 seconds

1. Open the deployed URL. A sample restaurant ("Pizzeria Lina") is pre-loaded.
2. Click **Generate with AI** (if `OPENAI_API_KEY` is set), type something like `tapas bar in Lisbon, romantic`, and hit Generate.
3. Open the **Theme** section in the editor and switch between **Modern Bistro** / **Cozy Cafe** / **Sunny Coastal** to see the same content in dramatically different styles.
4. Click **View as visitor** in the preview pane to see the site fullscreen, exactly as a guest would.

## Notes

- Node 18+ recommended (Next.js 14 requirement).
- The `/api/ai/health` and `/api/ai/generate` routes both run on the Node runtime. No additional providers, no separate services.
