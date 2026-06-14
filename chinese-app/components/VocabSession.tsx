"use client";

import { useState, useMemo } from "react";
import { VocabCard, PracticeMode, ReviewRating, ScriptMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { getRandomDistractors, getDisplayChar } from "@/lib/utils";
import SRSRating from "./SRSRating";
import MultipleChoice from "./MultipleChoice";
import WritingInput from "./WritingInput";

interface Props {
  cards: VocabCard[];
  allCards: VocabCard[];
  mode: PracticeMode;
  scriptMode: ScriptMode;
  reviewOnly?: boolean;
  onSessionComplete: (count: number) => void;
}

export default function VocabSession({ cards, allCards, mode, scriptMode, reviewOnly = false, onSessionComplete }: Props) {
  const { getDueCards, getOverdueReviewedCards, reviewCard, getOrCreate } = useProgressStore();

  const dueIds = useMemo(() => {
    const ids = cards.map((c) => c.id);
    return reviewOnly ? getOverdueReviewedCards(ids) : getDueCards(ids);
  }, [cards, reviewOnly]);
  const dueCards = useMemo(() => {
    const idSet = new Set(dueIds);
    const result = cards.filter((c) => idSet.has(c.id));
    return result.sort(() => Math.random() - 0.5);
  }, [dueIds]);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [writingCorrect, setWritingCorrect] = useState<boolean | null>(null);

  const card = dueCards[index];

  const choices = useMemo(() => {
    if (!card) return [];
    const distractors = getRandomDistractors(card, allCards, 3);
    return [card, ...distractors].sort(() => Math.random() - 0.5);
  }, [card?.id]);

  function handleRate(rating: ReviewRating) {
    if (!card) return;
    reviewCard(card.id, rating);
    advance();
  }

  function handleResult(correct: boolean) {
    setAnswered(true);
    // Auto-rate for multiple choice: correct=Good(3), wrong=Again(1)
    if (mode === "trac-nghiem") {
      const rating: ReviewRating = correct ? 3 : 1;
      setTimeout(() => {
        reviewCard(card.id, rating);
        advance();
      }, 1400);
    }
  }

  function advance() {
    if (index + 1 >= dueCards.length) {
      onSessionComplete(dueCards.length);
    } else {
      setIndex((i) => i + 1);
      setShowAnswer(false);
      setAnswered(false);
      setWritingCorrect(null);
    }
  }

  if (dueCards.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Tuyệt vời!</h2>
        <p className="text-gray-600">Không còn thẻ nào cần ôn hôm nay.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${((index) / dueCards.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">{index + 1}/{dueCards.length}</span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
          {card.lessonTitle} · {card.wordType}
        </p>
        <p className="text-2xl font-bold text-gray-800 mb-2">{card.meaning}</p>
        {card.hanViet && <p className="text-gray-400 text-sm italic">(Hán Việt: {card.hanViet})</p>}
      </div>

      {/* Answer section */}
      {mode === "trac-nghiem" && !answered && (
        <MultipleChoice question={card} choices={choices} onResult={handleResult} scriptMode={scriptMode} />
      )}

      {mode === "trac-nghiem" && answered && (
        <div className="mt-6 flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {mode === "luyen-viet" && !showAnswer && (
        <WritingInput
          expected={getDisplayChar(card, scriptMode)}
          expectedAlt={card.simplified !== card.traditional ? (scriptMode === "traditional" ? card.simplified : card.traditional) : undefined}
          onResult={(correct) => {
            setWritingCorrect(correct);
            setAnswered(true);
            setShowAnswer(true);
          }}
        />
      )}

      {mode === "luyen-viet" && showAnswer && (
        <>
          {writingCorrect !== null && (
            <div className={`mt-4 rounded-xl p-3 text-center font-semibold text-lg ${writingCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
              {writingCorrect ? "✓ Chính xác!" : "✗ Sai rồi"}
            </div>
          )}
          <div className="mt-3 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-8xl font-bold mb-1">{getDisplayChar(card, scriptMode)}</p>
            <p className="text-indigo-600 text-lg mt-2">{card.pinyin}</p>
            <p className="text-gray-600 mt-1">{card.meaning}</p>
          </div>
          <SRSRating onRate={handleRate} />
        </>
      )}
    </div>
  );
}
