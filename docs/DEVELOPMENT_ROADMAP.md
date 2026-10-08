# CareerForge — Development Roadmap

Twelve phases. Only the current phase should be implemented at any time;
later phases must not be started early.

## 1. Project foundation + architecture + design system (current)

- Objective: a working, documented, lint/build-clean project skeleton.
- Deliverables: Next.js/TS/Tailwind setup, design tokens, reusable UI
  primitives, layout shells, domain types, validation foundation, AI
  service boundary (no real calls), docs, `.env.example`.
- Dependencies: none.

## 2. Landing page + navigation + application shell

- Objective: the real marketing landing page and app navigation.
- Deliverables: finished `MarketingLayout` page content, nav wired to
  real routes.
- Dependencies: Step 1 layout/UI foundation.

## 3. Career onboarding flow

- Objective: capture the user's career goal and any profile info.
- Deliverables: onboarding form(s) under `components/onboarding/`, input
  validation with the Step 1 Zod foundation.
- Dependencies: Step 1 types/validation, Step 2 shell.

## 4. AI roadmap generation engine

- Objective: real AI integration behind the Step 1 service boundary.
- Deliverables: `generateRoadmap` implementation, full AI response
  schema in `lib/validation/`, server-only API key usage.
- Dependencies: Step 1 AI boundary + validation foundation.

## 5. Interactive career roadmap / graph

- Objective: render the roadmap as a graph, not a checklist.
- Deliverables: `components/roadmap/` with React Flow, pan/zoom, node
  rendering from `RoadmapNode`/`RoadmapEdge`.
- Dependencies: Step 4 roadmap data.

## 6. Roadmap node details + AI action plans

- Objective: clicking a node produces actionable advice.
- Deliverables: `generateNodeActionPlan` implementation, node detail
  view/dialog.
- Dependencies: Step 5 graph, Step 1 AI boundary.

## 7. Dynamic AI replanning

- Objective: marking a skill known updates the roadmap.
- Deliverables: `replanRoadmap` implementation, UI to mark skills known.
- Dependencies: Step 4 engine, Step 5 graph.

## 8. Progress tracking + dashboard

- Objective: persist and visualize progress over time.
- Deliverables: `components/dashboard/`, `UserProgress` persistence
  (introduces the database boundary described in ARCHITECTURE.md).
- Dependencies: Step 5–7.

## 9. Time-budget + career personalization

- Objective: tailor pacing to the user's available time.
- Deliverables: profile input (`weeklyHoursAvailable`), timeline
  adjustments fed back into roadmap generation.
- Dependencies: Step 3 onboarding, Step 4 engine.

## 10. Career comparison + sharing/export

- Objective: differentiators beyond the MVP.
- Deliverables: compare two roadmaps; export/share a roadmap.
- Dependencies: Step 5 graph, Step 8 dashboard.

## 11. Responsive design + accessibility + error handling + QA

- Objective: production-quality polish across the whole app.
- Deliverables: full responsive pass, accessibility audit, error
  boundaries, loading/empty states, Framer Motion micro-interactions.
- Dependencies: all prior feature steps.

## 12. Deployment + README + demo preparation

- Objective: ship it.
- Deliverables: public deployment, final README (setup, architecture
  summary, demo instructions), submission checklist.
- Dependencies: all prior steps.
