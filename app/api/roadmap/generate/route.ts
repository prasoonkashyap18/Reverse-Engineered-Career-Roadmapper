import { NextResponse } from "next/server";
import { generateRoadmap } from "@/lib/ai";
import { AIGenerationError } from "@/lib/ai/errors";
import { onboardingDataSchema } from "@/lib/validation/onboarding";

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

  const parsed = onboardingDataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Onboarding data is invalid or incomplete.",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  try {
    const roadmap = await generateRoadmap({ onboarding: parsed.data });
    return NextResponse.json({ roadmap });
  } catch (error) {
    if (error instanceof AIGenerationError) {
      return NextResponse.json(
        { error: error.message },
        { status: ERROR_STATUS[error.code] },
      );
    }

    console.error("[api/roadmap/generate] Unexpected error", error);
    return NextResponse.json(
      { error: "Something went wrong generating the roadmap. Please try again." },
      { status: 500 },
    );
  }
}
