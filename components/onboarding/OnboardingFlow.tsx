"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { CareerGoalStep } from "@/components/onboarding/steps/CareerGoalStep";
import { TargetContextStep } from "@/components/onboarding/steps/TargetContextStep";
import { ExperienceStep } from "@/components/onboarding/steps/ExperienceStep";
import { SkillsStep } from "@/components/onboarding/steps/SkillsStep";
import { TimeBudgetStep } from "@/components/onboarding/steps/TimeBudgetStep";
import { TimelineStep } from "@/components/onboarding/steps/TimelineStep";
import { ReviewStep } from "@/components/onboarding/steps/ReviewStep";
import { Button } from "@/components/ui/Button";
import {
  careerGoalTitleSchema,
  existingSkillsSchema,
  onboardingDataSchema,
  targetContextDetailsSchema,
  weeklyHoursSchema,
} from "@/lib/validation/onboarding";
import { EMPTY_ONBOARDING_DRAFT, type OnboardingDraft } from "@/types/onboarding";

const DRAFT_STORAGE_KEY = "careerforge.onboarding.draft";
const DATA_STORAGE_KEY = "careerforge.onboarding.data";

const STEPS = [
  {
    id: "career-goal",
    label: "Career goal",
    title: "What career are you building toward?",
    description: "A specific, detailed goal produces a better roadmap than a vague one.",
  },
  {
    id: "context",
    label: "Target context",
    title: "Where do you picture yourself working?",
    description: "Optional — helps CareerForge tailor the path ahead.",
  },
  {
    id: "experience",
    label: "Experience",
    title: "Where are you starting from?",
    description: "Pick the option that best describes you today.",
  },
  {
    id: "skills",
    label: "Skills",
    title: "What do you already know?",
    description: "We'll skip teaching you what you've already got.",
  },
  {
    id: "time",
    label: "Weekly time",
    title: "How much time can you realistically invest each week?",
    description: "Be honest — this paces the roadmap ahead.",
  },
  {
    id: "timeline",
    label: "Timeline",
    title: "When would you like to be ready?",
    description: "An estimate is fine; nothing here is locked in.",
  },
  {
    id: "review",
    label: "Review",
    title: "Review your roadmap request",
    description: "Make sure this looks right before CareerForge gets to work.",
  },
] as const;

function validateStep(stepId: string, draft: OnboardingDraft): string | null {
  switch (stepId) {
    case "career-goal": {
      const result = careerGoalTitleSchema.safeParse(draft.careerGoalTitle);
      return result.success ? null : (result.error.issues[0]?.message ?? "Invalid input.");
    }
    case "context": {
      const result = targetContextDetailsSchema.safeParse(draft.targetContextDetails);
      return result.success ? null : (result.error.issues[0]?.message ?? "Invalid input.");
    }
    case "experience":
      return draft.experienceLevel ? null : "Pick one to continue.";
    case "skills": {
      const result = existingSkillsSchema.safeParse(draft.existingSkills);
      return result.success ? null : (result.error.issues[0]?.message ?? "Invalid skills.");
    }
    case "time": {
      if (draft.weeklyHours === null) return "Pick or enter a number to continue.";
      const result = weeklyHoursSchema.safeParse(draft.weeklyHours);
      return result.success ? null : (result.error.issues[0]?.message ?? "Invalid value.");
    }
    case "timeline":
      return draft.targetTimeline ? null : "Pick one to continue.";
    default:
      return null;
  }
}

