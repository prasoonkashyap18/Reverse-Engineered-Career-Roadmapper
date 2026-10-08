"use client";

import { type PointerEvent, type ReactNode, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useFinePointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/utils/cn";

const MAX_TILT_DEG = 3;

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps children in a card that tilts a few degrees toward the pointer and
 * shows a soft glow following it. No-ops on touch devices and when
 * prefers-reduced-motion is set.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useFinePointer();
  const reduceMotion = useReducedMotion();
  const active = isFinePointer && !reduceMotion;
  const [hovering, setHovering] = useState(false);

  const rotateX = useSpring(0, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * MAX_TILT_DEG * 2);
    rotateX.set((0.5 - py) * MAX_TILT_DEG * 2);
    glowRef.current?.style.setProperty("--glow-x", `${px * 100}%`);
    glowRef.current?.style.setProperty("--glow-y", `${py * 100}%`);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
    setHovering(false);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => active && setHovering(true)}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-surface-elevated",
        className,
      )}
    >
      {active && (
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovering ? 1 : 0,
            background:
              "radial-gradient(240px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%)",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
