"use client";

import { useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { OnboardingData } from "@/lib/validation/onboarding";
import type { NodeActionPlan } from "@/lib/validation/node-action";
import type { CareerRoadmap, RoadmapNode } from "@/types/roadmap";

const TYPE_LABEL: Record<RoadmapNode["type"], string> = {
  skill: "Skill",
  milestone: "Milestone",
  project: "Project",
  certification: "Certification",
  entry_role: "Entry role",
  phase: "Phase",
};

const PRIORITY_LABEL: Record<RoadmapNode["priority"], string> = {
  core: "Core",
  recommended: "Recommended",
  optional: "Optional",
};

export interface NodeDetailPanelProps {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
  node: RoadmapNode | null;
  onClose: () => void;
}

/**
 * Responsive node detail drawer: a right-side panel on desktop, a bottom
 * sheet on mobile — same underlying accessible Dialog primitive (focus
 * trap, Escape-to-close) from Step 1, just repositioned via className.
 * Keyed by node.id in the parent so each node gets a fresh, independent
 * AI-request state.
 */
export function NodeDetailPanel({ roadmap, onboarding, node, onClose }: NodeDetailPanelProps) {
  return (
    <Dialog
      open={node !== null}
      onClose={onClose}
      title={node?.label ?? ""}
      className={cn(
        "m-0 max-h-[85vh] w-full max-w-none overflow-y-auto rounded-b-none rounded-t-lg p-0",
        "inset-x-0 bottom-0 top-auto",
        "sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-[420px] sm:rounded-l-lg sm:rounded-r-none",
      )}
    >
      {node && (
        <NodeDetailBody
          key={node.id}
          roadmap={roadmap}
          onboarding={onboarding}
          node={node}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

type ActionPlanState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; plan: NodeActionPlan };

function NodeDetailBody({
  roadmap,
  onboarding,
  node,
  onClose,
}: {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
  node: RoadmapNode;
  onClose: () => void;
}) {
  const [state, setState] = useState<ActionPlanState>({ status: "idle" });

  const phase = roadmap.phases.find((p) => p.id === node.phaseId);
  const prerequisites = roadmap.edges
    .filter((e) => e.targetId === node.id)
    .map((e) => roadmap.nodes.find((n) => n.id === e.sourceId))
    .filter((n): n is RoadmapNode => Boolean(n));
  const dependents = roadmap.edges
    .filter((e) => e.sourceId === node.id)
    .map((e) => roadmap.nodes.find((n) => n.id === e.targetId))
    .filter((n): n is RoadmapNode => Boolean(n));

  async function requestActionPlan() {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/roadmap/node-action", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          node: { ...node, phaseTitle: phase?.title ?? "" },
          onboarding,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        setState({
          status: "error",
          message: body.error ?? "Something went wrong generating the action plan.",
        });
        return;
      }
      setState({ status: "success", plan: body.plan });
    } catch {
      setState({
        status: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">{TYPE_LABEL[node.type]}</Badge>
          <Badge>{PRIORITY_LABEL[node.priority]}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close node details">
          Close
        </Button>
      </div>

      <div>
        {phase && <p className="text-xs text-muted-foreground">{phase.title}</p>}
        {node.description && (
          <p className="mt-2 text-sm text-muted-foreground">{node.description}</p>
        )}
        {typeof node.durationWeeks === "number" && (
          <p className="mt-2 text-xs text-muted-foreground">
            Estimated duration: {node.durationWeeks} weeks
          </p>
        )}
      </div>

      {prerequisites.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Builds on
          </p>
          <ul className="mt-1.5 list-inside list-disc text-sm text-foreground">
            {prerequisites.map((p) => (
              <li key={p.id}>{p.label}</li>
            ))}
          </ul>
        </div>
      )}

      {dependents.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Leads to
          </p>
          <ul className="mt-1.5 list-inside list-disc text-sm text-foreground">
            {dependents.map((d) => (
              <li key={d.id}>{d.label}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-border pt-5">
        {state.status !== "success" && (
          <Button
            onClick={requestActionPlan}
            disabled={state.status === "loading"}
            className="w-full"
          >
            {state.status === "loading"
              ? "Thinking…"
              : state.status === "error"
                ? "Retry"
                : "Get AI action plan"}
          </Button>
        )}

        {state.status === "error" && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {state.message}
          </p>
        )}

        {state.status === "success" && <ActionPlanView plan={state.plan} />}
      </div>
    </div>
  );
}

function ActionPlanView({ plan }: { plan: NodeActionPlan }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground">{plan.explanation}</p>

      {plan.learningObjectives.length > 0 && (
        <Section title="What to learn">
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {plan.learningObjectives.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {plan.recommendedActions.length > 0 && (
        <Section title="Recommended next actions">
          <ol className="list-inside list-decimal text-sm text-muted-foreground">
            {plan.recommendedActions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </Section>
      )}

      {plan.projectIdea && (
        <Section title="Weekend project idea">
          <p className="text-sm font-medium text-foreground">{plan.projectIdea.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{plan.projectIdea.description}</p>
        </Section>
      )}

      {plan.interviewQuestions.length > 0 && (
        <Section title="Interview questions this prepares you for">
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {plan.interviewQuestions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      {plan.estimatedEffort && (
        <Section title="Estimated effort">
          <p className="text-sm text-muted-foreground">{plan.estimatedEffort}</p>
        </Section>
      )}

      {plan.resources.length > 0 && (
        <Section title="Resources">
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {plan.resources.map((r, i) => (
              <li key={i}>
                {r.label}
                {r.note ? ` — ${r.note}` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
