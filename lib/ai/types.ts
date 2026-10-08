import type { OnboardingData } from "@/lib/validation/onboarding";
import type { CareerRoadmap, RoadmapNode } from "@/types/roadmap";

/**
 * Contracts for the AI service boundary.
 * `generateRoadmap` is implemented as of Step 4. The other two remain
 * placeholders until Steps 6–7.
 */

export interface GenerateRoadmapInput {
  onboarding: OnboardingData;
}

export interface GenerateNodeActionPlanInput {
  roadmap: CareerRoadmap;
  node: RoadmapNode;
}

export interface ReplanRoadmapInput {
  roadmap: CareerRoadmap;
  onboarding: OnboardingData;
}

export interface NodeActionPlan {
  nodeId: string;
  steps: string[];
}
