import { z } from "zod";
import {
  experienceLevelSchema,
  targetContextCategorySchema,
  targetTimelineSchema,
} from "@/lib/validation/onboarding";

/**
 * Validation for the AI-generated career roadmap (Step 4).
 *
 * `aiRoadmapResponseSchema` is what the AI provider's JSON must satisfy —
 * no `id`/`generatedAt`, since those are assigned server-side, not
 * hallucinated by the model. `careerRoadmapSchema` is the full persisted
 * shape (`aiRoadmapResponseSchema` plus those two fields) and is what
 * `types/roadmap.ts`'s `CareerRoadmap` is inferred from.
 */

const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(60),
  description: z.string().max(300).optional(),
  level: z.enum(["unknown", "familiar", "proficient", "expert"]),
});

const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(400),
  estimatedWeeks: z.number().positive().max(104),
});

const projectRecommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(400),
  skillIds: z.array(z.string()).default([]),
});

const certificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  provider: z.string().max(80).optional(),
  url: z.string().url().optional(),
});

const entryRoleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
});

const roadmapPhaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100),
  summary: z.string().min(1).max(400),
  order: z.number().int().nonnegative(),
  estimatedWeeks: z.number().positive().max(104),
  skills: z.array(skillSchema).default([]),
  milestones: z.array(milestoneSchema).default([]),
  projects: z.array(projectRecommendationSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  entryRoles: z.array(entryRoleSchema).default([]),
});

const roadmapNodeTypeSchema = z.enum([
  "phase",
  "skill",
  "milestone",
  "project",
  "certification",
  "entry_role",
]);

const roadmapNodePrioritySchema = z.enum(["core", "recommended", "optional"]);

export const roadmapNodeSchema = z.object({
  id: z.string().min(1),
  type: roadmapNodeTypeSchema,
  label: z.string().min(1).max(100),
  phaseId: z.string().min(1),
  description: z.string().max(300).optional(),
  durationWeeks: z.number().positive().max(104).optional(),
  priority: roadmapNodePrioritySchema,
  completed: z.boolean().default(false),
});

const roadmapEdgeSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
});

const careerRoadmapGoalSchema = z.object({
  title: z.string().min(1).max(120),
  targetContextCategory: targetContextCategorySchema.optional(),
  targetContextDetails: z.string().max(200).optional(),
  experienceLevel: experienceLevelSchema,
  existingSkills: z.array(z.string()).default([]),
  weeklyHours: z.union([z.number().int().min(1).max(80), z.literal("20+")]),
  targetTimeline: targetTimelineSchema,
});

export const aiRoadmapResponseSchema = z.object({
  summary: z.string().min(1).max(500),
  totalEstimatedWeeks: z.number().positive().max(208),
  phases: z.array(roadmapPhaseSchema).min(1).max(12),
  nodes: z.array(roadmapNodeSchema).min(1).max(200),
  edges: z.array(roadmapEdgeSchema).default([]),
});

export const careerRoadmapSchema = aiRoadmapResponseSchema.extend({
  id: z.string().min(1),
  goal: careerRoadmapGoalSchema,
  generatedAt: z.string(),
});

export type AIRoadmapResponse = z.infer<typeof aiRoadmapResponseSchema>;
export type CareerRoadmap = z.infer<typeof careerRoadmapSchema>;
