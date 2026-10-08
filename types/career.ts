/**
 * Core domain types for CareerForge.
 *
 * These shapes are designed so the future AI-generated roadmap JSON
 * (Step 4) can map onto them directly after Zod validation
 * (see lib/validation/career.ts).
 */

export type SkillLevel = "unknown" | "familiar" | "proficient" | "expert";

export interface Skill {
  id: string;
  name: string;
  description?: string;
  level: SkillLevel;
}

export interface Certification {
  id: string;
  name: string;
  provider?: string;
  url?: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  skillIds: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedWeeks: number;
}

export interface CareerPhase {
  id: string;
  title: string;
  summary: string;
  order: number;
  skills: Skill[];
  milestones: Milestone[];
  projects: ProjectRecommendation[];
  certifications: Certification[];
}

export interface CareerGoal {
  id: string;
  rawInput: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  knownSkillIds: string[];
  weeklyHoursAvailable?: number;
}

export type RoadmapNodeType = "phase" | "skill" | "milestone" | "project" | "certification";

export interface RoadmapNode {
  id: string;
  type: RoadmapNodeType;
  label: string;
  phaseId: string;
  position?: { x: number; y: number };
  completed: boolean;
}

export interface RoadmapEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface Roadmap {
  id: string;
  goal: CareerGoal;
  phases: CareerPhase[];
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  generatedAt: string;
}

export interface UserProgress {
  roadmapId: string;
  completedNodeIds: string[];
  updatedAt: string;
}
