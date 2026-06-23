"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { VocabCard, PracticeMode, ScriptMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { getRandomDistractors, getDisplayChar } from "@/lib/utils";
import MultipleChoice from "./MultipleChoice";
import WritingInput from "./WritingInput";

interface Props {
  cards: VocabCard[];
  allCards: VocabCard[];
  mode: PracticeMode;
  scriptMode: ScriptMode;
  reviewOnly?: boolean;
  lesson?: number;
  onSessionComplete: (count: number) => void;
}

export default function VocabSession({ cards, allCards, mode, scriptMode, reviewOnly = false, lesson, onSessionComplete }: Props) {
  const { getDueCards, getOverdueReviewedCards, reviewCard, startSession, completeSessionCard, clearSession } = useProgressStore();

  // P8: all hooks before early return
  const [queue, setQueue] = useState<VocabCard[]>(() => {
    const ids = cards.map((c) => c.id);
    const dueIds = new Set(reviewOnly ? getOverdueReviewedCards(ids) : getDueCards(ids));
    const due = cards.filter((c) => dueIds.has(c.id));
    return due.sort(() => Math.random() - 0.5);
  });

  const [resolved, setResolved] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);

  const totalCards = useRef(queue.length);
  const card = queue[0] as VocabCard | undefined;

  const choices = useMemo(() => {
    if (!card) return [];
    const distractors = getRandomDistractors(card, allCards, 3);
    return [card, ...distractors].sort(() => Math.random() - 0.5);
  }, [card?.id]);

  useEffect(() => {
    if (lesson === undefined || totalCards.current === 0) return;
    startSession(lesson, queue.map((c) => c.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (queue.length === 0 && resolved === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Tuyệt vời!</h2>
        <p className="text-gray-600">Không còn thẻ nào cần ôn hôm nay.</p>
      </div>
    );
  }

  function markRight() {
    if (!card) return;
    reviewCard(card.id);
    if (lesson !== undefined) completeSessionCard(lesson, card.id);
    const newResolved = resolved + 1;
    const newQueue = queue.slice(1);
    setResolved(newResolved);
    setQueue(newQueue);
    setAnswered(false);
    if (newQueue.length === 0) {
      if (lesson !== undefined) clearSession(lesson);
      onSessionComplete(newResolved);
    }
  }

  function markWrong() {
    const newQueue = [...queue.slice(1), queue[0]];
    setQueue(newQueue);
    setAnswered(false);
    setAttempt((a) => a + 1);
  }

  function handleResult(correct: boolean) {
    setAnswered(true);
    if (mode === "trac-nghiem") {
      setTimeout(() => {
        if (correct) markRight(); else markWrong();
      }, 1400);
    } else {
      setLastCorrect(correct);
    }
  }

  const progress = totalCards.current > 0 ? (resolved / totalCards.current) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">{resolved + 1}/{totalCards.current}</span>
      </div>

      {/* Question card */}
      {card && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
            {card.lessonTitle} · {card.wordType}
          </p>
          <p className="text-2xl font-bold text-gray-800 mb-2">{card.meaning}</p>
          {card.hanViet && <p className="text-gray-400 text-sm italic">(Hán Việt: {card.hanViet})</p>}
        </div>
      )}

      {/* Trắc nghiệm */}
      {mode === "trac-nghiem" && !answered && card && (
        <MultipleChoice
          key={card.id}
          question={card}
          choices={choices}
          onResult={handleResult}
          scriptMode={scriptMode}
        />
      )}

      {mode === "trac-nghiem" && answered && (
        <div className="mt-6 flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Luyện viết — WritingInput shows its own result when submitted; key forces remount on card change or re-queue */}
      {mode === "luyen-viet" && card && (
        <WritingInput
          key={`${card.id}-${attempt}`}
          expected={getDisplayChar(card, scriptMode)}
          expectedAlt={card.simplified !== card.traditional ? (scriptMode === "traditional" ? card.simplified : card.traditional) : undefined}
          pinyin={card.pinyin}
          onResult={(correct) => handleResult(correct)}
        />
      )}

      {mode === "luyen-viet" && answered && (
        <button
          onClick={() => { if (lastCorrect) markRight(); else markWrong(); }}
          className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 text-lg font-semibold transition-all active:scale-95"
        >
          Tiếp →
        </button>
      )}
    </div>
  );
}
