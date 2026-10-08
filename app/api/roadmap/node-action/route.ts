import { NextResponse } from "next/server";
import { generateNodeActionPlan } from "@/lib/ai";
import { AIGenerationError } from "@/lib/ai/errors";
import { nodeActionRequestSchema } from "@/lib/validation/node-action";

const ERROR_STATUS: Record<AIGenerationError["code"], number> = {
  missing_api_key: 503,
  provider_error: 502,
  invalid_response: 502,
  validation_failed: 502,
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = nodeActionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Node or onboarding data is invalid or incomplete.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  try {
    const plan = await generateNodeActionPlan(parsed.data);
    return NextResponse.json({ plan });
  } catch (error) {
    if (error instanceof AIGenerationError) {
      return NextResponse.json(
        { error: error.message },
        { status: ERROR_STATUS[error.code] },
      );
    }

    console.error("[api/roadmap/node-action] Unexpected error", error);
    return NextResponse.json(
      { error: "Something went wrong generating the action plan. Please try again." },
      { status: 500 },
    );
  }
}
