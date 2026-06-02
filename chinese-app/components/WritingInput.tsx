"use client";

import { useState, useRef } from "react";

interface Props {
  expected: string;
  expectedAlt?: string;
  onResult: (correct: boolean, input: string) => void;
}

function normalize(text: string): string {
  // Strip punctuation before comparing — stored phrases include ！？。 which users won't handwrite
  return text.trim().replace(/[\s\p{P}\p{S}]/gu, "").toLowerCase();
}

export default function WritingInput({ expected, expectedAlt, onResult }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    if (submitted || !input.trim()) return;
    const n = normalize(input);
    const isCorrect = n === normalize(expected) || (!!expectedAlt && n === normalize(expectedAlt));
    setCorrect(isCorrect);
    setSubmitted(true);
    onResult(isCorrect, input.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitted}
        rows={3}
        lang="zh-Hans"
        inputMode="text"
        className={`w-full text-7xl font-bold text-center border-2 rounded-2xl p-4 outline-none transition-all resize-none
          ${submitted
            ? correct
              ? "border-green-500 bg-green-50 text-green-800"
              : "border-red-400 bg-red-50 text-red-700"
            : "border-gray-300 focus:border-indigo-500 bg-white"
          }`}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 text-lg font-semibold transition-all active:scale-95 disabled:opacity-40"
        >
          Kiểm tra
        </button>
      )}

      {submitted && (
        <div className={`rounded-xl p-4 text-center ${correct ? "bg-green-100" : "bg-red-50"}`}>
          {correct ? (
            <p className="text-green-700 font-semibold text-lg">✓ Chính xác!</p>
          ) : (
            <div>
              <p className="text-red-600 font-semibold mb-2">✗ Sai rồi</p>
              <p className="text-gray-600 text-sm">Đáp án đúng:</p>
              <p className="text-4xl mt-1 text-gray-900 font-bold">{expected}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
