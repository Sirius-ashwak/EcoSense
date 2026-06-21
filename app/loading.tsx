/**
 * Next.js App Router loading state.
 * Displayed automatically during route transitions and Suspense boundaries.
 * Improves perceived performance and accessibility.
 */
export default function Loading(): React.JSX.Element {
  return (
    <div
      className="min-h-screen bg-slate-900 flex items-center justify-center"
      role="status"
      aria-label="Loading EcoSense"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white/60 text-sm font-medium animate-pulse">
          Loading EcoSense…
        </p>
      </div>
    </div>
  );
}
