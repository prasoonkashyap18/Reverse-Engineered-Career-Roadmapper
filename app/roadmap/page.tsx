"use client";

import Link from "next/link";
import { useSessionStorageValue } from "@/hooks/useSessionStorageValue";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import type { OnboardingData } from "@/lib/validation/onboarding";

const DATA_STORAGE_KEY = "careerforge.onboarding.data";

/**
 * Step 4 boundary. Confirms the onboarding data CareerForge captured — it
 * does not call an AI provider and does not render a generated roadmap.
 * The real roadmap-generation engine ships in Step 4.
 */
export default function RoadmapPlaceholder() {
  const raw = useSessionStorageValue(DATA_STORAGE_KEY);

  let data: OnboardingData | null = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  return (
    <MarketingLayout>
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <Card className="w-full text-left">
          <CardHeader>
            <Badge variant="primary" className="mb-2 w-fit">
              Step 4 — coming next
            </Badge>
            <CardTitle>Your roadmap generator isn&apos;t built yet</CardTitle>
            <CardDescription>
              CareerForge captured your onboarding answers. The AI engine
              that turns them into an actual roadmap is Step 4 of this
              project and hasn&apos;t been built — nothing was generated.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {data ? (
              <div className="rounded-md border border-border bg-surface p-4 text-sm">
                <p className="font-medium text-foreground">{data.careerGoal.title}</p>
                {data.careerGoal.targetContext?.details && (
                  <p className="text-muted-foreground">
                    {data.careerGoal.targetContext.details}
                  </p>
                )}
                <p className="mt-2 text-muted-foreground">
                  {data.experienceLevel} ·{" "}
                  {data.existingSkills.length > 0
                    ? `${data.existingSkills.length} known skills`
                    : "starting from the basics"}{" "}
                  ·{" "}
                  {typeof data.weeklyHours === "number"
                    ? `${data.weeklyHours}h`
                    : data.weeklyHours}
                  /week
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No onboarding data found yet — start there first.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding" className={buttonVariants({ variant: "secondary" })}>
                {data ? "Edit my answers" : "Start onboarding"}
              </Link>
              <Link href="/" className={buttonVariants({ variant: "ghost" })}>
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
}
