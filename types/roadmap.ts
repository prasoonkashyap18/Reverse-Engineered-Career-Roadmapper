import type { Certification, Milestone, ProjectRecommendation, Skill } from "@/types/career";
import type {
  ExperienceLevel,
  TargetContextCategory,
  TargetTimeline,
  WeeklyHours,
} from "@/types/onboarding";

/**
 * AI-generated career roadmap domain model (Step 4).
 *
 * Reuses the leaf content types from types/career.ts (Skill, Milestone,
 * ProjectRecommendation, Certification) as-is. Defines its own phase/node/
 * edge/root types rather than reusing career.ts's placeholder Roadmap/
 * RoadmapNode — those were deliberately minimal stand-ins (see their
 * docstring); this is the real shape, with the extra fields (priority,
 * duration, entry roles, dependencies) the AI-generation pipeline and the
 * future interactive graph (Steps 5–7) actually need.
 */

export type RoadmapNodeType =
  | "phase"
  | "skill"
  | "milestone"
  | "project"
  | "certification"
  | "entry_role";

export type RoadmapNodePriority = "core" | "recommended" | "optional";

export interface EntryRole {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  summary: string;
  order: number;
  estimatedWeeks: number;
  skills: Skill[];
  milestones: Milestone[];
  projects: ProjectRecommendation[];
  certifications: Certification[];
  entryRoles: EntryRole[];
}

/** A node in the dependency graph a future interactive view (Step 5) will render. */
export interface RoadmapNode {
  id: string;
  type: RoadmapNodeType;
  label: string;
  phaseId: string;
  description?: string;
  durationWeeks?: number;
  priority: RoadmapNodePriority;
  completed: boolean;
}

/** A dependency: `targetId` becomes relevant only after `sourceId`. */
export interface RoadmapEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface CareerRoadmapGoal {
  title: string;
  targetContextCategory?: TargetContextCategory;
  targetContextDetails?: string;
  experienceLevel: ExperienceLevel;
  existingSkills: string[];
  weeklyHours: WeeklyHours;
  targetTimeline: TargetTimeline;
}

export interface CareerRoadmap {
  id: string;
  goal: CareerRoadmapGoal;
  summary: string;
  totalEstimatedWeeks: number;
  phases: RoadmapPhase[];
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  generatedAt: string;
}
