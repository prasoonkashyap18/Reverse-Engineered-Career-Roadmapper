import { randomUUID } from "node:crypto";
import { AIGenerationError } from "@/lib/ai/errors";
import { buildRoadmapSystemPrompt, buildRoadmapUserPrompt } from "@/lib/ai/prompt";
import { callAnthropic } from "@/lib/ai/providers/anthropic";
import { aiRoadmapResponseSchema } from "@/lib/validation/roadmap";
import type { CareerRoadmap } from "@/types/roadmap";
import type {
  GenerateNodeActionPlanInput,
  GenerateRoadmapInput,
  NodeActionPlan,
  ReplanRoadmapInput,
} from "./types";

/**
 * AI service boundary. Server-side only: never import this module from a
 * "use client" file, and keep the provider API key out of client bundles.
 */

export async function generateRoadmap({
  onboarding,
}: GenerateRoadmapInput): Promise<CareerRoadmap> {
  const systemPrompt = buildRoadmapSystemPrompt();
  const userPrompt = buildRoadmapUserPrompt(onboarding);

  const rawText = await callAnthropic(systemPrompt, userPrompt);

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(extractJson(rawText));
  } catch {
    throw new AIGenerationError(
      "invalid_response",
      "The AI provider did not return valid JSON.",
    );
  }

  const result = aiRoadmapResponseSchema.safeParse(parsedJson);
  if (!result.success) {
    console.error(
      "[lib/ai] Roadmap failed validation",
      result.error.issues,
    );
    throw new AIGenerationError(
      "validation_failed",
      "The AI-generated roadmap didn't match the expected structure.",
    );
  }

  const data = result.data;

  return {
    ...data,
    id: randomUUID(),
    goal: {
      title: onboarding.careerGoal.title,
      targetContextCategory: onboarding.careerGoal.targetContext?.category,
      targetContextDetails: onboarding.careerGoal.targetContext?.details,
      experienceLevel: onboarding.experienceLevel,
      existingSkills: onboarding.existingSkills,
      weeklyHours: onboarding.weeklyHours,
      targetTimeline: onboarding.targetTimeline,
    },
    generatedAt: new Date().toISOString(),
  };
}

/** Models occasionally wrap JSON in a ```json fence despite instructions not to. */
function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return fenceMatch ? fenceMatch[1] : trimmed;
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
): Promise<CareerRoadmap> {
  throw new Error("replanRoadmap is not implemented yet (see Step 7).");
}
