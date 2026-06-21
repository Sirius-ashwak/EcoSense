import { z } from "zod";

/**
 * Supported carbon emission activity categories.
 * Each category represents a distinct domain of daily carbon output.
 */
export type ActivityCategory = "Transit" | "Diet" | "Energy" | "Shopping" | "Waste";

/**
 * Represents a single parsed carbon-emitting activity.
 * Includes the computed CO2 output and a contextual recommendation.
 */
export interface Activity {
  /** Unique identifier for the activity entry. */
  id: string;
  /** Human-readable description of the detected activity. */
  type: string;
  /** The emission domain this activity falls under. */
  category: ActivityCategory;
  /** Estimated carbon dioxide output in kilograms. */
  carbonKg: number;
  /** Personalized sustainability recommendation from the assistant. */
  tip: string;
}

/**
 * Schema for actionable insight cards displayed alongside activities.
 */
export interface Insight {
  id: string;
  title: string;
  description: string;
}

/**
 * Top-level application state for the emissions tracker.
 */
export interface UserState {
  activities: Activity[];
  totalEmissions: number;
}

/**
 * Zod schema to validate and sanitize the incoming natural language input.
 * Enforces minimum length for meaningful parsing and maximum length for security.
 */
export const NLPInputSchema = z.object({
  text: z
    .string()
    .min(3, "Input too short — please describe at least one activity.")
    .max(1000, "Input is too long — please keep it under 1000 characters.")
    .transform((val) => val.replace(/<[^>]*>/g, "")), // Strip HTML tags for XSS prevention
});

/** Response structure expected from the Parser Service (activities without client-side IDs). */
export type ParsedEmissionsResponse = Omit<Activity, "id">[];
