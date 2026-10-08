"use client";

import { useState } from "react";
import { SelectableOption } from "@/components/onboarding/SelectableOption";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { WEEKLY_HOURS_PRESETS } from "@/types/onboarding";
import type { StepProps } from "./CareerGoalStep";

export function TimeBudgetStep({ draft, updateDraft }: StepProps) {
  const isCustom =
    typeof draft.weeklyHours === "number" &&
    !(WEEKLY_HOURS_PRESETS as readonly number[]).includes(draft.weeklyHours);
  const [customMode, setCustomMode] = useState(isCustom);

  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label="Weekly time commitment">
      {WEEKLY_HOURS_PRESETS.map((hours) => (
        <SelectableOption
          key={hours}
          label={`${hours} hours / week`}
          selected={!customMode && draft.weeklyHours === hours}
          onSelect={() => {
            setCustomMode(false);
            updateDraft({ weeklyHours: hours });
          }}
        />
      ))}
      <SelectableOption
        label="20+ hours / week"
        selected={!customMode && draft.weeklyHours === "20+"}
        onSelect={() => {
          setCustomMode(false);
          updateDraft({ weeklyHours: "20+" });
        }}
      />
      <SelectableOption
        label="A specific number"
        selected={customMode}
        onSelect={() => {
          setCustomMode(true);
          if (typeof draft.weeklyHours !== "number") {
            updateDraft({ weeklyHours: null });
          }
        }}
      />

      {customMode && (
        <div className="flex flex-col gap-2 pl-1 pt-2">
          <Label htmlFor="custom-hours">Hours per week</Label>
          <Input
            id="custom-hours"
            type="number"
            min={1}
            max={80}
            inputMode="numeric"
            value={typeof draft.weeklyHours === "number" ? draft.weeklyHours : ""}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              updateDraft({
                weeklyHours: e.target.value === "" || Number.isNaN(parsed) ? null : parsed,
              });
            }}
            placeholder="e.g. 8"
            className="max-w-32"
          />
        </div>
      )}
    </div>
  );
}
