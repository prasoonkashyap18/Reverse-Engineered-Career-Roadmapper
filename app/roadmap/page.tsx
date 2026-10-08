"use client";

import { useState } from "react";
import Link from "next/link";
import { useSessionStorageValue } from "@/hooks/useSessionStorageValue";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { RoadmapGraph } from "@/components/roadmap/RoadmapGraph";
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
              AI-generated roadmap
            </Badge>
            <CardTitle>Your career roadmap</CardTitle>
            <CardDescription>
              Explore it as a graph — zoom, pan, and click a node to see
              what it connects to. Detailed per-node guidance is coming in
              a later step.
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

        {state.status === "success" && onboardingData && (
          <RoadmapPreview roadmap={state.roadmap} onboarding={onboardingData} />
        )}
      </div>
    </MarketingLayout>
  );
}

function RoadmapPreview({
  roadmap,
  onboarding,
}: {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
}) {
  if (roadmap.nodes.length === 0) {
    return (
      <Card className="text-left">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            The AI returned a roadmap with no nodes to visualize. Try
            regenerating.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>{roadmap.summary}</CardTitle>
        <CardDescription>
          ~{roadmap.totalEstimatedWeeks} weeks · {roadmap.phases.length} phases ·{" "}
          {roadmap.nodes.length} nodes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RoadmapGraph roadmap={roadmap} onboarding={onboarding} />
      </CardContent>
    </Card>
  );
}
