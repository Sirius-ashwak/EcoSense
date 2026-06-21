import { NextResponse } from "next/server";
import { NLPInputSchema, ParsedEmissionsResponse, ActivityCategory } from "../../../types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input using Zod
    const result = NLPInputSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { text } = result.data;
    const lowerText = text.toLowerCase();
    const activities: ParsedEmissionsResponse = [];

    // Robust Mock Parser simulating NLP
    if (lowerText.includes("drove") || lowerText.includes("mile")) {
      const match = lowerText.match(/(\d+)\s*mile/);
      const miles = match ? parseInt(match[1]) : 15;
      activities.push({
        type: `Drove ${miles} miles in gas car`,
        category: "Transit" as ActivityCategory,
        carbonKg: miles * 0.4,
        tip: "Consider carpooling or using public transit next time.",
      });
    }

    if (lowerText.includes("beef") || lowerText.includes("burger")) {
      activities.push({
        type: "Ate a beef burger",
        category: "Diet" as ActivityCategory,
        carbonKg: 3.0,
        tip: "Try a plant-based alternative or chicken to reduce diet emissions.",
      });
    }

    if (lowerText.includes("ac") || lowerText.includes("air condition")) {
      const match = lowerText.match(/(\d+)\s*hour/);
      const hours = match ? parseInt(match[1]) : 8;
      activities.push({
        type: `Left AC on for ${hours} hours`,
        category: "Energy" as ActivityCategory,
        carbonKg: hours * 0.5,
        tip: "Set your thermostat a few degrees higher or use fans to save energy.",
      });
    }

    // Fallback if no keywords matched
    if (activities.length === 0) {
      activities.push({
        type: "Unclassified Activity",
        category: "Energy" as ActivityCategory,
        carbonKg: 1.0,
        tip: "Try to provide more details about your transit, diet, or energy usage.",
      });
    }

    return NextResponse.json({ activities }, { status: 200 });

  } catch (error) {
    console.error("Parser Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
