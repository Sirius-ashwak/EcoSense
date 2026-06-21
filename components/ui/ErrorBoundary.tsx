"use client";

import React from "react";

/** Props for the ErrorBoundary component. */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/** State for the ErrorBoundary component. */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Catches unhandled React rendering errors and displays
 * a user-friendly fallback UI instead of crashing the entire application.
 * This is a best practice for production-grade React applications.
 */
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("EcoSense ErrorBoundary caught:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[200px] flex flex-col items-center justify-center bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center"
          role="alert"
        >
          <h2 className="text-xl font-semibold text-red-300 mb-2">
            Something went wrong
          </h2>
          <p className="text-white/60 text-sm mb-4">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-200 text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
