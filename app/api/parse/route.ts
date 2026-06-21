import { NextResponse } from "next/server";
import { NLPInputSchema } from "../../../types";
import { parseNaturalLanguageInput } from "../../../lib/nlpService";

/**
 * POST /api/parse
 *
 * Secure API endpoint for the EcoSense Parser Service.
 * - Validates and sanitizes input using Zod (strips HTML tags).
 * - Delegates intent recognition to the NLP Service.
 * - Returns structured emission activities with personalized tips.
 *
 * Security: Rate limiting should be applied at the infrastructure level.
 * Input is validated, trimmed, and sanitized before processing.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();

    // Validate and sanitize input using Zod schema
    const result = NLPInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      );
    }

    const { text } = result.data;

    // Delegate to the context-aware NLP assistant service
    const activities = parseNaturalLanguageInput(text);

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Parser Error:", message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
