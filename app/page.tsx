"use client";

import { useState, useMemo } from "react";
import ActivityInput from "../components/ui/ActivityInput";
import EmissionsDashboard from "../components/ui/EmissionsDashboard";
import ActionableInsights from "../components/ui/ActionableInsights";
import { Activity, ParsedEmissionsResponse } from "../types";
import { calculateTotalEmissions, calculateBreakdown } from "../lib/emissionsCalculator";
import { Leaf } from "lucide-react";

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);

  const handleParseText = async (text: string) => {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Failed to parse");
    }

    const data = await res.json();
    const newActivities: Activity[] = data.activities.map((a: ParsedEmissionsResponse[0]) => ({
      ...a,
      id: crypto.randomUUID(),
    }));

    setActivities((prev) => [...newActivities, ...prev]);
  };

  const totalEmissions = useMemo(() => calculateTotalEmissions(activities), [activities]);
  const breakdown = useMemo(() => calculateBreakdown(activities), [activities]);

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-green-950 text-white font-sans selection:bg-green-500/30 selection:text-green-200">
      <header className="px-6 py-6 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Leaf className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EcoSense</h1>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ActivityInput onSubmit={handleParseText} />
          <ActionableInsights activities={activities} />
        </div>
        
        <div className="lg:col-span-1 sticky top-32">
          <EmissionsDashboard total={totalEmissions} breakdown={breakdown} />
        </div>
      </main>
    </div>
  );
}
