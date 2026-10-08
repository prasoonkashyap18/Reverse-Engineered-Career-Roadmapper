import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { cn } from "@/lib/utils/cn";
import type { RoadmapFlowData } from "@/components/roadmap/layout";

const TYPE_LABEL: Record<RoadmapFlowData["type"], string> = {
  skill: "Skill",
  milestone: "Milestone",
  project: "Project",
  certification: "Certification",
  entry_role: "Entry role",
  phase: "Phase",
};

const TYPE_BORDER: Record<RoadmapFlowData["type"], string> = {
  skill: "border-l-primary",
  milestone: "border-l-warning",
  project: "border-l-success",
  certification: "border-l-muted-foreground",
  entry_role: "border-l-destructive",
  phase: "border-l-foreground",
};

const PRIORITY_LABEL: Record<string, string> = {
  core: "Core",
  recommended: "Recommended",
  optional: "Optional",
};

type RoadmapNodeProps = NodeProps<Node<RoadmapFlowData>>;

/**
 * The single node renderer for the roadmap graph. Visual distinction
 * between node types comes from a colored left border + a text label
 * (type, phase, priority) — never color alone, per the accessibility
 * requirement.
 */
export function RoadmapNodeCard({ data, selected }: RoadmapNodeProps) {
  return (
    <div
      className={cn(
        "min-w-[200px] max-w-[240px] rounded-md border border-l-4 bg-surface px-3 py-2.5 text-left shadow-sm transition-opacity duration-200 motion-reduce:transition-none",
        TYPE_BORDER[data.type],
        selected && "ring-2 ring-primary",
        data.dimmed ? "opacity-30" : "opacity-100",
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-none !bg-border" />

      <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
        {TYPE_LABEL[data.type]}
        {data.phaseTitle ? ` · ${data.phaseTitle}` : ""}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-foreground">{data.label}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {typeof data.durationWeeks === "number" && <span>{data.durationWeeks}w</span>}
        <span>{PRIORITY_LABEL[data.priority] ?? data.priority}</span>
      </div>

      <Handle type="source" position={Position.Right} className="!border-none !bg-border" />
    </div>
  );
}
