"use client";

interface StatsBarProps {
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
}

export default function StatsBar({
  total,
  correct,
  incorrect,
  skipped,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-4 gap-3 w-full max-w-md text-center mt-3">
      <div>
        <h1 className="text-xs text-gray-500 uppercase tracking-wider">
          Remaining
        </h1>
        <p className="text-sm font-semibold text-gray-800">
          {Math.max(total - (correct + incorrect + skipped), 0)}
        </p>
      </div>

      <div>
        <h1 className="text-xs text-gray-500 uppercase tracking-wider">
          Skipped
        </h1>
        <p className="text-sm font-semibold text-amber-600">{skipped}</p>
      </div>

      <div>
        <h1 className="text-xs text-gray-500 uppercase tracking-wider">
          Incorrect
        </h1>
        <p className="text-sm font-semibold text-red-500">{incorrect}</p>
      </div>

      <div>
        <h1 className="text-xs text-gray-500 uppercase tracking-wider">
          Correct
        </h1>
        <p className="text-sm font-semibold text-emerald-600">{correct}</p>
      </div>
    </div>
  );
}
