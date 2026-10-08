import { z } from "zod";
import { onboardingDataSchema } from "@/lib/validation/onboarding";
import { roadmapNodeSchema } from "@/lib/validation/roadmap";

/**
 * Validation for Step 6's per-node AI action plan.
 *
 * `nodeActionRequestSchema` validates the incoming request — the selected
 * node (reusing roadmapNodeSchema from Step 4/5) plus its phase title for
 * context, and the user's validated onboarding profile (reusing
 * onboardingDataSchema from Step 3). `nodeActionPlanSchema` validates the
 * AI's structured response before it ever reaches the UI.
 */

export const nodeActionRequestSchema = z.object({
  node: roadmapNodeSchema.extend({
    phaseTitle: z.string().min(1).max(100),
  }),
  onboarding: onboardingDataSchema,
});

export const nodeActionPlanSchema = z.object({
  explanation: z.string().min(1).max(600),
  learningObjectives: z.array(z.string().min(1).max(150)).max(8).default([]),
  recommendedActions: z.array(z.string().min(1).max(200)).max(8).default([]),
  projectIdea: z
    .object({
      title: z.string().min(1).max(100),
      description: z.string().min(1).max(400),
    })
    .optional(),
  interviewQuestions: z.array(z.string().min(1).max(200)).max(6).default([]),
  estimatedEffort: z.string().min(1).max(80).optional(),
  resources: z
    .array(
      z.object({
        label: z.string().min(1).max(100),
        note: z.string().max(200).optional(),
      }),
    )
    .max(5)
    .default([]),
});

export type NodeActionRequest = z.infer<typeof nodeActionRequestSchema>;
export type NodeActionPlan = z.infer<typeof nodeActionPlanSchema>;
