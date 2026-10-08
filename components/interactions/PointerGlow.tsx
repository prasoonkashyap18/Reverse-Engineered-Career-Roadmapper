"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/utils/cn";

/**
 * Full-bleed decorative background layer whose radial highlight follows the
 * pointer. Purely cosmetic: fixed opacity fallback on touch devices and when
 * prefers-reduced-motion is set, so content never depends on it.
 */
export function PointerGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isFinePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const active = isFinePointer && !reduceMotion;

  useEffect(() => {
    if (!active) return;

    let frame = 0;

    function handlePointerMove(e: globalThis.PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        ref.current?.style.setProperty("--pointer-x", `${e.clientX}px`);
        ref.current?.style.setProperty("--pointer-y", `${e.clientY}px`);
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 -z-10", className)}
      style={{
        background: active
          ? "radial-gradient(600px circle at var(--pointer-x, 50%) var(--pointer-y, 30%), color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)"
          : "radial-gradient(600px circle at 50% 20%, color-mix(in srgb, var(--primary) 8%, transparent), transparent 70%)",
      }}
    />
  );
}
