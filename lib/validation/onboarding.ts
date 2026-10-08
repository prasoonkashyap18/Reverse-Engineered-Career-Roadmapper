import { z } from "zod";
import {
  EXPERIENCE_LEVELS,
  TARGET_CONTEXT_CATEGORIES,
  TARGET_TIMELINES,
} from "@/types/onboarding";

/**
 * Validation for the fully-filled onboarding wizard. These schemas are also
 * used per-field to validate a single step before the user can continue.
 */

export const careerGoalTitleSchema = z
  .string()
  .trim()
  .min(3, "Be a little more specific — at least 3 characters.")
  .max(120, "Keep it under 120 characters.");

export const targetContextDetailsSchema = z
  .string()
  .trim()
  .max(200, "Keep it under 200 characters.");

export const skillNameSchema = z
  .string()
  .trim()
  .min(1, "Skill can't be empty.")
  .max(40, "Keep skill names under 40 characters.");

export const existingSkillsSchema = z
  .array(skillNameSchema)
  .max(30, "That's a lot of skills — keep it to 30 or fewer.")
  .refine(
    (skills) => new Set(skills.map((s) => s.toLowerCase())).size === skills.length,
    "Duplicate skills aren't allowed.",
  );

export const weeklyHoursSchema = z.union([
  z.number().int().min(1, "Must be at least 1 hour.").max(80, "That's more hours than a week has to give — try a smaller number."),
  z.literal("20+"),
]);

export const experienceLevelSchema = z.enum(EXPERIENCE_LEVELS);
export const targetTimelineSchema = z.enum(TARGET_TIMELINES);
export const targetContextCategorySchema = z.enum(TARGET_CONTEXT_CATEGORIES);

export const onboardingDataSchema = z.object({
  careerGoal: z.object({
    title: careerGoalTitleSchema,
    targetContext: z
      .object({
        category: targetContextCategorySchema.optional(),
        details: targetContextDetailsSchema.optional(),
      })
      .optional(),
  }),
  experienceLevel: experienceLevelSchema,
  existingSkills: existingSkillsSchema,
  weeklyHours: weeklyHoursSchema,
  targetTimeline: targetTimelineSchema,
});

export type OnboardingData = z.infer<typeof onboardingDataSchema>;
