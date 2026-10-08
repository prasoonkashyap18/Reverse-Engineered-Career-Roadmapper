"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useReducedMotion } from "framer-motion";
import { buildRoadmapFlow } from "@/components/roadmap/layout";
import { RoadmapNodeCard } from "@/components/roadmap/nodes/RoadmapNodeCard";
import { NodeDetailPanel } from "@/components/roadmap/NodeDetailPanel";
import type { OnboardingData } from "@/lib/validation/onboarding";
import type { CareerRoadmap } from "@/types/roadmap";

const nodeTypes = { roadmapNode: RoadmapNodeCard };

export interface RoadmapGraphProps {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
}

/**
 * The interactive career roadmap graph (Step 5) plus per-node detail
 * (Step 6). Built from the real CareerRoadmap.nodes/edges — no hard-coded
 * structure. Clicking a node selects it (highlighting its directly
 * connected nodes/edges, same as Step 5) and opens a detail panel with an
 * explicit "Get AI action plan" action; clicking the background or
 * closing the panel clears the selection and restores normal graph
 * interaction.
 */
export function RoadmapGraph({ roadmap, onboarding }: RoadmapGraphProps) {
  const reduceMotion = useReducedMotion();
  const { nodes: baseNodes, edges: baseEdges } = useMemo(
    () => buildRoadmapFlow(roadmap),
    [roadmap],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const connectedIds = useMemo(() => {
    if (!selectedId) return null;
    const ids = new Set<string>([selectedId]);
    for (const edge of baseEdges) {
      if (edge.source === selectedId) ids.add(edge.target);
      if (edge.target === selectedId) ids.add(edge.source);
    }
    return ids;
  }, [selectedId, baseEdges]);

  const nodes = useMemo(
    () =>
      baseNodes.map((node) => ({
        ...node,
        selected: node.id === selectedId,
        data: {
          ...node.data,
          dimmed: connectedIds ? !connectedIds.has(node.id) : false,
        },
      })),
    [baseNodes, selectedId, connectedIds],
  );

  const edges = useMemo(
    () =>
      baseEdges.map((edge) => {
        const touchesSelection =
          selectedId !== null && (edge.source === selectedId || edge.target === selectedId);
        return {
          ...edge,
          style: {
            stroke: touchesSelection ? "var(--primary)" : "var(--border)",
            strokeWidth: touchesSelection ? 2 : 1.25,
            opacity: connectedIds && !touchesSelection ? 0.25 : 1,
          },
        };
      }),
    [baseEdges, selectedId, connectedIds],
  );

  const handleNodeClick = useCallback<NodeMouseHandler>((_event, node) => {
    setSelectedId((current) => (current === node.id ? null : node.id));
  }, []);

  const handlePaneClick = useCallback(() => setSelectedId(null), []);
  const handlePanelClose = useCallback(() => setSelectedId(null), []);

  const selectedNode = selectedId
    ? (roadmap.nodes.find((n) => n.id === selectedId) ?? null)
    : null;

  return (
    <div
      role="group"
      aria-label={`Career roadmap graph with ${baseNodes.length} nodes. Select a node to highlight its connections and see details.`}
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-border bg-surface-elevated"
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          fitView
          fitViewOptions={{ padding: 0.2, duration: reduceMotion ? 0 : 400 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          panOnScroll
          zoomOnPinch
          zoomOnDoubleClick={false}
          disableKeyboardA11y={false}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="var(--border)"
          />
          <Controls
            showInteractive={false}
            position="bottom-right"
            aria-label="Roadmap zoom and pan controls"
          />
        </ReactFlow>
      </ReactFlowProvider>

      <NodeDetailPanel
        roadmap={roadmap}
        onboarding={onboarding}
        node={selectedNode}
        onClose={handlePanelClose}
      />
    </div>
  );
}
