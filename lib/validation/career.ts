import { z } from "zod";

/**
 * Zod schemas mirroring types/career.ts.
 *
 * Step 4 (AI roadmap generation) will extend these to validate
 * AI-generated responses before they enter application state.
 * Keep this file in sync with the domain types.
 */

export const skillLevelSchema = z.enum([
  "unknown",
  "familiar",
  "proficient",
  "expert",
]);

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  level: skillLevelSchema,
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  provider: z.string().optional(),
  url: z.string().url().optional(),
});

export const projectRecommendationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  skillIds: z.array(z.string()),
});

export const milestoneSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedWeeks: z.number().positive(),
});

export const careerPhaseSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number().int().nonnegative(),
  skills: z.array(skillSchema),
  milestones: z.array(milestoneSchema),
  projects: z.array(projectRecommendationSchema),
  certifications: z.array(certificationSchema),
});

export const careerGoalSchema = z.object({
  id: z.string(),
  rawInput: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string(),
});

export const userProfileSchema = z.object({
  id: z.string(),
  knownSkillIds: z.array(z.string()),
  weeklyHoursAvailable: z.number().positive().optional(),
});
