"use client";

import { SkillSelector } from "@/components/onboarding/SkillSelector";
import type { StepProps } from "./CareerGoalStep";

export function SkillsStep({ draft, updateDraft }: StepProps) {
  return (
    <SkillSelector
      selected={draft.existingSkills}
      onChange={(existingSkills) => updateDraft({ existingSkills })}
    />
  );
}