export function OnboardingFlow() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_ONBOARDING_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Hydrate from sessionStorage exactly once, on mount, then let the write
  // effect below take over. `hydrated` is deliberately *state*, not a ref:
  // a ref mutated inside this effect becomes visible to the write effect
  // within the very same passive-effect flush — before the hydrated draft
  // has actually rendered — so the write effect would still see the old
  // (empty) `draft` closure, immediately overwrite sessionStorage with it,
  // and permanently clobber the real stored draft. A ref is also what
  // caused the original bug here: a prior version used one to gate a
  // content-diffed reapplication of the raw stored string on every render,
  // which raced the same way against the write effect (the value a render
  // reads back is always one commit behind the latest keystroke) and
  // reverted every character the user typed, forcing each key to be
  // pressed twice before it stuck. State fixes both: React only exposes a
  // new state value to effects once a render has actually committed with
  // it, so the write effect can never observe "hydrated" without also
  // observing the hydrated `draft`.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time sync from sessionStorage on mount, not a reactive subscription
        setDraft({ ...EMPTY_ONBOARDING_DRAFT, ...parsed });
      }
    } catch {
      // Malformed or inaccessible storage — start fresh.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Best-effort persistence only.
    }
  }, [draft, hydrated]);

  function updateDraft(patch: Partial<OnboardingDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    if (error) setError(null);
  }

  const step = STEPS[currentIndex];

  function goTo(index: number) {
    setError(null);
    setCurrentIndex(index);
  }

  function handleBack() {
    if (currentIndex === 0) return;
    goTo(currentIndex - 1);
  }

  function handleNext() {
    const validationError = validateStep(step.id, draft);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (currentIndex < STEPS.length - 1) goTo(currentIndex + 1);
  }

  function handleEdit(stepId: string) {
    const index = STEPS.findIndex((s) => s.id === stepId);
    if (index >= 0) goTo(index);
  }

  function handleSubmit() {
    const payload = {
      careerGoal: {
        title: draft.careerGoalTitle.trim(),
        targetContext:
          draft.targetContextCategory || draft.targetContextDetails.trim()
            ? {
                category: draft.targetContextCategory ?? undefined,
                details: draft.targetContextDetails.trim() || undefined,
              }
            : undefined,
      },
      experienceLevel: draft.experienceLevel,
      existingSkills: draft.existingSkills,
      weeklyHours: draft.weeklyHours,
      targetTimeline: draft.targetTimeline,
    };

    const result = onboardingDataSchema.safeParse(payload);
    if (!result.success) {
      setSubmitError(
        "Something's incomplete — use Edit above to fill in the missing pieces.",
      );
      return;
    }

    try {
      sessionStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(result.data));
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Best-effort persistence only — still navigate forward.
    }
    router.push("/roadmap");
  }

  const isReview = step.id === "review";

  return (
    <OnboardingLayout>
      <OnboardingProgress
        currentIndex={currentIndex}
        totalSteps={STEPS.length}
        stepLabel={step.label}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col gap-6"
        >
          {!isReview && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {step.title}
              </h1>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          )}

          <div className="flex-1">
            {step.id === "career-goal" && (
              <CareerGoalStep draft={draft} updateDraft={updateDraft} error={error} />
            )}
            {step.id === "context" && (
              <TargetContextStep draft={draft} updateDraft={updateDraft} error={error} />
            )}
            {step.id === "experience" && (
              <>
                <ExperienceStep draft={draft} updateDraft={updateDraft} error={error} />
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </>
            )}
            {step.id === "skills" && (
              <SkillsStep draft={draft} updateDraft={updateDraft} error={error} />
            )}
            {step.id === "time" && (
              <>
                <TimeBudgetStep draft={draft} updateDraft={updateDraft} error={error} />
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </>
            )}
            {step.id === "timeline" && (
              <>
                <TimelineStep draft={draft} updateDraft={updateDraft} error={error} />
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </>
            )}
            {isReview && (
              <>
                <ReviewStep draft={draft} onEdit={handleEdit} />
                {submitError && (
                  <p role="alert" className="mt-4 text-sm text-destructive">
                    {submitError}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          Back
        </Button>
        {isReview ? (
          <Button type="button" size="lg" onClick={handleSubmit}>
            Generate My Career Roadmap
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={handleNext}>
            {currentIndex === STEPS.length - 2 ? "Review" : "Continue"}
          </Button>
        )}
      </div>
    </OnboardingLayout>
  );
}
