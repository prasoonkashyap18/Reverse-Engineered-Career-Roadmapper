/**
 * Onboarding domain types. These describe the structured data Step 3
 * collects; Step 4 will consume the validated shape
 * (see lib/validation/onboarding.ts) to generate a roadmap.
 */

export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const TARGET_TIMELINES = [
  "3_months",
  "6_months",
  "9_months",
  "12_months",
  "no_deadline",
] as const;
export type TargetTimeline = (typeof TARGET_TIMELINES)[number];

export const TARGET_CONTEXT_CATEGORIES = [
  "Startup",
  "Product Company",
  "MNC",
  "Research",
  "Agency",
  "Freelance",
  "Other",
] as const;
export type TargetContextCategory = (typeof TARGET_CONTEXT_CATEGORIES)[number];

export const WEEKLY_HOURS_PRESETS = [5, 10, 15] as const;
/** "20+" stands in for any commitment of 20 hours/week or more. */
export type WeeklyHours = number | "20+";

/**
 * In-progress wizard state. Every field is nullable/empty until the user
 * fills it in — contrast with OnboardingData (lib/validation/onboarding.ts),
 * which is the fully validated shape required before final submission.
 */
export interface OnboardingDraft {
  careerGoalTitle: string;
  targetContextCategory: TargetContextCategory | null;
  targetContextDetails: string;
  experienceLevel: ExperienceLevel | null;
  existingSkills: string[];
  weeklyHours: WeeklyHours | null;
  targetTimeline: TargetTimeline | null;
}

export const EMPTY_ONBOARDING_DRAFT: OnboardingDraft = {
  careerGoalTitle: "",
  targetContextCategory: null,
  targetContextDetails: "",
  experienceLevel: null,
  existingSkills: [],
  weeklyHours: null,
  targetTimeline: null,
};
