"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { VocabCard, PracticeMode } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import VocabSession from "@/components/VocabSession";

interface Props {
  allCards: VocabCard[];
}

const LESSONS = [0, 1, 2, 3, 4, 5, 6]; // 0 = all

export default function TuVungClient({ allCards }: Props) {
  const searchParams = useSearchParams();
  const initialLesson = Number(searchParams.get("lesson") ?? 0);

  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const [mode, setMode] = useState<PracticeMode>("trac-nghiem");
  const autostart = searchParams.get("autostart") === "1";
  const [sessionStarted, setSessionStarted] = useState(autostart);
  const { scriptMode, setScriptMode } = useProgressStore();

  const filteredCards = useMemo(() => {
    if (selectedLesson === 0) return allCards;
    return allCards.filter((c) => c.lesson === selectedLesson);
  }, [selectedLesson, allCards]);

  const lessons = useMemo(() => Array.from(new Set(allCards.map((c) => c.lesson))).sort((a, b) => a - b), [allCards]);

  if (sessionStarted) {
    return (
      <div>
        <button
          onClick={() => setSessionStarted(false)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Quay lại
        </button>
        <VocabSession cards={filteredCards} allCards={allCards} mode={mode} scriptMode={scriptMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📖 Từ vựng</h1>
        <p className="text-gray-500 text-sm mt-1">{allCards.length} từ · {lessons.length} bài</p>
      </div>

      {/* Lesson filter */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Chọn bài</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLesson(0)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedLesson === 0 ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
          >
            Tất cả
          </button>
          {lessons.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLesson(l)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedLesson === l ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
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
  );
}
