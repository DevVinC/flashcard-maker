import React from "react"

interface ToggleProps {
    label: string
    defaultOn?: boolean
}

export default function Toggle({ label, defaultOn = false }: ToggleProps) {
  const [on, setOn] = React.useState(defaultOn);

  return (
    <label
      className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 cursor-pointer transition-colors select-none"
      onClick={() => setOn(!on)}
    >
      <span>{label}</span>
      <div
        className={`w-10 h-5 rounded-full flex items-center transition-colors ${
          on ? "bg-blue-500" : "bg-gray-400"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
            on ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
    </label>
  );
}