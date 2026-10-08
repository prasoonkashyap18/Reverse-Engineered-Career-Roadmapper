"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { OnboardingDraft } from "@/types/onboarding";
import { EXPERIENCE_LEVEL_LABELS } from "./ExperienceStep";
import { TARGET_TIMELINE_LABELS } from "./TimelineStep";

export interface ReviewStepProps {
  draft: OnboardingDraft;
  onEdit: (stepId: string) => void;
}

function ReviewSection({
  heading,
  stepId,
  onEdit,
  children,
}: {
  heading: string;
  stepId: string;
  onEdit: (stepId: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onEdit(stepId)}>
        Edit
      </Button>
    </div>
  );
}

export function ReviewStep({ draft, onEdit }: ReviewStepProps) {
  const weeklyHoursLabel =
    draft.weeklyHours === null
      ? "—"
      : draft.weeklyHours === "20+"
        ? "20+ hours/week"
        : `${draft.weeklyHours} hours/week`;

  const targetContext = [draft.targetContextCategory, draft.targetContextDetails]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="flex flex-col">
      <ReviewSection heading="Career target" stepId="career-goal" onEdit={onEdit}>
        <p className="font-medium">{draft.careerGoalTitle || "—"}</p>
        {targetContext && <p className="text-muted-foreground">{targetContext}</p>}
      </ReviewSection>

      <ReviewSection heading="Starting point" stepId="experience" onEdit={onEdit}>
        {draft.experienceLevel ? EXPERIENCE_LEVEL_LABELS[draft.experienceLevel].label : "—"}
      </ReviewSection>

      <ReviewSection heading="Current skills" stepId="skills" onEdit={onEdit}>
        {draft.existingSkills.length === 0 ? (
          <p className="text-muted-foreground">Starting from the basics.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {draft.existingSkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        )}
      </ReviewSection>

      <ReviewSection heading="Time available" stepId="time" onEdit={onEdit}>
        {weeklyHoursLabel}
      </ReviewSection>

      <ReviewSection heading="Target" stepId="timeline" onEdit={onEdit}>
        {draft.targetTimeline ? TARGET_TIMELINE_LABELS[draft.targetTimeline] : "—"}
      </ReviewSection>
    </div>
  );
}
