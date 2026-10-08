"use client";

import { SelectableOption } from "@/components/onboarding/SelectableOption";
import { EXPERIENCE_LEVELS, type ExperienceLevel } from "@/types/onboarding";
import type { StepProps } from "./CareerGoalStep";

export const EXPERIENCE_LEVEL_LABELS: Record<
  ExperienceLevel,
  { label: string; description: string }
> = {
  beginner: {
    label: "Beginner",
    description: "Little or no professional experience in this field.",
  },
  intermediate: {
    label: "Intermediate",
    description: "I understand the fundamentals and have built some projects.",
  },
  advanced: {
    label: "Advanced",
    description: "I have substantial practical experience and want to close specific gaps.",
  },
};

export function ExperienceStep({ draft, updateDraft }: StepProps) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Current experience level">
      {EXPERIENCE_LEVELS.map((level) => (
        <SelectableOption
          key={level}
          label={EXPERIENCE_LEVEL_LABELS[level].label}
          description={EXPERIENCE_LEVEL_LABELS[level].description}
          selected={draft.experienceLevel === level}
          onSelect={() => updateDraft({ experienceLevel: level })}
        />
      ))}
    </div>
  );
}
