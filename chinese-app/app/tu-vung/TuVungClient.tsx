"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { VocabCard, PracticeMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import { isLessonComplete } from "@/lib/utils";
import VocabSession from "@/components/VocabSession";
import Toast from "@/components/Toast";

interface Props {
  allCards: VocabCard[];
}

const LESSONS = [0, 1, 2, 3, 4, 5, 6]; // 0 = all

export default function TuVungClient({ allCards }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLesson = Number(searchParams.get("lesson") ?? 0);

  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const [mode, setMode] = useState<PracticeMode>("trac-nghiem");
  const autostart = searchParams.get("autostart") === "1";
  const [sessionStarted, setSessionStarted] = useState(autostart);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { scriptMode, setScriptMode, cards, getOverdueReviewedCards, activeSessions } = useProgressStore();

  function handleSessionComplete(count: number) {
    setSessionStarted(false);
    setToastMessage(`Hoàn thành phiên học! Đã ôn ${count} từ.`);
  }

  const filteredCards = useMemo(() => {
    if (selectedLesson === 0) return allCards;
    return allCards.filter((c) => c.lesson === selectedLesson);
  }, [selectedLesson, allCards]);

  const lessons = useMemo(() => Array.from(new Set(allCards.map((c) => c.lesson))).sort((a, b) => a - b), [allCards]);

  const lessonCardIds = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const c of allCards) {
      if (!map[c.lesson]) map[c.lesson] = [];
      map[c.lesson].push(c.id);
    }
    return map;
  }, [allCards]);

  const allCardIds = useMemo(() => allCards.map((c) => c.id), [allCards]);

  const dueCountByLesson = useMemo(() => {
    const map: Record<number, number> = {};
    map[0] = getOverdueReviewedCards(allCardIds).length;
    for (const l of lessons) {
      map[l] = getOverdueReviewedCards(lessonCardIds[l] ?? []).length;
    }
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, lessonCardIds, allCardIds, lessons]);

  const inProgressLessons = useMemo(() => {
    const result = new Set<number>();
    for (const [key, session] of Object.entries(activeSessions)) {
      if (!session || session.cardIds.length === 0) continue;
      const sessionLesson = Number(key);
      if (sessionLesson === 0) {
        for (const cardId of session.cardIds) {
          const card = allCards.find((c) => c.id === cardId);
          if (card) result.add(card.lesson);
        }
      } else {
        result.add(sessionLesson);
      }
    }
    return result;
  }, [activeSessions, allCards]);

  if (sessionStarted) {
    return (
      <div>
        <button
          onClick={() => setSessionStarted(false)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Quay lại
        </button>
        <VocabSession cards={filteredCards} allCards={allCards} mode={mode} scriptMode={scriptMode} reviewOnly={autostart} onSessionComplete={handleSessionComplete} />
      </div>
    );
  }

  return (
    <>
    {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📖 Từ vựng</h1>
          <p className="text-gray-500 text-sm mt-1">{allCards.length} từ · {lessons.length} bài</p>
        </div>
        <Link
          href="/on-tap"
          className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-all"
        >
          🔁 Ôn tập
          {dueCountByLesson[0] > 0 && (
            <span className="bg-white text-orange-600 text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
              {dueCountByLesson[0]}
            </span>
          )}
        </Link>
      </div>

      {/* Lesson filter */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Chọn bài</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLesson(0)}
            className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedLesson === 0 ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            {isLessonComplete(allCardIds, cards) && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">✓</span>
            )}
            {dueCountByLesson[0] > 0 && (
              <span
                className="absolute -bottom-1.5 -right-1.5 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold cursor-pointer z-10"
                onClick={(e) => { e.stopPropagation(); router.push("/on-tap"); }}
              >
                {dueCountByLesson[0]}
              </span>
            )}
            Tất cả
          </button>
          {lessons.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLesson(l)}
              className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedLesson === l
                  ? "bg-indigo-600 text-white"
                  : inProgressLessons.has(l)
                  ? "bg-amber-50 border border-amber-400 text-gray-700 hover:bg-amber-100"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isLessonComplete(lessonCardIds[l] ?? [], cards) && (
                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">✓</span>
              )}
              {dueCountByLesson[l] > 0 && (
                <span
                  className="absolute -bottom-1.5 -right-1.5 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold cursor-pointer z-10"
                  onClick={(e) => { e.stopPropagation(); router.push(`/on-tap?lesson=${l}`); }}
                >
                  {dueCountByLesson[l]}
                </span>
              )}
              Bài {l}
            </button>
          ))}
        </div>
      </div>

      {/* Mode selection */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Hình thức luyện tập</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("trac-nghiem")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "trac-nghiem" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">🔤</p>
            <p className="font-semibold text-sm">Trắc nghiệm</p>
            <p className="text-xs text-gray-500 mt-0.5">Chọn đáp án đúng</p>
          </button>
          <button
            onClick={() => setMode("luyen-viet")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "luyen-viet" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">✍️</p>
            <p className="font-semibold text-sm">Luyện viết</p>
            <p className="text-xs text-gray-500 mt-0.5">Dùng Apple Pencil</p>
          </button>
        </div>
      </div>

      {/* Script mode */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Dạng chữ Hán</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScriptMode("traditional")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${scriptMode === "traditional" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">繁</p>
            <p className="font-semibold text-sm">Phồn thể</p>
            <p className="text-xs text-gray-500 mt-0.5">繁體字</p>
          </button>
          <button
            onClick={() => setScriptMode("simplified")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${scriptMode === "simplified" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">简</p>
            <p className="font-semibold text-sm">Giản thể</p>
            <p className="text-xs text-gray-500 mt-0.5">简体字</p>
          </button>
        </div>
      </div>

      {/* Card count & start */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-gray-600 text-sm mb-1">
          Đang chọn: <span className="font-semibold text-gray-900">{filteredCards.length} từ</span>
          {selectedLesson > 0 && ` · Bài ${selectedLesson}`}
        </p>
        <button
          onClick={() => setSessionStarted(true)}
          disabled={filteredCards.length === 0}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 text-lg font-semibold transition-all active:scale-95 disabled:opacity-40"
        >
          Bắt đầu luyện tập
        </button>
      </div>

    </div>
    </>
  );
}
