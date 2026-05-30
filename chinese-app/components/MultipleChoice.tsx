"use client";

import { useState } from "react";
import { VocabCard } from "@/lib/types";

interface Props {
  question: VocabCard;
  choices: VocabCard[];
  onResult: (correct: boolean) => void;
}

export default function MultipleChoice({ question, choices, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => onResult(id === question.id), 1200);
  }

  function getStyle(choice: VocabCard) {
    if (!selected) return "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-98";
    if (choice.id === question.id) return "bg-green-100 border-green-500 text-green-800";
    if (choice.id === selected) return "bg-red-100 border-red-400 text-red-700";
    return "bg-white border-gray-200 opacity-50";
  }

  return (
    <div className="grid grid-cols-1 gap-3 mt-6">
      {choices.map((choice) => (
        <button
          key={choice.id}
          onClick={() => handleSelect(choice.id)}
          className={`border-2 rounded-xl p-4 text-left transition-all ${getStyle(choice)}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-800">
              {choice.simplified === choice.traditional ? choice.simplified : `${choice.simplified}/${choice.traditional}`}
            </span>
            <div className="text-sm text-gray-500">
              <div>{choice.pinyin}</div>
              {selected && <div className="text-gray-700">{choice.meaning}</div>}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
