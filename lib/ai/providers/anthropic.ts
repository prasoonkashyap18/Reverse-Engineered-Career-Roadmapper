import { AIGenerationError } from "@/lib/ai/errors";

/**
 * Minimal Anthropic Messages API client. Deliberately a plain `fetch` call
 * rather than the full SDK — this is the only place provider-specific
 * request/response shape lives, so swapping providers later means touching
 * only this file. Server-only: never import this from a "use client" file
 * (it reads AI_API_KEY, which must never reach the client bundle).
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 8000;

export async function callAnthropic(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new AIGenerationError(
      "missing_api_key",
      "The AI provider is not configured on the server (AI_API_KEY is unset).",
    );
  }

  const model = process.env.AI_MODEL || DEFAULT_MODEL;

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch {
    throw new AIGenerationError(
      "provider_error",
      "Could not reach the AI provider. Please try again.",
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("[lib/ai/providers/anthropic] API error", response.status, body);
    throw new AIGenerationError(
      "provider_error",
      "The AI provider returned an error. Please try again.",
    );
  }

  const data: unknown = await response.json();
  const text = extractText(data);
  if (text === null) {
    console.error("[lib/ai/providers/anthropic] Unexpected response shape", data);
    throw new AIGenerationError(
      "invalid_response",
      "The AI provider returned an unexpected response.",
    );
  }

  return text;
}

function extractText(data: unknown): string | null {
  if (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    Array.isArray((data as { content: unknown }).content)
  ) {
    const block = (data as { content: Array<{ type?: string; text?: string }> }).content[0];
    if (block && typeof block.text === "string") {
      return block.text;
    }
  }
  return null;
}
