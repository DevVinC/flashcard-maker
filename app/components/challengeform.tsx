"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";

interface ChallengeFormProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  flashcards: any[]; // you can replace `any[]` with your real type
}

export default function ChallengeForm({ open, setOpen, flashcards }: ChallengeFormProps) {
  if (!open) return null;

  const router = useRouter();

  const [timeLimit, setTimeLimit] = useState<number | null>(10);
  const [numQuestions, setNumQuestions] = useState(10);
  const [randomize, setRandomize] = useState(true);
  const [types, setTypes] = useState(["Multiple Choice", "Identification", "True or False", "Diagrams"]);
  const [customTimeLimit, setCustomTimeLimit] = useState(false);
  const [display, setDisplay] = useState(""); // string version for showing “minutes”

  const handleStart = () => {
    const challengeData = {
      timeLimit,
      numQuestions,
      randomize,
      types
    }

    const query = new URLSearchParams(challengeData as any).toString();
    router.push(`/challenge?${query}`);
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      {/* Subwindow */}
      <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg max-h-[80vh] p-6 overflow-y-auto text-left relative">
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          ⚡ Challenge Mode
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Finish all sets within the time given!
        </p>

        <div className="space-y-6 pb-4">
          {/* Time Limit */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">1. Time Limit</h3>
            <select 
              value={customTimeLimit ? "Custom" : timeLimit?.toString()} // control selected option
              className="w-full bg-gray-100 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => {
                if (e.target.value === "Custom") {
                  setCustomTimeLimit(true);
                  setTimeLimit(0);
                }
                else {
                  setCustomTimeLimit(false);
                  setTimeLimit(parseInt(e.target.value));
                }
              }}
            >
              <option value="1">1 Minute</option>
              <option value="5">5 Minutes</option>
              <option value="10">10 Minutes</option> 
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">60 Minutes</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Show custom input only if "Custom" selected */}
          {customTimeLimit && (
            <input
              type="text"
              value={display}
              placeholder="Enter custom time (minutes)"
              className="w-full bg-gray-100 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onFocus={() => {
                // remove "minutes" when focused
                if (display.includes("minutes")) setDisplay(timeLimit?.toString() ?? "");
              }}
              onBlur={() => {
                // add "minutes" when unfocused
                if (timeLimit) setDisplay(`${timeLimit} Minutes`);
              }}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                if (!isNaN(num)) {
                  setTimeLimit(num);
                  setDisplay(e.target.value);
                } else {
                  setTimeLimit(null);
                  setDisplay(e.target.value);
                }
              }}
            />
          )}

          {/* Question Settings */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">2. Question Settings</h3>
            <div className="space-y-2">
              <label className="block text-gray-600 text-sm">
                Number of Questions:
              </label>
              <input
                type="number"
                className="w-full bg-gray-100 text-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={`e.g 10 (max: ${flashcards.length})`}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > flashcards.length) {
                    e.target.value = flashcards.length.toString();
                    setNumQuestions(flashcards.length);
                  }
                  else {
                    setNumQuestions(value);
                  }
                }}
              />
              <label className="flex items-center gap-2 text-gray-600 text-sm">
                <input type="checkbox" className="accent-blue-500" /> Randomize order
              </label>
            </div>
          </div>

          {/* Challenge Type */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">3. Question Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Multiple Choice", "Identification", "True or False", "Diagrams"].map(
                (type) => (
                  <label
                    key={type}
                    className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors select-none"
                  >
                    {type}
                    <input
                      type="checkbox"
                      name="type"
                      onChange={(e) => {
                        setTypes((prev) =>
                          e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                        );
                      }}
                      className="accent-blue-500"
                      defaultChecked
                    />
                  </label>
                )
              )}
            </div>
          </div>

          {/* Start Section */}
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setOpen(false);
                handleStart();
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-2 rounded-lg transition-colors"
            >
              🚀 Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
