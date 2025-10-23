'use client'
import { useState, useEffect } from "react";
import ChallengeForm from "../components/challengeform";
import SettingsForm from "../components/settingsform";
import FlashcardButton from "../components/flashcardbutton";
import { ChevronLeft, ChevronRight, Repeat, Settings, Zap } from "lucide-react";

export default function flashcards() {
  const [input, setInput] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  // const [history, setHistory] = useState([]);
  // const [historyIndex, setHistoryIndex] = useState(0);
  const [mistake, setMistake] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openChallenge, setOpenChallenge] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem("flashcards");
    if (stored) setFlashcards(JSON.parse(stored));
  }, []);

  const normalizeAnswer = (str: string) =>
    str
      .toLowerCase()               // lowercase everything
      .replace(/\s+/g, "")         // remove all spaces
      .replace(/[^a-z0-9]/g, ""); // remove all non-alphanumeric characters

  const submitAnswer = (answer: string) => {
    const userAnswer = normalizeAnswer(answer);
    const correctAnswer = normalizeAnswer(flashcards[cardIndex]?.answer || "");

    if (userAnswer === correctAnswer) {
      setCardIndex((cardIndex + 1) % flashcards.length);
      setMistake(false);
    } else {
      setMistake(true);
    }

    setInput("");
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFlashcards(shuffled);
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <SettingsForm open={openSettings} setOpen={setOpenSettings} />

      <ChallengeForm
        open={openChallenge}
        setOpen={setOpenChallenge}
        flashcards={flashcards}
      />

      <div className="w-full max-w-md text-center mb-7">
        <div className="w-full max-w-md text-center mb-7">
          <div className="w-full max-w-md flex justify-center items-center gap-8 mb-2">
            {/* Shuffle Button */}
            <button
              onClick={shuffleCards}
              className="flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded w-6 h-6 transition-colors duration-200"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setOpenSettings(true)}
              className="flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded w-6 h-6 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Challenge Button */}
            <button
              onClick={() => setOpenChallenge(true)}
              className="flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 rounded w-6 h-6 transition-colors duration-200"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(cardIndex + 1) / flashcards.length * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard Box */}
      <div className="relative bg-white border border-green-300 rounded-xl p-6 w-full max-w-md shadow-sm transition">
        <div className="absolute top-0 left-0 translate-y-[-50%] translate-x-[20px] bg-green-400 text-white text-xs px-3 py-1 rounded-full">
          New
        </div>

        <p className="text-gray-800 text-lg">
          {flashcards[cardIndex]?.question}
        </p>

        <div
          className="absolute bottom-2 right-3 text-xs text-gray-400 mt-7 italic cursor-pointer"
          onClick={() => setShowChoices(!showChoices)}
        >
          {showChoices ? "Identification ↺" : "Multiple choice ↺"}
        </div>
      </div>
      
      {showChoices && (
        <div className="flex flex-col space-y-3 w-full max-w-sm text-gray-800 mt-5">  
          <FlashcardButton
            text={flashcards[cardIndex]?.choices[0]}
            onClick={() => submitAnswer(flashcards[cardIndex]?.choices[0])}
          />
          <FlashcardButton
            text={flashcards[cardIndex]?.choices[1]}
            onClick={() => submitAnswer(flashcards[cardIndex]?.choices[1])}
          />
          <FlashcardButton
            text={flashcards[cardIndex]?.choices[2]}
            onClick={() => submitAnswer(flashcards[cardIndex]?.choices[2])}
          />
          <FlashcardButton
            text={flashcards[cardIndex]?.choices[3]}
            onClick={() => submitAnswer(flashcards[cardIndex]?.choices[3])}
          />

          <div className="flex justify-between mt-4 items-center">
            <button className="text-gray-500 text-left flex items-center text-sm gap-1 mr-2">
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button className="text-gray-500 text-right flex items-center text-sm gap-1 ml-2">
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      {!showChoices && (
        <div className="w-full max-w-md mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type answer"
            className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-800 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          
          <div className="flex justify-between mt-4 items-center">      
            <button className="text-gray-500 text-left flex items-center text-sm gap-1 mr-2">
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {input === "" ? (
              <button  className="text-gray-700 text-center text-sm flex items-center gap-1 bg-gray-200 hover:bg-gray-300 rounded-lg px-12 py-2">
              Reveal
            </button>
            ) : (
              <button onClick={() => submitAnswer(input)} className="text-white text-sm flex items-center gap-1 bg-indigo-950 hover:bg-indigo-800 rounded-lg px-12 py-2">
                Submit
              </button>
            )}
        
            <button className="text-gray-500 text-right flex items-center text-sm gap-1 ml-2">
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      

    </div>
  );
}
