import type { Edge, Node } from "@xyflow/react";
import type { CareerRoadmap, RoadmapNodeType, RoadmapNodePriority } from "@/types/roadmap";

/**
 * Turns a CareerRoadmap's flat nodes/edges into a positioned React Flow
 * graph. No layout library — a simple phase-column bucket layout is
 * enough here and keeps the dependency list small. Columns are the
 * roadmap's phases (left to right, by `order`); within a column, nodes
 * are grouped by type in a fixed, readable order.
 */

const COLUMN_WIDTH = 280;
const ROW_HEIGHT = 104;

const TYPE_ORDER: RoadmapNodeType[] = [
  "skill",
  "milestone",
  "project",
  "certification",
  "entry_role",
  "phase",
];

export interface RoadmapFlowData {
  label: string;
  type: RoadmapNodeType;
  phaseTitle: string;
  durationWeeks?: number;
  priority: RoadmapNodePriority;
  description?: string;
  dimmed?: boolean;
  [key: string]: unknown;
}

export function buildRoadmapFlow(
  roadmap: CareerRoadmap,
): { nodes: Node<RoadmapFlowData>[]; edges: Edge[] } {
  const phasesByOrder = [...roadmap.phases].sort((a, b) => a.order - b.order);
  const phaseColumn = new Map(phasesByOrder.map((p, i) => [p.id, i]));
  const phaseTitle = new Map(phasesByOrder.map((p) => [p.id, p.title]));
  const trailingColumn = phasesByOrder.length;

  const columns = new Map<number, typeof roadmap.nodes>();
  for (const node of roadmap.nodes) {
    const column = phaseColumn.get(node.phaseId) ?? trailingColumn;
    const bucket = columns.get(column) ?? [];
    bucket.push(node);
    columns.set(column, bucket);
  }

  const nodes: Node<RoadmapFlowData>[] = [];
  for (const [column, columnNodes] of columns) {
    const sorted = [...columnNodes].sort(
      (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
    );
    sorted.forEach((node, row) => {
      nodes.push({
        id: node.id,
        type: "roadmapNode",
        position: { x: column * COLUMN_WIDTH, y: row * ROW_HEIGHT },
        data: {
          label: node.label,
          type: node.type,
          phaseTitle: phaseTitle.get(node.phaseId) ?? "",
          durationWeeks: node.durationWeeks,
          priority: node.priority,
          description: node.description,
        },
        draggable: false,
      });
    });
  }

  // Drop edges whose endpoints don't resolve to a rendered node — the AI
  // prompt allows an edge to reference a phase id, which isn't always
  // rendered as its own node; safer to omit than to crash or mislink.
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges: Edge[] = roadmap.edges
    .filter((e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId))
    .map((e) => ({
      id: e.id,
      source: e.sourceId,
      target: e.targetId,
      type: "smoothstep",
    }));

  return { nodes, edges };
}
