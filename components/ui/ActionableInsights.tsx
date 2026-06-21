"use client";

import React from "react";
import { Leaf, Zap, Car, ShoppingBag, Trash2 } from "lucide-react";
import { Activity, ActivityCategory } from "../../types";

/**
 * Returns the appropriate icon component for a given emission category.
 * Used by ActionableInsights to visually distinguish activity types.
 */
function getCategoryIcon(category: ActivityCategory): React.JSX.Element {
  const iconProps = { className: "w-5 h-5", "aria-hidden": true as const };
  switch (category) {
    case "Transit":   return <Car {...iconProps} className="w-5 h-5 text-blue-400" />;
    case "Diet":      return <Leaf {...iconProps} className="w-5 h-5 text-green-400" />;
    case "Energy":    return <Zap {...iconProps} className="w-5 h-5 text-yellow-400" />;
    case "Shopping":  return <ShoppingBag {...iconProps} className="w-5 h-5 text-purple-400" />;
    case "Waste":     return <Trash2 {...iconProps} className="w-5 h-5 text-orange-400" />;
    default:          return <Leaf {...iconProps} className="w-5 h-5 text-gray-400" />;
  }
}

/** Props for the ActionableInsights component. */
interface ActionableInsightsProps {
  /** Array of parsed activities to display as insight cards. */
  activities: Activity[];
}

/**
 * ActionableInsights — Renders a list of detected activities with
 * category icons, emission values, and personalized sustainability tips.
 * Returns null when no activities have been logged yet.
 */
const ActionableInsights = React.memo(function ActionableInsights({ activities }: ActionableInsightsProps): React.JSX.Element | null {
  if (activities.length === 0) return null;

  return (
    <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20" aria-label="Actionable sustainability insights">
      <h2 className="text-xl font-semibold text-white mb-4">Actionable Insights</h2>
      <ul className="flex flex-col gap-3" role="list">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl" role="listitem">
            <div className="p-2 bg-white/5 rounded-lg shrink-0">
              {getCategoryIcon(activity.category)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 font-medium">{activity.type}</p>
              <p className="text-green-300 text-sm mt-1">{activity.tip}</p>
            </div>
            <div className="ml-auto font-semibold text-red-300 shrink-0" aria-label={`${activity.carbonKg.toFixed(1)} kilograms of CO2`}>
              +{activity.carbonKg.toFixed(1)} kg
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default ActionableInsights;
