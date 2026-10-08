import { PointerGlow } from "@/components/interactions/PointerGlow";

/**
 * Subtle, non-competing backdrop: a faint grid plus a pointer-reactive glow.
 * Fixed and pointer-events-none so it never interferes with content or input.
 */
export function BackgroundField() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-background [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--border)_60%,transparent)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_90%)]"
      />
      <PointerGlow />
    </>
  );
}
