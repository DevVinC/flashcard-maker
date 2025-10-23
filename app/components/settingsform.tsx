"use client";
import React from "react";
import Toggle from "./toggle";

interface SettingsFormProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function SettingsForm({ open, setOpen }: SettingsFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Window */}
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg w-96 p-6 relative overflow-y-auto max-h-[80vh]">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">⚙️ Quiz Settings</h2>

        {/* Section 1 */}
        <div>
          <div className="mb-2 text-gray-500 text-sm">Question Types</div>
          <div className="space-y-2">
            <Toggle label="Multiple Choice" />
            <Toggle label="Identification" defaultOn />
            <Toggle label="Complete the Diagram" />
          </div>
        </div>

        <hr className="my-4" />

        {/* Section 2 */}
        <div>
          <div className="mb-2 text-gray-500 text-sm">AI Questions</div>
          <div className="space-y-2">
            <Toggle label="Shuffle Cards" defaultOn />
            <Toggle label="Shuffle Choices" defaultOn />
            <Toggle label="Term & Definition" defaultOn />
            <Toggle label="True or False" defaultOn />
          </div>
        </div>
      </div>
    </div>
  );
}
