"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ActivityCategory } from "../../types";

interface EmissionsChartProps {
  data: Record<ActivityCategory, number>;
}

const COLORS = {
  Transit: "#3b82f6", // blue
  Diet: "#ef4444",    // red
  Energy: "#eab308",  // yellow
};

const EmissionsChart = React.memo(function EmissionsChart({ data }: EmissionsChartProps): JSX.Element {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-white/50 italic">
        No emissions data yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
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
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as ActivityCategory]} />
            ))}
          </Pie>
          <Tooltip 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${Number(value || 0).toFixed(1)} kg`, "Emissions"]}
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default EmissionsChart;
