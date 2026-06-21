"use client";

import React from "react";
import { Leaf, Zap, Car } from "lucide-react";
import { Activity } from "../../types";

const ActionableInsights = React.memo(function ActionableInsights({ activities }: { activities: Activity[] }): React.JSX.Element | null {
  if (activities.length === 0) return null;

  const getIcon = (category: string) => {
    switch (category) {
      case "Transit": return <Car className="w-5 h-5 text-blue-400" />;
      case "Diet": return <Leaf className="w-5 h-5 text-green-400" />;
      case "Energy": return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Leaf className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4">Actionable Insights</h2>
      <ul className="flex flex-col gap-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl">
            <div className="p-2 bg-white/5 rounded-lg">
              {getIcon(activity.category)}
            </div>
            <div>
              <p className="text-white/80 font-medium">{activity.type}</p>
              <p className="text-green-300 text-sm mt-1">{activity.tip}</p>
            </div>
            <div className="ml-auto font-semibold text-red-300">
              +{activity.carbonKg.toFixed(1)} kg
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default ActionableInsights;
