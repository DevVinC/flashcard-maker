'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Countdown from "../components/countdown";
import FlashcardButton from "../components/flashcardbutton";
import { ChevronLeft, ChevronRight, LogOut, Pause } from "lucide-react";
import ChoiceList from "../components/choicelist";
import StatsBar from "./statsbar";
import ControlButtons from "./controlbuttons";
import Timer from "./timer";

interface CardStatus {
  correct: boolean;
  incorrect: boolean;
  skipped: boolean;
}

export default function Flashcards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read each query param
  const timeLimit = parseInt(searchParams.get("timeLimit") || "0");
  const numQuestions = parseInt(searchParams.get("numQuestions") || "0");
  const randomize = searchParams.get("randomize") === "true";
  // const types = JSON.parse(searchParams.get("types") || "[]");

  // States
  const [input, setInput] = useState("");
  const [mistake, setMistake] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [countdownEnded, setCountdownEnded] = useState(true); // skip countdown for now

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [cardStatus, setCardStatus] = useState<CardStatus[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [skipped, setSkipped] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const [time, setTime] = useState(timeLimit * 60);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load flashcards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("flashcards");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFlashcards(parsed);
      setCardStatus(
        Array(parsed.length).fill({
          correct: false,
          incorrect: false,
          skipped: false,
        })
      );
    }
  }, []);

  // After flashcards are loaded, apply randomization & question limit
  useEffect(() => {
    if (flashcards.length === 0) return;

    let processed = [...flashcards];

    // Randomize if enabled
    if (randomize) {
      processed = processed.sort(() => Math.random() - 0.5);
    }

    // Limit number of questions
    if (numQuestions > 0 && numQuestions < processed.length) {
      processed = processed.slice(0, numQuestions);
    }

    setFlashcards(processed);
  }, [flashcards.length > 0, randomize, numQuestions]);

  // --- TIMER SETUP ---
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          alert("⏰ Time’s up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [isRunning]);

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleQuit = () => {
    clearInterval(intervalRef.current!);
    setIsRunning(false);
    router.push("/flashcards");
  };

  // --- LOAD FLASHCARDS ---
  useEffect(() => {
    const stored = localStorage.getItem("flashcards");
    if (stored) {
      const parsed = JSON.parse(stored);
      setFlashcards(parsed);

      // Initialize card statuses
      const initialStatus = parsed.map(() => ({
        correct: false,
        incorrect: false,
        skipped: false,
      }));
      setCardStatus(initialStatus);
    }
  }, []);

  // --- TRACK PROGRESS ---
  useEffect(() => {
    if (flashcards.length === 0 || cardStatus.length === 0) return;

    const s = cardStatus.filter((c) => c.skipped).length;
    const c = cardStatus.filter((c) => c.correct).length;
    const i = cardStatus.filter((c) => c.incorrect).length;

    setSkipped(s);
    setCorrect(c);
    setIncorrect(i);

    if (c + i === flashcards.length) {
      clearInterval(intervalRef.current!);
      setCountdownEnded(true);
      console.log("✅ All cards answered!");
    }
  }, [cardStatus, flashcards.length]);

  // --- NEXT CARD GENERATOR ---
  const generateNextCard = () => {
    if (flashcards.length === 0) return;

    let nextIndex = (currentCardIndex + 1) % flashcards.length;
    let attempts = 0;

    // find the next card that is NOT yet correct/incorrect
    while (
      (cardStatus[nextIndex].correct || cardStatus[nextIndex].incorrect) &&
      attempts < flashcards.length
    ) {
      nextIndex = (nextIndex + 1) % flashcards.length;
      attempts++;
    }

    if (attempts >= flashcards.length) {
      console.log("All cards answered or skipped");
      return;
    }

    setCurrentCardIndex(nextIndex);
  };

  // --- NORMALIZE ANSWERS ---
  const normalizeAnswer = (str: string) =>
    str.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");

  // --- SUBMIT ANSWER ---
  const submitAnswer = (answer: string) => {
    if (!flashcards[currentCardIndex]) return;

    const userAnswer = normalizeAnswer(answer);
    const correctAnswer = normalizeAnswer(flashcards[currentCardIndex].answer || "");

    setCardStatus((prev) => {
      const updated = [...prev];
      updated[currentCardIndex] = {
        correct: userAnswer === correctAnswer,
        incorrect: userAnswer !== correctAnswer,
        skipped: false,
      };
      return updated;
    });

    setMistake(userAnswer !== correctAnswer);
    setInput("");
    generateNextCard();
  };

  // --- SKIP CARD ---
  const handleSkip = () => {
    if (!flashcards[currentCardIndex]) return;
    setCardStatus((prev) => {
      const updated = [...prev];
      updated[currentCardIndex] = { ...updated[currentCardIndex], skipped: true };
      return updated;
    });
    generateNextCard();
  };

  // --- MAIN RENDER ---
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-500">
        <p>No flashcards found. Please create some first.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 w-full max-w-md mb-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Challenge
        </h1>

        <ControlButtons onQuit={handleQuit} onPause={handlePause} />
        <Timer time={time} />

        <StatsBar
          total={flashcards.length}
          correct={correct}
          incorrect={incorrect}
          skipped={skipped}
        />
      </div>

      {/* Flashcard Display */}
      <div className="relative bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md shadow-sm transition">
        <p className="text-gray-800 text-lg leading-relaxed">
          {flashcards[currentCardIndex]?.question}
        </p>

        <div
          className="absolute bottom-2 right-3 text-xs text-gray-400 italic cursor-pointer select-none hover:text-gray-500"
          onClick={() => setShowChoices(!showChoices)}
        >
          {showChoices ? "Identification ↺" : "Multiple choice ↺"}
        </div>
      </div>

      {/* Multiple Choice */}
      {showChoices && (
        <div className="w-full max-w-md mt-5">
          <ChoiceList
            choices={flashcards[currentCardIndex].choices}
            onSelect={(choice) => submitAnswer(choice)}
          />
        </div>
      )}

      {/* Input Answer */}
      {!showChoices && (
        <div className="w-full max-w-md mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full rounded-xl p-3 text-sm text-gray-800 bg-white border focus:outline-none focus:ring-2 ${
              mistake
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-400"
            }`}
          />

          <div className="flex justify-center mt-4 items-center">
            {input === "" ? (
              <button
                onClick={handleSkip}
                className="text-gray-700 text-center text-sm flex items-center gap-1 bg-gray-200 hover:bg-gray-300 rounded-lg px-12 py-2 transition"
              >
                Skip
              </button>
            ) : (
              <button
                onClick={() => submitAnswer(input)}
                className="text-white text-sm flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg px-6 py-2 transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
