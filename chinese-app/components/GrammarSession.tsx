"use client";

import { useState, useMemo } from "react";
import { GrammarPattern, ScriptMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { getDisplayChar } from "@/lib/utils";

interface Props {
  patterns: GrammarPattern[];
  scriptMode: ScriptMode;
  onSessionComplete: (count: number) => void;
}

export default function GrammarSession({ patterns, scriptMode, onSessionComplete }: Props) {
  const { reviewCard, getDueCards } = useProgressStore();

  // ALL hooks before any early return (P8)
  const patternIds = useMemo(() => patterns.map((p) => p.id), [patterns]);

  const initialQueue = useMemo(() => {
    const dueIds = new Set(getDueCards(patternIds));
    return patterns.filter((p) => dueIds.has(p.id));
  }, [patterns, patternIds, getDueCards]);

  const [queue, setQueue] = useState<GrammarPattern[]>(initialQueue);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const current = queue[0] ?? null;

  const currentExample = useMemo(() => {
    if (!current) return null;
    return current.examples[Math.floor(Math.random() * current.examples.length)];
  }, [current]);

  const currentChoices = useMemo(() => {
    if (!current) return [];
    const others = patterns.filter((p) => p.id !== current.id).map((p) => p.name);
    const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...distractors, current.name].sort(() => Math.random() - 0.5);
  }, [current, patterns]);

  // Empty queue guard — after all hooks
  if (!current || !currentExample) return null;

  function handleSelect(name: string) {
    if (selected !== null || !current) return;
    const isCorrect = name === current.name;
    setSelected(name);
    reviewCard(current.id, isCorrect ? 3 : 1);
    const newCount = reviewedCount + 1;
    setReviewedCount(newCount);
    setTimeout(() => {
      const remaining = queue.slice(1);
      if (remaining.length === 0) {
        onSessionComplete(newCount);
      } else {
        setQueue(remaining);
        setSelected(null);
      }
    }, 1000);
  }

  const isCorrectAnswer = selected === current.name;

  return (
    <div className="space-y-5">
      <div className="text-sm text-gray-400 text-right">
        Còn lại: {queue.length} mẫu
      </div>

      {/* Example sentence card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ngữ pháp nào?</p>
        <p className="text-4xl font-bold text-gray-900 leading-snug">
          {getDisplayChar(currentExample, scriptMode)}
        </p>
        <p className="text-base text-indigo-500 font-medium">{currentExample.pinyin}</p>
        <p className="text-sm text-gray-500 italic">{currentExample.meaning}</p>
      </div>

      {/* Feedback after selection */}
      {selected && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            isCorrectAnswer
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <p className="font-semibold">{isCorrectAnswer ? "✓ Chính xác!" : "✗ Sai rồi!"}</p>
          <p className="font-bold mt-1">{current.name}</p>
          <p className="mt-0.5 opacity-80">{current.explanation}</p>
        </div>
      )}

      {/* Choices */}
      <div className="grid grid-cols-1 gap-3">
        {currentChoices.map((name) => {
          let style =
            "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-98 text-gray-800";
          if (selected) {
            if (name === current.name)
              style = "bg-green-100 border-green-500 text-green-800";
            else if (name === selected)
              style = "bg-red-100 border-red-400 text-red-700";
            else style = "bg-white border-gray-200 opacity-50 text-gray-600";
          }
          return (
            <button
              key={name}
              onClick={() => handleSelect(name)}
              disabled={selected !== null}
              className={`border-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${style}`}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
