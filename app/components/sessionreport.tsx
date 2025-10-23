"use client";
import React from "react";

interface SessionReportProps {
  correct: number;
  mistakes: number;
  skipped: number;
  // optional callbacks
  onRestart?: () => void;
  sessionName?: string; // optional label when saving
}

export default function SessionReport({
  correct,
  mistakes,
  skipped,
  onRestart,
  sessionName = "flashcard-session",
}: SessionReportProps) {
  const total = correct + mistakes + skipped;
  const attempted = correct + mistakes;

  const accuracy =
    attempted > 0 ? Math.round((correct / attempted) * 100 * 100) / 100 : 0; // two decimals
  const completionRate =
    total > 0 ? Math.round((attempted / total) * 100 * 100) / 100 : 0;

  const performanceLabel = () => {
    if (accuracy >= 90) return { label: "Excellent", emoji: "🌟", color: "text-emerald-600" };
    if (accuracy >= 70) return { label: "Good", emoji: "👍", color: "text-sky-600" };
    if (accuracy >= 50) return { label: "Fair", emoji: "🧩", color: "text-amber-600" };
    return { label: "Needs Work", emoji: "⚠️", color: "text-red-600" };
  };

  const label = performanceLabel();

  // Save session summary to localStorage (append to an array)
  const handleSave = () => {
    try {
      const sessionsRaw = localStorage.getItem("flashcard_sessions") || "[]";
      const sessions = JSON.parse(sessionsRaw);
      const entry = {
        id: Date.now(),
        name: sessionName,
        date: new Date().toISOString(),
        total,
        attempted,
        correct,
        mistakes,
        skipped,
        accuracy,
        completionRate,
      };
      sessions.push(entry);
      localStorage.setItem("flashcard_sessions", JSON.stringify(sessions));
      alert("Session saved to localStorage.");
    } catch (e) {
      console.error(e);
      alert("Failed to save session.");
    }
  };

  const progressPercentage = (value: number) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Session Report</h2>
          <p className="text-sm text-gray-500">Summary of your recent study session</p>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${label.color} flex items-center gap-2`}>
            <span>{label.emoji}</span>
            <span>{label.label}</span>
          </div>
          <div className="text-xs text-gray-400">{new Date().toLocaleString()}</div>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-500">Correct</div>
          <div className="text-2xl font-bold text-emerald-600">{correct}</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-500">Mistakes</div>
          <div className="text-2xl font-bold text-red-500">{mistakes}</div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <div className="text-sm text-gray-500">Skipped</div>
          <div className="text-2xl font-bold text-gray-700">{skipped}</div>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-gray-600">Accuracy</span>
          <span className="text-sm font-semibold">{accuracy}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-emerald-500 transition-width duration-500"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-gray-600">Completion Rate</span>
          <span className="text-sm font-semibold">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-sky-500 transition-width duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      <section className="mb-6 text-sm text-gray-700">
        <p>
          You reviewed <strong>{total}</strong> card{total !== 1 ? "s" : ""}.{" "}
          <strong>{attempted}</strong> attempted, <strong>{skipped}</strong> skipped.
        </p>

        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">Quick tips</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              Focus first on the <strong>{mistakes}</strong> cards you answered incorrectly.
            </li>
            <li>
              Revisit the <strong>{skipped}</strong> skipped cards — they often become easy wins.
            </li>
            <li>
              Try a short review session targeting only cards you missed to improve accuracy.
            </li>
          </ul>
        </div>
      </section>

      <footer className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save Session
          </button>

          <button
            onClick={() => {
              if (onRestart) onRestart();
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Restart
          </button>
        </div>

        <div className="text-right text-xs text-gray-500">
          <div>Total: {total}</div>
        </div>
      </footer>
    </div>
  );
}
