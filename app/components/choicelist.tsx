"use client";
import FlashcardButton from "./flashcardbutton";

interface ChoiceListProps {
  choices: string[];
  onSelect: (choice: string) => void;
}

export default function ChoiceList({ choices, onSelect }: ChoiceListProps) {
  return (
    <div className="flex flex-col space-y-3 w-full max-w-sm text-gray-800 mt-5">
      {choices.map((choice, index) => (
        <FlashcardButton
          key={index}
          text={choice}
          onClick={() => onSelect(choice)}
        />
      ))}
    </div>
  );
}
