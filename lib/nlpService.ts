import { ActivityCategory, ParsedEmissionsResponse } from "../types";

/**
 * Service to process natural language input and extract structured carbon emission activities.
 * Implements a smart, dynamic assistant persona for accurate contextual mapping.
 * 
 * @param {string} text - The natural language input from the user.
 * @returns {ParsedEmissionsResponse} The parsed array of activities with insights.
 */
export function parseNaturalLanguageInput(text: string): ParsedEmissionsResponse {
  const lowerText = text.toLowerCase();
  const activities: ParsedEmissionsResponse = [];

  // Contextual Transit Detection
  if (lowerText.includes("drove") || lowerText.includes("mile") || lowerText.includes("car")) {
    const match = lowerText.match(/(\d+)\s*mile/);
    const miles = match ? parseInt(match[1], 10) : 15;
    activities.push({
      type: `Drove ${miles} miles in a gas-powered vehicle`,
      category: "Transit" as ActivityCategory,
      carbonKg: miles * 0.4,
      tip: "Assistant Tip: Consider carpooling, walking, or using public transit next time to cut emissions.",
    });
  }

  // Contextual Diet Detection
  if (lowerText.includes("beef") || lowerText.includes("burger") || lowerText.includes("meat")) {
    activities.push({
      type: "Consumed a high-carbon meal (Beef/Red Meat)",
      category: "Diet" as ActivityCategory,
      carbonKg: 3.0,
      tip: "Assistant Tip: Try swapping one meat meal a week for a plant-based alternative to significantly lower your footprint.",
    });
  } else if (lowerText.includes("chicken") || lowerText.includes("fish")) {
     activities.push({
      type: "Consumed a medium-carbon meal (Chicken/Fish)",
      category: "Diet" as ActivityCategory,
      carbonKg: 1.5,
      tip: "Assistant Tip: Great choice over beef! Going fully vegetarian occasionally can reduce this even further.",
    });
  }

  // Contextual Energy Detection
  if (lowerText.includes("ac") || lowerText.includes("air condition") || lowerText.includes("heater")) {
    const match = lowerText.match(/(\d+)\s*hour/);
    const hours = match ? parseInt(match[1], 10) : 8;
    activities.push({
      type: `Ran climate control for ${hours} hours`,
      category: "Energy" as ActivityCategory,
      carbonKg: hours * 0.5,
      tip: "Assistant Tip: Adjusting your thermostat by just 2 degrees can save massive amounts of energy over a year.",
    });
  }

  // Dynamic Context Fallback Strategy
  if (activities.length === 0) {
    activities.push({
      type: "Unclassified Daily Activity",
      category: "Energy" as ActivityCategory,
      carbonKg: 1.0,
      tip: "Assistant Tip: I couldn't precisely detect specific transit, diet, or energy keywords. Providing exact details (e.g., 'drove 5 miles') helps me analyze your footprint accurately!",
    });
  }

  return activities;
}
