"use client";

import { useState, useMemo } from "react";
import { PhraseCard, PracticeCard, ReviewRating, ScriptMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { getDisplayChar } from "@/lib/utils";
import SRSRating from "./SRSRating";
import WritingInput from "./WritingInput";

type Card = PhraseCard | PracticeCard;

interface Props {
  cards: Card[];
  title: string;
  scriptMode: ScriptMode;
}

function getCardId(c: Card): string {
  return c.id;
}

export default function PhraseSession({ cards, title, scriptMode }: Props) {
  const { getDueCards, reviewCard } = useProgressStore();

  const dueIds = useMemo(() => getDueCards(cards.map(getCardId)), [cards]);
  const dueCards = useMemo(() => {
    const idSet = new Set(dueIds);
    return cards.filter((c) => idSet.has(getCardId(c))).sort(() => Math.random() - 0.5);
  }, [dueIds]);

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  const card = dueCards[index];

  function handleRate(rating: ReviewRating) {
    if (!card) return;
    reviewCard(getCardId(card), rating);
    advance();
  }

  function advance() {
    if (index + 1 >= dueCards.length) {
      setSessionDone(true);
    } else {
      setIndex((i) => i + 1);
      setShowAnswer(false);
    }
  }

  if (dueCards.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold">Không còn thẻ cần ôn!</h2>
        <p className="text-gray-600">Hãy quay lại sau.</p>
      </div>
    );
  }

  if (sessionDone) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold">Xong phiên học!</h2>
        <p className="text-gray-600">Đã ôn {dueCards.length} câu.</p>
        <button
          onClick={() => { setIndex(0); setSessionDone(false); setShowAnswer(false); }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          Học lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${(index / dueCards.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">{index + 1}/{dueCards.length}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">{"category" in card ? card.category : `Bài ${card.lesson}`}</p>
        <p className="text-lg text-gray-800 font-medium mb-3">{card.meaning}</p>
        <p className="text-sm text-indigo-400 italic">{card.pinyin}</p>
      </div>

      {!showAnswer && (
        <WritingInput
          expected={getDisplayChar(card, scriptMode)}
          expectedAlt={card.simplified !== card.traditional ? (scriptMode === "traditional" ? card.simplified : card.traditional) : undefined}
          placeholder="Viết câu tiếng Trung..."
          onResult={() => setShowAnswer(true)}
        />
      )}

      {showAnswer && (
        <>
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-6xl font-bold text-center mb-2">{getDisplayChar(card, scriptMode)}</p>
            <p className="text-indigo-600 text-center mt-1">{card.pinyin}</p>
            <p className="text-gray-600 text-center mt-1">{card.meaning}</p>
          </div>
          <SRSRating onRate={handleRate} />
        </>
      )}
    </div>
  );
}
