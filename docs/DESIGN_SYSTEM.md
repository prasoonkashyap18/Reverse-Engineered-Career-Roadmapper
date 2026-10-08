# CareerForge — Design System

## Direction

CareerForge should feel like a premium career-strategy platform, not a
generic AI chatbot: dark-first, confident typography, restrained use of
gradients and glass effects, clean cards, generous spacing, clear
hierarchy, accessible contrast. The roadmap graph (Step 5) is the
eventual visual centerpiece — the rest of the UI should stay quiet so the
roadmap can stand out.

Avoid: excessive gradients, excessive glassmorphism, excessive animation,
decorative clutter, large color palettes.

## Tokens

Defined as CSS variables in `app/globals.css`, exposed to Tailwind via
`@theme inline` so they're usable as `bg-background`, `text-foreground`,
`border-border`, etc. Dark is the default (`:root`); a `data-theme="light"`
override exists for a future light mode toggle, if one is added.

| Token | Purpose |
| --- | --- |
| `background` / `foreground` | Page background and default text |
| `surface` | Low-emphasis fill (inputs, skeletons, progress track) |
| `surface-elevated` | Cards, dialogs — sits above `surface` |
| `muted-foreground` | Secondary text |
| `border` | Default border color |
| `primary` / `primary-foreground` | Brand accent and its contrasting text |
| `success` / `warning` / `destructive` | Status colors |
| `focus-ring` | Visible focus outline color |

Radii: `radius-sm` (0.375rem), `radius-md` (0.5rem), `radius-lg` (0.75rem).

## Typography

Geist Sans / Geist Mono (via `next/font/google`), loaded once in
`app/layout.tsx` and exposed as `font-sans` / `font-mono`.

## Components

Reusable primitives live in `components/ui/`: Button, Input, Textarea,
Label, Card (+ Header/Title/Description/Content), Badge, Progress,
Dialog, Separator, Skeleton. Each is a thin, accessible wrapper over a
native element — no heavy UI library dependency.

## Accessibility baseline

- Every interactive element has a visible focus state (`:focus-visible`
  uses `--focus-ring`).
- Labels are associated with form controls via the `Label` component.
- `Dialog` is built on the native `<dialog>` element for built-in focus
  trapping and Escape-to-close.
- Color choices meet WCAG AA contrast against their background token.

## Responsive baseline

Mobile-first Tailwind classes throughout; `Header`/`MobileNav` already
split into a desktop nav and a mobile menu as the pattern for future
pages to follow.
