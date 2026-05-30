"use client";

import { useState, useMemo } from "react";
import { PhraseCard, PracticeCard } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import PhraseSession from "@/components/PhraseSession";

interface Props {
  phrases: PhraseCard[];
  practice: PracticeCard[];
}

type Tab = "cau-thong-dung" | "luyen-tap";

export default function MauCauClient({ phrases, practice }: Props) {
  const [tab, setTab] = useState<Tab>("cau-thong-dung");
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const { scriptMode, setScriptMode } = useProgressStore();

  const lessons = useMemo(() => Array.from(new Set(practice.map((c) => c.lesson))).sort((a, b) => a - b), [practice]);

  const activeCards = useMemo(() => {
    if (tab === "cau-thong-dung") return phrases;
    if (selectedLesson === 0) return practice;
    return practice.filter((c) => c.lesson === selectedLesson);
  }, [tab, phrases, practice, selectedLesson]);

  const title = tab === "cau-thong-dung" ? "Câu thông dụng" : "Câu luyện tập";

  if (sessionStarted) {
    return (
      <div>
        <button onClick={() => setSessionStarted(false)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
          ← Quay lại
        </button>
        <PhraseSession cards={activeCards} title={title} scriptMode={scriptMode} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">💬 Mẫu câu</h1>
        <p className="text-gray-500 text-sm mt-1">Luyện câu thông dụng & câu mẫu theo bài</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        {(["cau-thong-dung", "luyen-tap"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            {t === "cau-thong-dung" ? `Câu thông dụng (${phrases.length})` : `Câu luyện tập (${practice.length})`}
          </button>
        ))}
      </div>

      {/* Lesson filter for practice */}
      {tab === "luyen-tap" && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLesson(0)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedLesson === 0 ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
          >
            Tất cả
          </button>
          {lessons.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLesson(l)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedLesson === l ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
            >
              Bài {l}
            </button>
          ))}
        </div>
      )}

      {/* Script mode */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Dạng chữ Hán</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScriptMode("traditional")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${scriptMode === "traditional" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">繁</p>
            <p className="font-semibold text-sm">Phồn thể</p>
            <p className="text-xs text-gray-500 mt-0.5">繁體字</p>
          </button>
          <button
            onClick={() => setScriptMode("simplified")}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${scriptMode === "simplified" ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-white"}`}
          >
            <p className="text-xl mb-1">简</p>
            <p className="font-semibold text-sm">Giản thể</p>
            <p className="text-xs text-gray-500 mt-0.5">简体字</p>
          </button>
        </div>
      </div>

      {/* Start */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-gray-600 text-sm mb-3">
          <span className="font-semibold text-gray-900">{activeCards.length} câu</span> trong bộ này
        </p>
        <button
          onClick={() => setSessionStarted(true)}
          disabled={activeCards.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 text-lg font-semibold transition-all active:scale-95 disabled:opacity-40"
        >
          Bắt đầu luyện viết
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">Dùng Apple Pencil → bàn phím tiếng Trung (手写)</p>
      </div>

    </div>
  );
}
