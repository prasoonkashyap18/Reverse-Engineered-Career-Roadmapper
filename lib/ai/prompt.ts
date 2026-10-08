import type { OnboardingData } from "@/lib/validation/onboarding";
import type { GenerateNodeActionPlanInput } from "@/lib/ai/types";

/**
 * Prompt construction for roadmap generation, kept separate from the
 * provider client and the orchestration in lib/ai/index.ts so the prompt
 * can be iterated on independently.
 */

export function buildRoadmapSystemPrompt(): string {
  return `You are CareerForge's roadmap engine. Given a user's career goal and current situation, produce a realistic, specific, personalized career roadmap as STRICT JSON only — no markdown, no commentary, no code fences.

The JSON must match this shape exactly:
{
  "summary": string,
  "totalEstimatedWeeks": number,
  "phases": [
    {
      "id": string,
      "title": string,
      "summary": string,
      "order": number,
      "estimatedWeeks": number,
      "skills": [{ "id": string, "name": string, "description"?: string, "level": "unknown"|"familiar"|"proficient"|"expert" }],
      "milestones": [{ "id": string, "title": string, "description": string, "estimatedWeeks": number }],
      "projects": [{ "id": string, "title": string, "description": string, "skillIds": string[] }],
      "certifications": [{ "id": string, "name": string, "provider"?: string, "url"?: string }],
      "entryRoles": [{ "id": string, "title": string, "description": string }]
    }
  ],
  "nodes": [
    { "id": string, "type": "phase"|"skill"|"milestone"|"project"|"certification"|"entry_role", "label": string, "phaseId": string, "description"?: string, "durationWeeks"?: number, "priority": "core"|"recommended"|"optional", "completed": false }
  ],
  "edges": [ { "id": string, "sourceId": string, "targetId": string } ]
}

Rules:
- Every id referenced in "nodes" or "edges" must correspond to a real skill/milestone/project/certification/entryRole id defined in "phases", or to a phase id itself.
- "edges" express prerequisite relationships: sourceId must come before targetId becomes relevant.
- Be SPECIFIC to the stated career goal and its context. Never output generic filler like "Learn Python" or "Build projects" on its own — tie every skill, project, and milestone to the actual target role.
- Account for the user's existing skills: do not plan to teach something they already listed as known, though you may still reference a known skill as a prerequisite for a later node.
- Pace the roadmap using the user's weekly time budget and target timeline — totalEstimatedWeeks should be realistic given those constraints, not an arbitrary round number.
- Include at least one entry role per phase where a real intermediate/entry-level job title plausibly applies on the way to the target.
- Produce 3 to 6 phases, not more, each with a handful of nodes — depth and specificity over sheer volume.
- Output ONLY the JSON object. No prose before or after it.`;
}

export function buildRoadmapUserPrompt(onboarding: OnboardingData): string {
  const { careerGoal, experienceLevel, existingSkills, weeklyHours, targetTimeline } = onboarding;
  const contextLine = careerGoal.targetContext
    ? [careerGoal.targetContext.category, careerGoal.targetContext.details]
        .filter(Boolean)
        .join(" — ")
    : "Not specified";

  return `Career goal: ${careerGoal.title}
Target context: ${contextLine}
Current experience level: ${experienceLevel}
Existing skills: ${existingSkills.length > 0 ? existingSkills.join(", ") : "None listed — starting from the basics"}
Weekly time available: ${typeof weeklyHours === "number" ? `${weeklyHours} hours/week` : "20+ hours/week"}
Target timeline: ${targetTimeline.replace(/_/g, " ")}

Generate the personalized career roadmap JSON now.`;
}

export function buildNodeActionSystemPrompt(): string {
  return `You are CareerForge's node advisor. The user is looking at ONE specific node from their personalized career roadmap and wants focused, actionable guidance for it — not a generic career essay.

Respond as STRICT JSON only — no markdown, no commentary, no code fences. The JSON must match this shape exactly:
{
  "explanation": string,            // 2-4 sentences: why this node matters for THEIR specific target career
  "learningObjectives": string[],   // up to 6 concrete things to learn/understand for this node
  "recommendedActions": string[],   // up to 6 concrete next actions, ordered
  "projectIdea": { "title": string, "description": string } | omit if not applicable,
  "interviewQuestions": string[],   // up to 5 realistic interview questions this node would prepare them for
  "estimatedEffort": string | omit, // e.g. "4-6 hours over a weekend", short and realistic given their weekly hours
  "resources": [{ "label": string, "note"?: string }] // up to 5, general pointers (e.g. "Official FastAPI docs"), no fabricated URLs
}

Rules:
- Stay tightly scoped to the one node given — do not re-explain the whole roadmap.
- Be specific to both the node AND the user's stated target career/context — a "weekend project idea" for a fintech AI engineer role should look different from a generic one.
- Account for the user's existing skills and experience level — do not suggest relearning something they already know.
- Only include "projectIdea" and "estimatedEffort" if genuinely useful for this node; omit them otherwise rather than padding.
- Do not invent specific URLs. "resources" should name real, well-known things generically (e.g. "FastAPI's official tutorial") rather than fabricate a link.
- Output ONLY the JSON object. No prose before or after it.`;
}

export function buildNodeActionUserPrompt({
  node,
  onboarding,
}: GenerateNodeActionPlanInput): string {
  const { careerGoal, experienceLevel, existingSkills, weeklyHours, targetTimeline } = onboarding;
  const contextLine = careerGoal.targetContext
    ? [careerGoal.targetContext.category, careerGoal.targetContext.details]
        .filter(Boolean)
        .join(" — ")
    : "Not specified";

  return `Target career: ${careerGoal.title}
Target context: ${contextLine}
Experience level: ${experienceLevel}
Existing skills: ${existingSkills.length > 0 ? existingSkills.join(", ") : "None listed — starting from the basics"}
Weekly time available: ${typeof weeklyHours === "number" ? `${weeklyHours} hours/week` : "20+ hours/week"}
Target timeline: ${targetTimeline.replace(/_/g, " ")}

Selected roadmap node:
- Title: ${node.label}
- Type: ${node.type}
- Phase: ${node.phaseTitle}
- Priority: ${node.priority}
${node.description ? `- Description: ${node.description}\n` : ""}${typeof node.durationWeeks === "number" ? `- Estimated duration: ${node.durationWeeks} weeks\n` : ""}
Generate the focused action-plan JSON for this node now.`;
}
