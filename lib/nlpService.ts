import { ActivityCategory, ParsedEmissionsResponse } from "../types";
import { EMISSION_FACTORS } from "./emissionsCalculator";

/**
 * EcoSense NLP Service — Smart Activity Parser
 *
 * Implements a context-aware sustainability assistant persona that:
 * 1. Detects multiple activities from a single natural-language sentence.
 * 2. Extracts quantitative values (miles, hours) when present.
 * 3. Assigns emissions using evidence-based factors from `emissionsCalculator`.
 * 4. Provides personalized, actionable sustainability recommendations.
 * 5. Falls back gracefully when input is ambiguous or unrecognized.
 *
 * @param text - Raw natural language input from the user.
 * @returns An array of parsed activities with calculated emissions and tips.
 */
export function parseNaturalLanguageInput(text: string): ParsedEmissionsResponse {
  const lowerText = text.toLowerCase();
  const activities: ParsedEmissionsResponse = [];

  // ── Transit Detection ──────────────────────────────────────────────
  if (/\b(drove|drive|car|uber|taxi|commut)\b/.test(lowerText)) {
    const match = lowerText.match(/(\d+)\s*mile/);
    const miles = match ? parseInt(match[1], 10) : 15;
    activities.push({
      type: `Drove ${miles} miles in a gas-powered vehicle`,
      category: "Transit" as ActivityCategory,
      carbonKg: parseFloat((miles * EMISSION_FACTORS.gas_car_per_mile).toFixed(2)),
      tip: "🚗 Consider carpooling, cycling, or public transit. Even one car-free day per week can cut your transit emissions by ~15%.",
    });
  }

  if (/\b(fl[ey]w|flight|plane|airport)\b/.test(lowerText)) {
    const match = lowerText.match(/(\d+)\s*(hour|hr)/);
    const hours = match ? parseInt(match[1], 10) : 2;
    activities.push({
      type: `Took a ${hours}-hour flight`,
      category: "Transit" as ActivityCategory,
      carbonKg: parseFloat((hours * 90).toFixed(2)),
      tip: "✈️ Flights are the highest per-hour emission source. Consider trains for short distances or carbon offset programs.",
    });
  }

  // ── Diet Detection ─────────────────────────────────────────────────
  if (/\b(beef|steak|burger|red\s*meat|lamb)\b/.test(lowerText)) {
    activities.push({
      type: "Consumed a high-carbon meal (Beef/Red Meat)",
      category: "Diet" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.beef_meal,
      tip: "🥩 Red meat has the highest carbon footprint of any food. Swapping just one beef meal per week for plant-based saves ~156 kg CO2/year.",
    });
  } else if (/\b(chicken|poultry|fish|seafood|salmon|tuna)\b/.test(lowerText)) {
    activities.push({
      type: "Consumed a medium-carbon meal (Chicken/Fish)",
      category: "Diet" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.chicken_meal,
      tip: "🍗 Good choice over beef! Chicken produces ~80% less CO2 than beef per serving.",
    });
  } else if (/\b(vegan|vegetarian|salad|plant|tofu|veggie)\b/.test(lowerText)) {
    activities.push({
      type: "Consumed a low-carbon meal (Plant-based)",
      category: "Diet" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.vegetarian_meal,
      tip: "🥗 Excellent! Plant-based meals produce up to 90% less emissions than meat-based alternatives.",
    });
  }

  // ── Energy Detection ───────────────────────────────────────────────
  if (/\b(ac|a\/c|air\s*condition|heater|heating|furnace)\b/.test(lowerText)) {
    const match = lowerText.match(/(\d+)\s*(hour|hr)/);
    const hours = match ? parseInt(match[1], 10) : 8;
    activities.push({
      type: `Ran climate control for ${hours} hours`,
      category: "Energy" as ActivityCategory,
      carbonKg: parseFloat((hours * EMISSION_FACTORS.ac_per_hour).toFixed(2)),
      tip: "🌡️ Adjusting your thermostat by 2°F can save up to 3% on your heating/cooling bill and emissions.",
    });
  }

  if (/\b(light|lamp|bulb|led)\b/.test(lowerText)) {
    const match = lowerText.match(/(\d+)\s*(hour|hr)/);
    const hours = match ? parseInt(match[1], 10) : 5;
    activities.push({
      type: `Left lights on for ${hours} hours`,
      category: "Energy" as ActivityCategory,
      carbonKg: parseFloat((hours * EMISSION_FACTORS.light_per_hour).toFixed(2)),
      tip: "💡 Switching to LED bulbs uses 75% less energy than incandescent lighting.",
    });
  }

  // ── Shopping Detection ─────────────────────────────────────────────
  if (/\b(bought|purchased|ordered|shop)\b/.test(lowerText) && /\b(cloth|shirt|pants|jacket|dress|shoes)\b/.test(lowerText)) {
    activities.push({
      type: "Purchased new clothing",
      category: "Shopping" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.shopping_clothing,
      tip: "👕 Fast fashion is a major polluter. Consider second-hand, thrift stores, or sustainable brands.",
    });
  }

  if (/\b(bought|purchased|ordered|shop)\b/.test(lowerText) && /\b(phone|laptop|computer|tablet|gadget|electronic)\b/.test(lowerText)) {
    activities.push({
      type: "Purchased new electronics",
      category: "Shopping" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.shopping_electronics,
      tip: "📱 Electronics manufacturing is carbon-intensive. Consider refurbished devices or extending device lifespan.",
    });
  }

  // ── Waste Detection ────────────────────────────────────────────────
  if (/\b(trash|garbage|threw\s*away|waste|landfill|dump)\b/.test(lowerText)) {
    activities.push({
      type: "Generated household waste",
      category: "Waste" as ActivityCategory,
      carbonKg: EMISSION_FACTORS.waste_trash_bag,
      tip: "🗑️ Composting organic waste can divert up to 30% of household trash from landfills.",
    });
  }

  // ── Smart Fallback ─────────────────────────────────────────────────
  if (activities.length === 0) {
    activities.push({
      type: "Unrecognized Activity",
      category: "Energy" as ActivityCategory,
      carbonKg: 1.0,
      tip: "🤖 I couldn't identify specific activities. Try describing what you did with keywords like 'drove', 'ate', 'AC', 'bought', or 'trash' for accurate analysis!",
    });
  }

  return activities;
}
