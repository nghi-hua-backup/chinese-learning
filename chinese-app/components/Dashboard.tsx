"use client";

import Link from "next/link";
import { useProgressStore } from "@/lib/progress-store";
import { CardProgress } from "@/lib/types";

interface Props {
  vocabCount: number;
  phraseCount: number;
  allVocabIds: string[];
  allPhraseIds: string[];
  lessons: number[];
  lessonCardIds: Record<number, string[]>;
}

function isLessonComplete(cardIds: string[], cards: Record<string, CardProgress>): boolean {
  if (cardIds.length === 0) return false;
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return cardIds.every((id) => {
    const c = cards[id];
    if (!c || c.reps === 0) return false;
    const overdueMs = now - new Date(c.due).getTime();
    return overdueMs <= sevenDaysMs;
  });
}

export default function Dashboard({ vocabCount, phraseCount, allVocabIds, allPhraseIds, lessons, lessonCardIds }: Props) {
  const { getStats, streak, cards } = useProgressStore();

  const vocabStats = getStats(allVocabIds);
  const phraseStats = getStats(allPhraseIds);

  const totalDue = vocabStats.dueToday + phraseStats.dueToday;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xin chào! 你好 👋</h1>
        <p className="text-gray-500 mt-1">Sẵn sàng học tiếng Trung hôm nay?</p>
      </div>

      {/* Streak + Due summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{streak}</p>
          <p className="text-sm text-orange-500 mt-1">🔥 Ngày liên tiếp</p>
        </div>
        <div className={`rounded-2xl p-4 text-center border ${totalDue > 0 ? "bg-indigo-50 border-indigo-100" : "bg-green-50 border-green-100"}`}>
          <p className={`text-3xl font-bold ${totalDue > 0 ? "text-indigo-600" : "text-green-600"}`}>{totalDue}</p>
          <p className={`text-sm mt-1 ${totalDue > 0 ? "text-indigo-500" : "text-green-500"}`}>
            {totalDue > 0 ? "Thẻ cần ôn hôm nay" : "✓ Ôn xong hôm nay!"}
          </p>
        </div>
      </div>

      {/* Practice sections */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700">Bắt đầu luyện tập</h2>

        <Link href="/tu-vung" className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-98">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📖</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Từ vựng</h3>
              <p className="text-sm text-gray-500">{vocabStats.dueToday} cần ôn · {vocabStats.learned}/{vocabCount} đã học</p>
            </div>
            <div className="text-gray-300 text-xl">›</div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-gray-100 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(vocabStats.learned / vocabCount) * 100}%` }} />
          </div>
        </Link>

        <Link href="/mau-cau" className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-98">
          <div className="flex items-center gap-4">
            <span className="text-3xl">💬</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Mẫu câu & Câu thông dụng</h3>
              <p className="text-sm text-gray-500">{phraseStats.dueToday} cần ôn · {phraseStats.learned}/{phraseCount} đã học</p>
            </div>
            <div className="text-gray-300 text-xl">›</div>
          </div>
          <div className="mt-3 bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(phraseStats.learned / phraseCount) * 100}%` }} />
          </div>
        </Link>

        <Link href="/hoi-thoai" className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-98">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🗣️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Luyện hội thoại</h3>
              <p className="text-sm text-gray-500">Tình huống thực tế · Bài 3–6</p>
            </div>
            <div className="text-gray-300 text-xl">›</div>
          </div>
        </Link>
      </div>

      {/* Lesson overview */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700">Các bài học</h2>
        <div className="grid grid-cols-3 gap-3">
          {lessons.map((lesson) => {
            const complete = isLessonComplete(lessonCardIds[lesson] ?? [], cards);
            return (
              <Link
                key={lesson}
                href={`/tu-vung?lesson=${lesson}`}
                className="relative bg-white border border-gray-100 rounded-xl p-3 text-center hover:bg-indigo-50 hover:border-indigo-200 transition-all"
              >
                {complete && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </span>
                )}
                <p className="text-sm font-medium text-gray-700">Bài {lesson}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
