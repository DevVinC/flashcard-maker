// components/FlashcardButton.tsx
import React from "react";

interface FlashcardButtonProps {
  text: string;
  onClick: () => void; // specify that onClick is a function with no arguments and no return value
}

const FlashcardButton: React.FC<FlashcardButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="w-full text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-sky-100 transition shadow"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default FlashcardButton;
