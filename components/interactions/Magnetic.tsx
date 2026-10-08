"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useFinePointer";

const MAX_OFFSET_PX = 8;
const PROXIMITY_PX = 70;

export interface MagneticProps {
  children: ReactNode;
}

/**
 * Wraps a single focusable element (a Button, a styled Link) and nudges it a
 * few pixels toward a nearby pointer. Purely decorative: the child stays
 * fully clickable, keyboard-focusable and touch-usable with zero pointer
 * movement. Measures the wrapper span itself rather than forwarding a ref
 * into the child, so any child element works unmodified.
 */
export function Magnetic({ children }: MagneticProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const isFinePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const active = isFinePointer && !reduceMotion;

  const x = useSpring(0, { stiffness: 260, damping: 20 });
  const y = useSpring(0, { stiffness: 260, damping: 20 });

  useEffect(() => {
    if (!active) return;

    let frame = 0;

    function handlePointerMove(e: globalThis.PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = wrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.hypot(dx, dy);
        const expanded = Math.max(rect.width, rect.height) / 2 + PROXIMITY_PX;

        if (distance < expanded) {
          const pull = 1 - distance / expanded;
          x.set((dx / expanded) * MAX_OFFSET_PX * pull);
          y.set((dy / expanded) * MAX_OFFSET_PX * pull);
        } else {
          x.set(0);
          y.set(0);
        }
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active, x, y]);

  return (
    <motion.span
      ref={wrapperRef}
      className="inline-block"
      style={{ x: active ? x : 0, y: active ? y : 0 }}
    >
      {children}
    </motion.span>
  );
}
