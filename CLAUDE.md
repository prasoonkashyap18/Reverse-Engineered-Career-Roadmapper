# CareerForge

## Project

AI-powered reverse-engineered career roadmap platform.

## Hackathon

LLOYD Hackathon — Problem Statement 1 (Reverse-Engineered Career
Roadmapper).

## Repository

https://github.com/prasoonkashyap18/Reverse-Engineered-Career-Roadmapper.git

## Current phase

Step 1 — Project Foundation (complete). See
`docs/DEVELOPMENT_ROADMAP.md` for all 12 phases.

## Product purpose

A user enters a specific, detailed career goal (e.g. "AI Engineer at a
fintech startup in India"). CareerForge uses AI to reverse-engineer that
goal into a structured, personalized roadmap — phases, skills,
intermediate roles, projects, certifications, and a timeline — and
renders it as an interactive graph (not a checklist) that the user can
zoom, pan, and click into for AI-generated action plans. Marking a skill
as already known dynamically replans the roadmap. Full detail in
`docs/PRODUCT_SPEC.md`.

## Core requirements

- Accept a highly specific career goal as input.
- AI breaks the goal into phases, skills, roles, projects, certifications,
  and a timeline.
- Visualize the roadmap as an interactive graph/skill-tree/timeline.
- Support zoom and pan; support clicking nodes for detail.
- Generate AI action plans per node.
- Dynamically replan when a skill is marked known.
- Deployed publicly, usable on mobile, resilient to bad input,
  accessible, no exposed API keys, documented per hackathon README
  requirements.

## Technology stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (CSS-based theme, see `app/globals.css`)
- Zod for runtime validation
- ESLint (flat config)
- Planned, added only when the step needs them: React Flow (Step 5),
  Framer Motion (Step 11)

## Architecture

See `docs/ARCHITECTURE.md`. Summary: client/server boundary follows the
Next.js App Router (server actions + route handlers own AI calls and
secrets); `lib/ai/` is the AI service boundary (placeholders until Step
4); `lib/validation/` holds Zod schemas mirroring `types/`; all
AI-generated data must pass validation before entering application
state or rendering.

## Folder structure

- `app/` — Next.js App Router pages and layout.
- `components/ui/` — reusable presentation primitives (Button, Card, …).
- `components/layout/` — page shells (Header, MobileNav, MarketingLayout,
  AppLayout).
- `components/roadmap/`, `components/onboarding/`, `components/dashboard/`
  — created when the step that needs them starts, not before.
- `lib/ai/` — AI service boundary (contracts + placeholders).
- `lib/validation/` — Zod schemas mirroring `types/`.
- `lib/utils/` — small shared utilities (e.g. `cn`).
- `types/` — domain types (`CareerGoal`, `Roadmap`, `RoadmapNode`, …).
- `config/` — static site config (nav, name).
- `docs/` — product spec, architecture, design system, roadmap.

## Coding conventions

- TypeScript strict mode; no `any` without a strong reason.
- Server-only code (AI calls, secrets) never imported from a
  `"use client"` file.
- Keep components small and composed from `components/ui/` primitives.
- Prefer the simplest implementation; no speculative abstraction.

## Design principles

Dark-first, premium, restrained — see `docs/DESIGN_SYSTEM.md` for the
full token table and visual direction. Avoid generic-chatbot aesthetics,
excessive gradients/glassmorphism/animation.

## AI principles

AI responses are untrusted input: they must be parsed through a Zod
schema in `lib/validation/` before they reach application state or the
UI. AI calls happen only in server-side code, reading the API key from a
server-only environment variable.

## Security

- `.env` is git-ignored; `.env.example` documents required variables
  with empty placeholders only.
- No API keys, tokens, or credentials are ever hardcoded or committed.
- Secrets are read only in server-side modules.

## Development rules

- Do not unnecessarily rewrite working components.
- Do not add unnecessary dependencies.
- Do not expose API keys.
- Do not call secret APIs from client components.
- Validate AI responses.
- Keep components reusable.
- Prefer small, targeted changes.
- Do not implement future phases unless explicitly instructed.
- Do not modify unrelated features.
- Test changes before considering a task complete.
- Commit completed development steps with meaningful Git commits.
- Push completed development steps to the official repository after
  verification.
- Never force push or rewrite history.

## Current development phase

Step 1 is complete. Future phases must not be implemented unless
explicitly requested.
