"use client";

import { useState } from "react";
import Link from "next/link";
import { useSessionStorageValue } from "@/hooks/useSessionStorageValue";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import type { OnboardingData } from "@/lib/validation/onboarding";
import type { CareerRoadmap } from "@/types/roadmap";

const DATA_STORAGE_KEY = "careerforge.onboarding.data";

type GenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; roadmap: CareerRoadmap };

/**
 * Proves the Step 4 pipeline (onboarding → /api/roadmap/generate → AI →
 * Zod validation → CareerRoadmap) with a plain structured presentation.
 * This is deliberately not the interactive graph — that's Step 5.
 */
export default function RoadmapPage() {
  const raw = useSessionStorageValue(DATA_STORAGE_KEY);
  const [state, setState] = useState<GenerationState>({ status: "idle" });

  let onboardingData: OnboardingData | null = null;
  if (raw) {
    try {
      onboardingData = JSON.parse(raw);
    } catch {
      onboardingData = null;
    }
  }

  async function handleGenerate() {
    if (!onboardingData) return;
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(onboardingData),
      });
      const body = await response.json();
      if (!response.ok) {
        setState({
          status: "error",
          message: body.error ?? "Something went wrong generating the roadmap.",
        });
        return;
      }
      setState({ status: "success", roadmap: body.roadmap });
    } catch {
      setState({
        status: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  return (
    <MarketingLayout>
      <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 px-4 py-24">
        <Card className="text-left">
          <CardHeader>
            <Badge variant="primary" className="mb-2 w-fit">
              Step 4 — AI roadmap engine
            </Badge>
            <CardTitle>Your career roadmap</CardTitle>
            <CardDescription>
              This is a structured data preview proving the generation
              pipeline — the real interactive graph ships in Step 5.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {onboardingData ? (
              <>
                <div className="rounded-md border border-border bg-surface p-4 text-sm">
                  <p className="font-medium text-foreground">
                    {onboardingData.careerGoal.title}
                  </p>
                  {onboardingData.careerGoal.targetContext?.details && (
                    <p className="text-muted-foreground">
                      {onboardingData.careerGoal.targetContext.details}
                    </p>
                  )}
                  <p className="mt-2 text-muted-foreground">
                    {onboardingData.experienceLevel} ·{" "}
                    {onboardingData.existingSkills.length > 0
                      ? `${onboardingData.existingSkills.length} known skills`
                      : "starting from the basics"}{" "}
                    ·{" "}
                    {typeof onboardingData.weeklyHours === "number"
                      ? `${onboardingData.weeklyHours}h`
                      : onboardingData.weeklyHours}
                    /week
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={state.status === "loading"}
                  className="self-start"
                >
                  {state.status === "loading"
                    ? "Generating…"
                    : state.status === "success"
                      ? "Regenerate roadmap"
                      : "Generate my roadmap"}
                </Button>

                {state.status === "error" && (
                  <p role="alert" className="text-sm text-destructive">
                    {state.message}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/onboarding"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Edit my answers
                  </Link>
                  <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                    Back to home
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  No onboarding data found yet — start there first.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/onboarding"
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Start onboarding
                  </Link>
                  <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                    Back to home
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {state.status === "success" && <RoadmapPreview roadmap={state.roadmap} />}
      </div>
    </MarketingLayout>
  );
}

function RoadmapPreview({ roadmap }: { roadmap: CareerRoadmap }) {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>{roadmap.summary}</CardTitle>
        <CardDescription>
          ~{roadmap.totalEstimatedWeeks} weeks · {roadmap.phases.length} phases ·{" "}
          {roadmap.nodes.length} nodes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {roadmap.phases
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((phase) => (
            <div key={phase.id} className="border-l-2 border-primary/40 pl-4">
              <p className="text-sm font-semibold text-foreground">
                {phase.title}{" "}
                <span className="font-normal text-muted-foreground">
                  — ~{phase.estimatedWeeks}w
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{phase.summary}</p>

              {phase.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {phase.skills.map((skill) => (
                    <Badge key={skill.id}>{skill.name}</Badge>
                  ))}
                </div>
              )}

              {phase.milestones.length > 0 && (
                <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
                  {phase.milestones.map((m) => (
                    <li key={m.id}>{m.title}</li>
                  ))}
                </ul>
              )}

              {phase.entryRoles.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Entry role: {phase.entryRoles.map((r) => r.title).join(", ")}
                </p>
              )}
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
