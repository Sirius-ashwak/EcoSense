"use client";

import React from "react";
import EmissionsChart from "./EmissionsChart";
import { ActivityCategory } from "../../types";

/** Props for the EmissionsDashboard component. */
interface EmissionsDashboardProps {
  /** Total carbon emissions in kilograms of CO2. */
  total: number;
  /** Emissions broken down by category for charting. */
  breakdown: Record<ActivityCategory, number>;
}

/**
 * EmissionsDashboard — Displays the total emissions figure prominently
 * alongside a categorical donut chart breakdown.
 * Uses aria-live to announce updates to assistive technologies.
 */
const EmissionsDashboard = React.memo(function EmissionsDashboard({ total, breakdown }: EmissionsDashboardProps): React.JSX.Element {
  return (
    <section
      className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 flex flex-col items-center h-full"
      aria-label="Emissions overview dashboard"
    >
      <h2 className="text-xl font-semibold text-white w-full mb-4">Emissions Overview</h2>

      <div className="relative w-48 h-48 flex items-center justify-center bg-black/20 rounded-full border border-white/10 mb-6 shadow-inner">
        <div className="text-center" role="status" aria-live="polite">
          <p className="text-4xl font-bold text-white tracking-tight" aria-label={`Total emissions: ${total.toFixed(1)} kilograms of CO2`}>
            {total.toFixed(1)}
          </p>
          <p className="text-sm text-gray-400 font-medium">kg CO₂</p>
        </div>
      </div>

      <div className="w-full bg-black/20 rounded-xl p-4">
        <EmissionsChart data={breakdown} />
      </div>
    </section>
  );
});

export default EmissionsDashboard;
