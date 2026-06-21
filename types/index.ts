import { z } from "zod";

export type ActivityCategory = "Transit" | "Diet" | "Energy";

export interface Activity {
  id: string;
  type: string;
  category: ActivityCategory;
  carbonKg: number;
  tip: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
}

export interface UserState {
  activities: Activity[];
  totalEmissions: number;
}

// Zod schema to validate the incoming natural language text
export const NLPInputSchema = z.object({
  text: z.string().min(3, "Input too short").max(1000, "Input is too long"),
});

// Response structure expected from the Parser Service
export type ParsedEmissionsResponse = Omit<Activity, "id">[];
