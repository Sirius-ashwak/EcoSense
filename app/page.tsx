"use client";

import React, { useState, useMemo, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import ActivityInput from "../components/ui/ActivityInput";
import ActionableInsights from "../components/ui/ActionableInsights";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { Activity, ParsedEmissionsResponse } from "../types";
import {
  calculateTotalEmissions,
  calculateBreakdown,
  getTreeEquivalency,
  getSeverityLevel,
  DAILY_AVERAGE_KG,
} from "../lib/emissionsCalculator";
import { Leaf, TreePine, RotateCcw, AlertTriangle, CheckCircle, Info } from "lucide-react";

/** Lazy-load the heavy chart component to reduce initial bundle size. */
const EmissionsDashboard = dynamic(
  () => import("../components/ui/EmissionsDashboard"),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 flex items-center justify-center h-64"
        role="status"
        aria-label="Loading emissions dashboard"
      >
        <p className="text-white/50 animate-pulse">Loading dashboard…</p>
      </div>
    ),
  }
);

/** Severity badge colors and icons for visual feedback. */
const SEVERITY_CONFIG = {
  low: { color: "text-green-400", bg: "bg-green-900/30 border-green-500/20", icon: CheckCircle, label: "Low Impact" },
  moderate: { color: "text-yellow-400", bg: "bg-yellow-900/30 border-yellow-500/20", icon: Info, label: "Moderate Impact" },
  high: { color: "text-red-400", bg: "bg-red-900/30 border-red-500/20", icon: AlertTriangle, label: "High Impact" },
} as const;

/**
 * Home — The main EcoSense application page.
 *
 * Responsibilities:
 * - Manages the activity list via React state.
 * - Delegates NLP parsing to the `/api/parse` endpoint.
 * - Computes derived metrics (total, breakdown, tree equivalency, severity).
 * - Renders the input form, severity banner, insights, and dashboard.
 */
export default function Home(): React.JSX.Element {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Sends the user's natural language input to the parser API
   * and prepends the resulting activities to state.
   */
  const handleParseText = useCallback(
    async (text: string): Promise<void> => {
      setIsAnalyzing(true);
      try {
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
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  /** Clears all logged activities and resets the session. */
  const handleClearAll = useCallback((): void => {
    setActivities([]);
  }, []);

  // Derived computations — memoized for performance
  const totalEmissions = useMemo(
    () => calculateTotalEmissions(activities),
    [activities]
  );
  const breakdown = useMemo(
    () => calculateBreakdown(activities),
    [activities]
  );
  const treeEquivalency = useMemo(
    () => getTreeEquivalency(totalEmissions),
    [totalEmissions]
  );
  const severity = useMemo(
    () => getSeverityLevel(totalEmissions),
    [totalEmissions]
  );
  const dailyComparison = useMemo((): string => {
    if (totalEmissions <= 0) return "";
    const pct = ((totalEmissions / DAILY_AVERAGE_KG) * 100).toFixed(0);
    return `Your session is ${pct}% of the global daily average (${DAILY_AVERAGE_KG} kg CO₂/person).`;
  }, [totalEmissions]);

  const severityConfig = SEVERITY_CONFIG[severity];
  const SeverityIcon = severityConfig.icon;

  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-green-950 text-white font-sans selection:bg-green-500/30 selection:text-green-200 flex flex-col">
      {/* Skip to main content link for keyboard/screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-500 focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <header
        className="px-6 py-6 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-10"
        role="banner"
      >
        <nav className="max-w-6xl mx-auto flex items-center gap-3" aria-label="Primary navigation">
          <div className="bg-green-500 p-2 rounded-xl shadow-lg shadow-green-500/20">
            <Leaf className="w-6 h-6 text-black" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EcoSense</h1>
          <span className="ml-auto text-sm text-white/40 hidden sm:inline">
            Your AI-Powered Sustainability Assistant
          </span>
        </nav>
      </header>

      <main
        id="main-content"
        className="flex-1 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full"
        aria-busy={isAnalyzing}
      >
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ErrorBoundary>
            <ActivityInput onSubmit={handleParseText} />
          </ErrorBoundary>

          {/* Session controls */}
          {activities.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-sm">
                {activities.length} {activities.length === 1 ? "activity" : "activities"} logged
              </p>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                aria-label="Clear all logged activities"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Clear All
              </button>
            </div>
          )}

          {/* Severity + Daily comparison banner */}
          {totalEmissions > 0 && (
            <div
              className={`flex items-start gap-3 border rounded-xl p-4 ${severityConfig.bg}`}
              role="status"
              aria-live="polite"
            >
              <SeverityIcon className={`w-5 h-5 shrink-0 mt-0.5 ${severityConfig.color}`} aria-hidden="true" />
              <div>
                <p className={`font-semibold text-sm ${severityConfig.color}`}>
                  {severityConfig.label}
                </p>
                <p className="text-white/60 text-xs mt-1">{dailyComparison}</p>
              </div>
            </div>
          )}

          {/* Environmental equivalency */}
          {totalEmissions > 0 && (
            <div
              className="flex items-center gap-3 bg-emerald-900/30 border border-emerald-500/20 rounded-xl p-4"
              role="status"
              aria-live="polite"
            >
              <TreePine className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
              <p className="text-emerald-200 text-sm font-medium">
                {treeEquivalency}
              </p>
            </div>
          )}

          <ErrorBoundary>
            <ActionableInsights activities={activities} />
          </ErrorBoundary>
        </div>

        <div className="lg:col-span-1 sticky top-32">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="text-white/50 animate-pulse p-6" role="status">
                  Loading…
                </div>
              }
            >
              <EmissionsDashboard total={totalEmissions} breakdown={breakdown} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <footer
        className="px-6 py-4 border-t border-white/5 text-center text-white/30 text-xs"
        role="contentinfo"
      >
        <p>EcoSense — Built with Next.js, TypeScript &amp; ❤️ for the planet.</p>
      </footer>
    </div>
  );
}
