"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Flashcard {
  question: string;
  choices: string[];
  answer: string;
}

function parseFlashcards(input: string): Flashcard[] {
  // Split into question blocks by blank lines
  const blocks = input.trim().split(/\n\s*\n/);

  const flashcards: Flashcard[] = blocks.map(block => {
    // Split the block into individual lines
    const lines = block.trim().split("\n").map(line => line.trim());

    // The first line contains the question
    const [questionLine, ...choiceLines] = lines;

    // Extract the question text (remove trailing %)
    const questionMatch = questionLine.match(/^(.*?)\s*%$/);
    const question = questionMatch ? questionMatch[1].trim() : questionLine;

    // Extract choices and detect correct answer
    const choices: string[] = [];
    let answer = "";

    for (const line of choiceLines) {
      // Example: "a. LAN #" → choice = "LAN", correct = true
      const match = line.match(/^[a-z]\.\s*(.*?)\s*(#)?$/i);
      if (match) {
        const choiceText = match[1].trim();
        const isCorrect = !!match[2];
        choices.push(choiceText);
        if (isCorrect) answer = choiceText;
      }
    }

    return { question, choices, answer };
  });

  return flashcards;
}

const HomePage = () => {
  const [input, setInput] = useState("");
  const [encoded, setEncoded] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]); 

  const router = useRouter();

  const handleEncode = () => {
    const parsed = parseFlashcards(input);
    if (parsed.length === 0) return;

    setFlashcards(parsed);
    setEncoded(true);
  };
  
  const handleContinue = () => {
    // optionally pass data to the study page (through query param)
    localStorage.setItem('flashcards', JSON.stringify(flashcards))
    router.push(`/flashcards`);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Flashcard Encoder</h1>
        <p className="text-gray-500 mb-6">
          Enter questions generated from ChatGPT below.
        </p>

        <textarea
          placeholder="Type your flashcard..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12} // default height, adjustable
          className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-400 focus:outline-none mb-1 resize-none overflow-y-auto max-h-40"
        />

        {encoded && (
          <div>
            <div className="mt-1 p-4 w-full max-w-md text-gray-700 text-center">
              ✅ <strong>{flashcards.length}</strong> questions parsed successfully!
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {!encoded && (
          <button
              onClick={handleEncode}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition-all"
            >
              Encode
          </button>
        )}

        
      </div>
    </main>
  );
  
  
};

export default HomePage;
