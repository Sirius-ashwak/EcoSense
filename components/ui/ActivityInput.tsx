"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface ActivityInputProps {
  onSubmit: (text: string) => Promise<void>;
}

const ActivityInput = React.memo(function ActivityInput({ onSubmit }: ActivityInputProps): JSX.Element {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < 3) {
      setError("Please describe your activities with more detail.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    try {
      await onSubmit(text);
      setText("");
    } catch {
      setError("Failed to parse activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-white/20">
      <h2 className="text-xl font-semibold text-white mb-4">Log Your Day</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. 'I drove 15 miles in my gas car, ate a beef burger for lunch...'"
          className="w-full p-4 rounded-xl bg-black/20 text-white placeholder:text-gray-400 border border-white/10 focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none resize-none min-h-[120px] transition-all"
          aria-label="Describe your daily activities"
        />
        {error && <p className="text-red-400 text-sm font-medium" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !text}
          className="self-end px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Analyze Activities"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span>Analyze</span>
        </button>
      </form>
    </section>
  );
});

export default ActivityInput;
