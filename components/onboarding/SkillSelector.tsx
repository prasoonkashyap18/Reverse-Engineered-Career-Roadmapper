"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { skillNameSchema } from "@/lib/validation/onboarding";

const SUGGESTED_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "SQL",
  "Git",
  "Docker",
  "AWS",
  "Machine Learning",
  "Data Structures",
  "System Design",
  "Linux",
  "Java",
  "C++",
] as const;

export interface SkillSelectorProps {
  selected: string[];
  onChange: (skills: string[]) => void;
}

function normalize(skill: string) {
  return skill.trim().toLowerCase();
}

export function SkillSelector({ selected, onChange }: SkillSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const extraSkills = selected.filter(
    (skill) => !SUGGESTED_SKILLS.some((s) => normalize(s) === normalize(skill)),
  );
  const chips = [...SUGGESTED_SKILLS, ...extraSkills];

  function isSelected(skill: string) {
    return selected.some((s) => normalize(s) === normalize(skill));
  }

  function toggleSkill(skill: string) {
    if (isSelected(skill)) {
      onChange(selected.filter((s) => normalize(s) !== normalize(skill)));
    } else {
      onChange([...selected, skill]);
    }
  }

  function handleAddCustomSkill() {
    const result = skillNameSchema.safeParse(customInput);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid skill.");
      return;
    }
    if (isSelected(result.data)) {
      setError("You've already added that skill.");
      return;
    }
    onChange([...selected, result.data]);
    setCustomInput("");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Suggested skills</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested skills">
          {chips.map((skill) => {
            const active = isSelected(skill);
            return (
              <button
                key={skill}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-surface text-foreground hover:bg-surface-elevated",
                )}
              >
                {skill}
                {active && <span aria-hidden> ✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="custom-skill" className="mb-2 block text-sm font-medium text-foreground">
          Add another skill
        </label>
        <div className="flex gap-2">
          <Input
            id="custom-skill"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomSkill();
              }
            }}
            placeholder="e.g. Kubernetes"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "custom-skill-error" : undefined}
          />
          <Button type="button" variant="secondary" onClick={handleAddCustomSkill}>
            Add
          </Button>
        </div>
        {error && (
          <p id="custom-skill-error" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {selected.length === 0
          ? "No worries if nothing fits yet — we'll start from the basics."
          : `${selected.length} skill${selected.length === 1 ? "" : "s"} selected.`}
      </p>
    </div>
  );
}
