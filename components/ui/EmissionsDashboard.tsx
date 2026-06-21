"use client";

import React from "react";
import EmissionsChart from "./EmissionsChart";
import { ActivityCategory } from "../../types";

interface EmissionsDashboardProps {
  total: number;
  breakdown: Record<ActivityCategory, number>;
}

const EmissionsDashboard = React.memo(function EmissionsDashboard({ total, breakdown }: EmissionsDashboardProps): JSX.Element {
  return (
    <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 flex flex-col items-center h-full">
      <h2 className="text-xl font-semibold text-white w-full mb-4">Emissions Overview</h2>
      
      <div className="relative w-48 h-48 flex items-center justify-center bg-black/20 rounded-full border border-white/10 mb-6 shadow-inner">
        <div className="text-center">
          <p className="text-4xl font-bold text-white tracking-tight">{total.toFixed(1)}</p>
          <p className="text-sm text-gray-400 font-medium">kg CO2</p>
        </div>
      </div>
      
      <div className="w-full bg-black/20 rounded-xl p-4" aria-live="polite">
        <EmissionsChart data={breakdown} />
      </div>
    </section>
  );
});

export default EmissionsDashboard;
