# CareerForge — Product Spec

## Target users

- Students and early-career professionals who have a specific dream job in
  mind but no clear path toward it (e.g. "AI Engineer at a fintech startup
  in India").
- People switching fields who need to understand the gap between their
  current skills and a target role.

## Problem

Generic career advice ("learn Python", "get a certification") does not
tell someone *in what order*, *how long it will take*, or *what to build*
to prove the skill. Career preparation is treated as a flat checklist
instead of a structured, dependency-aware plan.

## Solution

CareerForge takes one specific, highly detailed career goal and uses AI to
reverse-engineer it into a structured roadmap: phases, skills,
intermediate roles, projects, certifications, and a realistic timeline —
rendered as an interactive graph the user can explore, not a static list.

## Core user journey

1. User enters a specific career goal in natural language.
2. AI analyzes the goal and generates a structured roadmap (phases →
   skills → projects/certifications → timeline).
3. The roadmap renders as an interactive, zoomable/pannable graph.
4. User clicks a node to see detail and an AI-generated action plan.
5. User marks skills they already know; the roadmap replans around that.
6. User tracks progress over time.

## Core MVP features

1. Career goal input
2. AI roadmap generation
3. Interactive roadmap (graph/skill-tree/timeline, not a checklist)
4. Clickable roadmap nodes
5. AI-generated actionable advice per node
6. Dynamic replanning when skills are marked known
7. Progress tracking
8. Responsive web experience (usable on mobile)

## Future features (post-MVP)

- Time-budget personalization (hours/week available)
- Career path comparison (compare two goals side by side)
- Sharing/export of a roadmap
- Authentication and saved roadmaps across sessions

## Product boundaries

- Not a chat interface — the roadmap graph is the primary surface.
- Not a generic course catalog — recommendations are generated per goal,
  not pulled from a fixed list.
- No payments, notifications, or analytics in the MVP.
