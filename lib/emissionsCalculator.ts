import { ActivityCategory } from "../types";

export const EMISSION_FACTORS: Record<string, number> = {
  gas_car_per_mile: 0.4, // kg CO2 per mile
  beef_meal: 3.0, // kg CO2 per meal
  ac_per_hour: 0.5, // kg CO2 per hour
};

export function calculateTotalEmissions(activities: { carbonKg: number }[]): number {
  return activities.reduce((total, activity) => total + activity.carbonKg, 0);
}

export function calculateBreakdown(
  activities: { category: ActivityCategory; carbonKg: number }[]
): Record<ActivityCategory, number> {
  const breakdown: Record<ActivityCategory, number> = {
    Transit: 0,
    Diet: 0,
    Energy: 0,
  };

  activities.forEach((activity) => {
    if (breakdown[activity.category] !== undefined) {
      breakdown[activity.category] += activity.carbonKg;
    }
  });

  return breakdown;
}
