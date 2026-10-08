import type { Roadmap } from "@/types/career";
import type {
  GenerateNodeActionPlanInput,
  GenerateRoadmapInput,
  NodeActionPlan,
  ReplanRoadmapInput,
} from "./types";

/**
 * AI service boundary.
 *
 * These functions are placeholders that define the shape of the future
 * AI integration (Step 4: AI roadmap generation engine). They do not call
 * any AI provider yet. Server-side only: never import this module from a
 * client component, and keep the provider API key out of client bundles.
 *
 * Real implementations must validate the AI response with the schemas in
 * lib/validation before returning it to callers.
 */

export async function generateRoadmap(
  _input: GenerateRoadmapInput,
): Promise<Roadmap> {
  throw new Error("generateRoadmap is not implemented yet (see Step 4).");
}

export async function generateNodeActionPlan(
  _input: GenerateNodeActionPlanInput,
): Promise<NodeActionPlan> {
  throw new Error(
    "generateNodeActionPlan is not implemented yet (see Step 6).",
  );
}

export async function replanRoadmap(
  _input: ReplanRoadmapInput,
): Promise<Roadmap> {
  throw new Error("replanRoadmap is not implemented yet (see Step 7).");
}
