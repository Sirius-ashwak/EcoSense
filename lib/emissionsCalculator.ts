import { ActivityCategory } from "../types";

/**
 * Evidence-based emission factors for common daily activities.
 * Sources: EPA GHG Equivalencies Calculator, DEFRA Conversion Factors.
 * All values are in kilograms of CO2 equivalent (kg CO2e).
 */
export const EMISSION_FACTORS = {
  gas_car_per_mile: 0.4,
  beef_meal: 3.0,
  chicken_meal: 1.5,
  vegetarian_meal: 0.5,
  ac_per_hour: 0.5,
  light_per_hour: 0.06,
  shopping_clothing: 5.0,
  shopping_electronics: 20.0,
  waste_trash_bag: 2.5,
} as const;

/**
 * Average CO2 absorbed by a single mature tree per year (in kg).
 * Used to express emissions in relatable, real-world equivalencies.
 */
const KG_CO2_PER_TREE_PER_YEAR = 21.77;

/**
 * Calculates the sum of all carbon emissions from a list of activities.
 *
 * @param activities - Array of objects containing a `carbonKg` field.
 * @returns Total emissions in kilograms of CO2.
 */
export function calculateTotalEmissions(activities: { carbonKg: number }[]): number {
  return activities.reduce((total, activity) => total + activity.carbonKg, 0);
}

/**
 * Groups emissions by category to produce a breakdown for charting.
 *
 * @param activities - Array of categorized emission activities.
 * @returns A record mapping each ActivityCategory to its total kg CO2.
 */
export function calculateBreakdown(
  activities: { category: ActivityCategory; carbonKg: number }[]
): Record<ActivityCategory, number> {
  const breakdown: Record<ActivityCategory, number> = {
    Transit: 0,
    Diet: 0,
    Energy: 0,
    Shopping: 0,
    Waste: 0,
  };

  for (const activity of activities) {
    if (activity.category in breakdown) {
      breakdown[activity.category] += activity.carbonKg;
    }
  }

  return breakdown;
}

/**
 * Converts a total CO2 value into a human-friendly tree equivalency string.
 * Helps users contextualize their footprint in real-world terms.
 *
 * @param totalKg - Total emissions in kilograms of CO2.
 * @returns A string like "0.3 trees needed to offset per year".
 */
export function getTreeEquivalency(totalKg: number): string {
  if (totalKg <= 0) return "No emissions to offset yet.";
  const trees = totalKg / KG_CO2_PER_TREE_PER_YEAR;
  return `≈ ${trees.toFixed(2)} tree-years needed to offset this footprint.`;
}

/**
 * Global daily average CO2 emissions per person (in kg).
 * Source: Global Carbon Project — ~4.7 tonnes/year ÷ 365 days.
 */
export const DAILY_AVERAGE_KG = 12.88;

/** Emission severity levels for contextual feedback. */
export type SeverityLevel = "low" | "moderate" | "high";

/**
 * Classifies total emissions into a severity level for visual feedback.
 * Thresholds are based on fraction of the global daily average.
 *
 * @param totalKg - Total emissions in kilograms of CO2.
 * @returns The severity classification: "low", "moderate", or "high".
 */
export function getSeverityLevel(totalKg: number): SeverityLevel {
  if (totalKg <= DAILY_AVERAGE_KG * 0.25) return "low";
  if (totalKg <= DAILY_AVERAGE_KG * 0.75) return "moderate";
  return "high";
}

