import { NextResponse } from "next/server";
import { NLPInputSchema } from "../../../types";
import { parseNaturalLanguageInput } from "../../../lib/nlpService";

/**
 * API Route for the Parser Service.
 * Validates requests and delegates complex intent recognition to the NLP Service.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input using Zod
    const result = NLPInputSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { text } = result.data;
    
    // Delegate to the smart assistant NLP service
    const activities = parseNaturalLanguageInput(text);

    return NextResponse.json({ activities }, { status: 200 });

  } catch (error) {
    console.error("Parser Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
