import type { CareerGoal, Roadmap, RoadmapNode, UserProfile } from "@/types/career";

/**
 * Contracts for the AI service boundary.
 * Implementations land in Step 4 (AI roadmap generation engine).
 */

export interface GenerateRoadmapInput {
  goal: CareerGoal;
  profile?: UserProfile;
}

export interface GenerateNodeActionPlanInput {
  roadmap: Roadmap;
  node: RoadmapNode;
}

export interface ReplanRoadmapInput {
  roadmap: Roadmap;
  profile: UserProfile;
}

export interface NodeActionPlan {
  nodeId: string;
  steps: string[];
}
