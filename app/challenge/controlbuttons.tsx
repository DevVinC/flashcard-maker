"use client";

import { LogOut, Pause } from "lucide-react";

interface ControlButtonsProps {
  onQuit: () => void;
  onPause: () => void;
}

export default function ControlButtons({ onQuit, onPause }: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onQuit}
        className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        title="Quit"
      >
        <LogOut className="w-4 h-4" />
      </button>

      <button
        onClick={onPause}
        className="flex items-center justify-center w-9 h-9 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
        title="Pause"
      >
        <Pause className="w-4 h-4" />
      </button>
    </div>
  );
}
