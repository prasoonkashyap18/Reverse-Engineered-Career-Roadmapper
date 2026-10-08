# CareerForge — Architecture

## Stack

Next.js (App Router) + React + TypeScript, Tailwind CSS v4 for styling,
Zod for runtime validation. React Flow and Framer Motion are planned for
the interactive roadmap (Step 5) and polish (Step 11) but are not
installed until those steps need them.

## Client/server boundaries

- Server: Next.js Server Components, Server Actions, and Route Handlers.
  All AI calls and secret-bearing logic live here (`lib/ai/`).
- Client: Components marked `"use client"` — interactive UI only
  (forms, the future roadmap canvas, dialogs). Never import `lib/ai/`
  from a client component, and never read `process.env.AI_API_KEY`
  outside server code.

## Component architecture

- `components/ui/` — reusable, presentation-only primitives (Button,
  Input, Card, Dialog, ...). No business logic, no data fetching.
- `components/layout/` — page-shell components (Header, MobileNav,
  MarketingLayout, AppLayout). Compose `ui/` primitives.
- Feature-specific component folders (`components/roadmap/`,
  `components/onboarding/`, `components/dashboard/`) are created in the
  step that introduces that feature, not before — see
  DEVELOPMENT_ROADMAP.md.

## AI service boundary

`lib/ai/` defines the contract for AI operations (`generateRoadmap`,
`generateNodeActionPlan`, `replanRoadmap`) in `lib/ai/types.ts` and
`lib/ai/index.ts`. As of Step 1 these are typed placeholders that throw —
no provider is called yet. When implemented (Step 4+), they must:

1. Run server-side only.
2. Read the API key from a server-only env var (never `NEXT_PUBLIC_*`).
3. Return data that has passed through the validation layer before it
   reaches application state or the client.

## Validation layer

`lib/validation/` holds Zod schemas mirroring `types/`. Every AI response
is parsed through the relevant schema before it is trusted. The schemas
are deliberately kept in sync with the domain types rather than treated
as a separate source of truth.

## Future database boundary

No database is introduced in Step 1. When persistence is needed (roadmap
storage, progress tracking), it will sit behind a `lib/db/` (or similar)
boundary so route handlers and server actions never embed storage
details directly.

## Data flow (target shape, implemented starting Step 4)

```
Client UI
    ↓
Server action / API route handler
    ↓
AI service (lib/ai)
    ↓
Structured response (JSON)
    ↓
Zod validation (lib/validation)
    ↓
Application data (types/)
    ↓
UI (React Flow graph, node details, dashboard)
```

## Security boundaries

- `.env` is git-ignored; only `.env.example` (with empty placeholders) is
  committed.
- API keys are read only inside server-side modules (`lib/ai/`), never
  inside anything under `"use client"`.
- No credentials are hardcoded anywhere in the repository.

## Future roadmap graph architecture

The interactive roadmap (Step 5) will render `RoadmapNode`/`RoadmapEdge`
(see `types/career.ts`) using React Flow, with pan/zoom built in. Node
click opens a detail view that calls `generateNodeActionPlan`. Marking a
skill as known updates `UserProgress` and triggers `replanRoadmap`,
which regenerates the affected subset of nodes/edges rather than the
whole graph.
