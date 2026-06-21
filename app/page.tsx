"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import ActivityInput from "../components/ui/ActivityInput";
import ActionableInsights from "../components/ui/ActionableInsights";
import { Activity, ParsedEmissionsResponse } from "../types";
import { calculateTotalEmissions, calculateBreakdown, getTreeEquivalency } from "../lib/emissionsCalculator";
import { Leaf, TreePine } from "lucide-react";

/** Lazy-load the heavy chart component to reduce initial bundle size. */
const EmissionsDashboard = dynamic(() => import("../components/ui/EmissionsDashboard"), {
  ssr: false,
  loading: () => (
    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center h-64">
      <p className="text-white/50 animate-pulse">Loading dashboard…</p>
    </div>
  ),
});

/**
 * Home — The main EcoSense application page.
 * Manages activity state, delegates parsing to the API, and renders
 * the input form, insights panel, and emissions dashboard.
 */
export default function Home(): React.JSX.Element {
  const [activities, setActivities] = useState<Activity[]>([]);

  /**
   * Sends the user's natural language input to the parser API
   * and appends the resulting activities to state.
   */
  const handleParseText = useCallback(async (text: string): Promise<void> => {
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Failed to parse activities.");
    }

    const data: { activities: ParsedEmissionsResponse } = await res.json();
    const newActivities: Activity[] = data.activities.map(
      (a: ParsedEmissionsResponse[0]) => ({
        ...a,
        id: crypto.randomUUID(),
      })
    );

    setActivities((prev) => [...newActivities, ...prev]);
  }, []);

  const totalEmissions = useMemo(() => calculateTotalEmissions(activities), [activities]);
  const breakdown = useMemo(() => calculateBreakdown(activities), [activities]);
  const treeEquivalency = useMemo(() => getTreeEquivalency(totalEmissions), [totalEmissions]);

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-green-950 text-white font-sans selection:bg-green-500/30 selection:text-green-200">
      {/* Skip to main content link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <header className="px-6 py-6 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10" role="banner">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Leaf className="w-6 h-6 text-black" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EcoSense</h1>
          <span className="ml-auto text-sm text-white/40 hidden sm:inline">Your AI-Powered Sustainability Assistant</span>
        </div>
      </header>

      <main
        id="main-content"
        className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        role="main"
      >
        <div className="lg:col-span-2 flex flex-col gap-8">
          <ActivityInput onSubmit={handleParseText} />

          {/* Environmental equivalency banner */}
          {totalEmissions > 0 && (
            <div
              className="flex items-center gap-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl p-4"
              role="status"
              aria-live="polite"
            >
              <TreePine className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
              <p className="text-emerald-200 text-sm font-medium">{treeEquivalency}</p>
            </div>
          )}

          <ActionableInsights activities={activities} />
        </div>

        <div className="lg:col-span-1 sticky top-32" aria-live="polite">
          <Suspense fallback={<div className="text-white/50 animate-pulse p-6">Loading…</div>}>
            <EmissionsDashboard total={totalEmissions} breakdown={breakdown} />
          </Suspense>
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-white/5 text-center text-white/30 text-xs">
        <p>EcoSense — Built with Next.js, TypeScript &amp; ❤️ for the planet.</p>
      </footer>
    </div>
  );
}
