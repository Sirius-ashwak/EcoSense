"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ActivityCategory } from "../../types";

/** Props for the EmissionsChart component. */
interface EmissionsChartProps {
  /** A record mapping each ActivityCategory to its total CO2 in kg. */
  data: Record<ActivityCategory, number>;
}

/** Color mapping for each emission category in the donut chart. */
const COLORS: Readonly<Record<ActivityCategory, string>> = {
  Transit:  "#3b82f6",
  Diet:     "#22c55e",
  Energy:   "#eab308",
  Shopping: "#a855f7",
  Waste:    "#f97316",
} as const;

/**
 * EmissionsChart — Renders a responsive donut chart of emissions
 * broken down by category. Shows an empty state when no data exists.
 */
const EmissionsChart = React.memo(function EmissionsChart({ data }: EmissionsChartProps): React.JSX.Element {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(1)) }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/50 italic" role="status">
        No emissions data yet. Log an activity to get started!
      </div>
    );
  }

  return (
    <div className="h-64 w-full" role="img" aria-label="Donut chart showing carbon emissions breakdown by category">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            animationDuration={600}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as ActivityCategory] ?? "#6b7280"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string) => [`${Number(value).toFixed(1)} kg CO₂`, "Emissions"]}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EmissionsChart;
