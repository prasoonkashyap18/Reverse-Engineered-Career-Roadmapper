"use client";

import { SelectableOption } from "@/components/onboarding/SelectableOption";
import { TARGET_TIMELINES, type TargetTimeline } from "@/types/onboarding";
import type { StepProps } from "./CareerGoalStep";

export const TARGET_TIMELINE_LABELS: Record<TargetTimeline, string> = {
  "3_months": "3 months",
  "6_months": "6 months",
  "9_months": "9 months",
  "12_months": "12 months",
  no_deadline: "No fixed deadline",
};

export function TimelineStep({ draft, updateDraft }: StepProps) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Target timeline">
      {TARGET_TIMELINES.map((timeline) => (
        <SelectableOption
          key={timeline}
          label={TARGET_TIMELINE_LABELS[timeline]}
          selected={draft.targetTimeline === timeline}
          onSelect={() => updateDraft({ targetTimeline: timeline })}
        />
      ))}
    </div>
  );
}
