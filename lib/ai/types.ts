import type { OnboardingData } from "@/lib/validation/onboarding";
import type { NodeActionPlan } from "@/lib/validation/node-action";
import type { CareerRoadmap, RoadmapNode } from "@/types/roadmap";

/**
 * Contracts for the AI service boundary.
 * `generateRoadmap` and `generateNodeActionPlan` are implemented (Steps 4
 * and 6). `replanRoadmap` remains a placeholder until Step 7.
 */

export interface GenerateRoadmapInput {
  onboarding: OnboardingData;
}

export interface GenerateNodeActionPlanInput {
  node: RoadmapNode & { phaseTitle: string };
  onboarding: OnboardingData;
}

export interface ReplanRoadmapInput {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
}

export type { NodeActionPlan };
