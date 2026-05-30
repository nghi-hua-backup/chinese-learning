"use client";

import { useState, useMemo } from "react";
import { VocabCard, PracticeMode, ReviewRating } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { getRandomDistractors } from "@/lib/utils";
import SRSRating from "./SRSRating";
import MultipleChoice from "./MultipleChoice";
import WritingInput from "./WritingInput";

interface Props {
  cards: VocabCard[];
  allCards: VocabCard[];
  mode: PracticeMode;
}

export default function VocabSession({ cards, allCards, mode }: Props) {
  const { getDueCards, reviewCard, getOrCreate } = useProgressStore();

  const dueIds = useMemo(() => getDueCards(cards.map((c) => c.id)), [cards]);
  const dueCards = useMemo(() => {
    const idSet = new Set(dueIds);
    const result = cards.filter((c) => idSet.has(c.id));
    return result.sort(() => Math.random() - 0.5);
  }, [dueIds]);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  const card = dueCards[index];

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
      setSessionDone(true);
    } else {
      setIndex((i) => i + 1);
      setShowAnswer(false);
      setAnswered(false);
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

  if (sessionDone) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-gray-800">Hoàn thành phiên học!</h2>
        <p className="text-gray-600">Đã ôn {dueCards.length} từ.</p>
        <button
          onClick={() => { setIndex(0); setSessionDone(false); setShowAnswer(false); setAnswered(false); }}
          className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
        >
          Học lại từ đầu
        </button>
      </div>
    );
  }

  const choices = useMemo(() => {
    if (!card) return [];
    const distractors = getRandomDistractors(card, allCards, 3);
    return [card, ...distractors].sort(() => Math.random() - 0.5);
  }, [card?.id]);

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
        <MultipleChoice question={card} choices={choices} onResult={handleResult} />
      )}

      {mode === "luyen-viet" && !showAnswer && (
        <WritingInput
          expected={card.traditional}
          onResult={(correct) => {
            setAnswered(true);
            setShowAnswer(true);
          }}
        />
      )}

      {mode === "luyen-viet" && showAnswer && (
        <>
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-5xl font-bold mb-1">{card.traditional}</p>
            {card.simplified !== card.traditional && (
              <p className="text-gray-400 text-sm">Giản thể: {card.simplified}</p>
            )}
            <p className="text-indigo-600 text-lg mt-2">{card.pinyin}</p>
            <p className="text-gray-600 mt-1">{card.meaning}</p>
          </div>
          <SRSRating onRate={handleRate} />
        </>
      )}
    </div>
  );
}
