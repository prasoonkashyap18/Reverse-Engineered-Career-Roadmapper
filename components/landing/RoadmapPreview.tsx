"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface TeaserNode {
  id: string;
  label: string;
  x: number;
  y: number;
  emphasis?: "target" | "default";
}

const NODES: TeaserNode[] = [
  { id: "goal", label: "Dream Role", x: 50, y: 8 },
  { id: "direction", label: "Career Direction", x: 50, y: 26 },
  { id: "skills", label: "Core Skills", x: 22, y: 48 },
  { id: "projects", label: "Proof Projects", x: 78, y: 48 },
  { id: "interview", label: "Interview Ready", x: 50, y: 70 },
  { id: "role", label: "Target Role", x: 50, y: 92, emphasis: "target" },
];

const EDGES: [string, string][] = [
  ["goal", "direction"],
  ["direction", "skills"],
  ["direction", "projects"],
  ["skills", "interview"],
  ["projects", "interview"],
  ["interview", "role"],
];

/**
 * Visual teaser for the future interactive roadmap (Step 5). Not a real
 * graph engine — a hand-built SVG/CSS illustration that responds to
 * hover/focus by highlighting the connected path.
 */
export function RoadmapPreview() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const connected = new Set<string>();
  if (activeId) {
    connected.add(activeId);
    for (const [a, b] of EDGES) {
      if (a === activeId) connected.add(b);
      if (b === activeId) connected.add(a);
    }
  }

  return (
    <div
      role="group"
      aria-label="Preview of an interactive career roadmap, illustrative only"
      className="relative aspect-[4/5] w-full max-w-md rounded-lg border border-border bg-surface-elevated p-4 sm:aspect-square"
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full p-4"
      >
        {EDGES.map(([fromId, toId]) => {
          const from = NODES.find((n) => n.id === fromId)!;
          const to = NODES.find((n) => n.id === toId)!;
          const isHighlighted =
            activeId !== null && connected.has(fromId) && connected.has(toId);
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "var(--primary)" : "var(--border)"}
              strokeWidth={isHighlighted ? 0.6 : 0.4}
              className="transition-[stroke,stroke-width] duration-300"
            />
          );
        })}
      </svg>

      {NODES.map((node, index) => {
        const isActive = activeId === node.id;
        const isDimmed = activeId !== null && !connected.has(node.id);
        const isTarget = node.emphasis === "target";

        return (
          <motion.button
            key={node.id}
            type="button"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            onPointerEnter={() => setActiveId(node.id)}
            onPointerLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(node.id)}
            onBlur={() => setActiveId(null)}
            onClick={() => setActiveId((current) => (current === node.id ? null : node.id))}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
              isTarget
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-foreground",
              isActive && "scale-110 shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_20%,transparent)]",
              isDimmed && "opacity-40",
            )}
          >
            {node.label}
          </motion.button>
        );
      })}
    </div>
  );
}
