"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { OnboardingDraft } from "@/types/onboarding";

export interface StepProps {
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  error?: string | null;
}

export function CareerGoalStep({ draft, updateDraft, error }: StepProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="career-goal">Your target career</Label>
      <Input
        id="career-goal"
        value={draft.careerGoalTitle}
        onChange={(e) => updateDraft({ careerGoalTitle: e.target.value })}
        placeholder="e.g. AI Engineer at a fintech startup in India"
        maxLength={120}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "career-goal-error" : "career-goal-hint"}
        autoFocus
      />
      {error ? (
        <p id="career-goal-error" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p id="career-goal-hint" className="text-sm text-muted-foreground">
          Be specific — the role, industry, and type of company if you know
          it. &quot;Data Scientist in healthcare&quot; beats &quot;Data
          Scientist&quot;.
        </p>
      )}
    </div>
  );
}
