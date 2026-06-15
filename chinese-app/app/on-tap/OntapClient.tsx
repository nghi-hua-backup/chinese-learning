"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { VocabCard, PracticeMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import VocabSession from "@/components/VocabSession";
import Toast from "@/components/Toast";

interface Props {
  allCards: VocabCard[];
}

export default function OntapClient({ allCards }: Props) {
  const searchParams = useSearchParams();
  const initialLesson = Number(searchParams.get("lesson") ?? 0);

  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [mode, setMode] = useState<PracticeMode>("trac-nghiem");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [frozenSessionCards, setFrozenSessionCards] = useState<VocabCard[] | null>(null);

  const { scriptMode, cards, getOverdueReviewedCards } = useProgressStore();

  const lessons = useMemo(
    () => Array.from(new Set(allCards.map((c) => c.lesson))).sort((a, b) => a - b),
    [allCards]
  );

  const lessonCardIds = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const c of allCards) {
      if (!map[c.lesson]) map[c.lesson] = [];
      map[c.lesson].push(c.id);
    }
    return map;
  }, [allCards]);

  const allCardIds = useMemo(() => allCards.map((c) => c.id), [allCards]);

  const filteredCardIds = useMemo(
    () => (selectedLesson === 0 ? allCardIds : (lessonCardIds[selectedLesson] ?? [])),
    [selectedLesson, allCardIds, lessonCardIds]
  );

  const dueCards = useMemo(() => {
    const dueIds = new Set(getOverdueReviewedCards(filteredCardIds));
    return allCards.filter((c) => dueIds.has(c.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, filteredCardIds, allCards]);

  function handleSessionComplete(count: number) {
    setFrozenSessionCards(null);
    setSessionStarted(false);
    setToastMessage(`Hoàn thành phiên học! Đã ôn ${count} từ.`);
  }

  if (sessionStarted && frozenSessionCards) {
    return (
      <div>
        <button
          onClick={() => { setFrozenSessionCards(null); setSessionStarted(false); }}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Quay lại
        </button>
        <VocabSession
          cards={frozenSessionCards}
          allCards={allCards}
          mode={mode}
          scriptMode={scriptMode}
          reviewOnly={false}
          lesson={selectedLesson}
          onSessionComplete={handleSessionComplete}
        />
      </div>
    );
  }

  return (
    <>
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/tu-vung" className="text-gray-500 hover:text-gray-700 text-sm flex-shrink-0">
            ← Quay lại
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔁 Ôn tập</h1>
            <p className="text-gray-500 text-sm mt-0.5">Từ đã học cần ôn lại</p>
          </div>
        </div>

        {/* Lesson filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Chọn bài</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLesson(0)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedLesson === 0 ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tất cả
            </button>
            {lessons.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLesson(l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedLesson === l ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Bài {l}
              </button>
            ))}
          </div>
        </div>

        {/* Mode selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Hình thức ôn tập</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("trac-nghiem")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                mode === "trac-nghiem" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
              }`}
            >
              <p className="text-xl mb-1">🔤</p>
              <p className="font-semibold text-sm">Trắc nghiệm</p>
              <p className="text-xs text-gray-500 mt-0.5">Chọn đáp án đúng</p>
            </button>
            <button
              onClick={() => setMode("luyen-viet")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                mode === "luyen-viet" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
              }`}
            >
              <p className="text-xl mb-1">✍️</p>
              <p className="font-semibold text-sm">Luyện viết</p>
              <p className="text-xs text-gray-500 mt-0.5">Dùng Apple Pencil</p>
            </button>
          </div>
        </div>

        {/* Count or empty state */}
        {dueCards.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-gray-600 font-medium">Không có từ nào cần ôn!</p>
            <p className="text-gray-400 text-sm">Tất cả từ đã học đều ổn định.</p>
          </div>
        ) : (
          <>
            <div className="text-center py-8 space-y-2">
              <p className="text-5xl font-bold text-orange-500">{dueCards.length}</p>
              <p className="text-gray-500 text-sm">từ cần ôn hôm nay</p>
            </div>

            <button
              onClick={() => { setFrozenSessionCards([...dueCards]); setSessionStarted(true); }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-4 text-lg font-semibold transition-all active:scale-95"
            >
              Bắt đầu ôn ({dueCards.length} từ)
            </button>
          </>
        )}
      </div>
    </>
  );
}
