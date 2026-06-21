"use client";

import React, { useState, useCallback, useRef } from "react";
import { Send, Loader2 } from "lucide-react";

/** Props for the ActivityInput component. */
interface ActivityInputProps {
  /** Callback invoked with the user's natural language text when the form is submitted. */
  onSubmit: (text: string) => Promise<void>;
}

/**
 * ActivityInput — A controlled text area for logging daily activities.
 * Includes client-side validation, loading states, error handling,
 * and accessible screen-reader announcements.
 */
const ActivityInput = React.memo(function ActivityInput({ onSubmit }: ActivityInputProps): React.JSX.Element {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (text.trim().length < 3) {
      setError("Please describe your activities with more detail.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await onSubmit(text);
      setText("");
      // Return focus to textarea after successful submission
      textareaRef.current?.focus();
    } catch {
      setError("Failed to parse activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [text, onSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
    if (error) setError(null);
  }, [error]);

  return (
    <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-1">Log Your Day</h2>
      <p id="input-hint" className="text-sm text-white/50 mb-4">
        Describe your activities in plain English and our assistant will analyze your carbon footprint.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="e.g. 'I drove 15 miles in my gas car, ate a beef burger for lunch, and left the AC on for 8 hours.'"
          className="w-full p-4 rounded-xl bg-black/20 text-white placeholder:text-gray-400 border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none resize-none min-h-[120px] transition-all"
          aria-label="Describe your daily activities"
          aria-describedby="input-hint"
          aria-invalid={error ? "true" : undefined}
          maxLength={1000}
        />
        {error && (
          <p className="text-red-400 text-sm font-medium" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="self-end px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLoading ? "Analyzing your activities..." : "Analyze Activities"}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
          <span>{isLoading ? "Analyzing…" : "Analyze"}</span>
        </button>
      </form>
    </section>
  );
});

export default ActivityInput;
