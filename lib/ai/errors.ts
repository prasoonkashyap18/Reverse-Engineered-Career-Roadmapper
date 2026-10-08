export type AIGenerationErrorCode =
  | "missing_api_key"
  | "provider_error"
  | "invalid_response"
  | "validation_failed";

/**
 * A controlled, safe-to-surface error from the AI generation pipeline.
 * `message` is written to be shown to the client as-is — never put
 * provider response bodies, stack traces, or secrets in it.
 */
export class AIGenerationError extends Error {
  code: AIGenerationErrorCode;

  constructor(code: AIGenerationErrorCode, message: string) {
    super(message);
    this.name = "AIGenerationError";
    this.code = code;
  }
}
