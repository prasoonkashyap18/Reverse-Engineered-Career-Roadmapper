"use client";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { SelectableOption } from "@/components/onboarding/SelectableOption";
import { TARGET_CONTEXT_CATEGORIES } from "@/types/onboarding";
import type { StepProps } from "./CareerGoalStep";

export function TargetContextStep({ draft, updateDraft }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          What kind of place? <span className="text-muted-foreground">(optional)</span>
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TARGET_CONTEXT_CATEGORIES.map((category) => (
            <SelectableOption
              key={category}
              label={category}
              selected={draft.targetContextCategory === category}
              onSelect={() =>
                updateDraft({
                  targetContextCategory:
                    draft.targetContextCategory === category ? null : category,
                })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="target-context-details">
          Anything else? <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="target-context-details"
          value={draft.targetContextDetails}
          onChange={(e) => updateDraft({ targetContextDetails: e.target.value })}
          placeholder="e.g. Fintech startup in India, preferably remote"
          maxLength={200}
        />
      </div>
    </div>
  );
}
