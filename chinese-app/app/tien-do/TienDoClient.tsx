"use client";

import { useProgressStore } from "@/lib/progress-store";
import { daysUntilDue } from "@/lib/srs";

interface Props {
  allVocabIds: string[];
  allPhraseIds: string[];
  vocabByLesson: Record<number, string[]>;
}

export default function TienDoClient({ allVocabIds, allPhraseIds, vocabByLesson }: Props) {
  const { cards, streak, getStats } = useProgressStore();

  const vocabStats = getStats(allVocabIds);
  const phraseStats = getStats(allPhraseIds);

  const totalReviews = Object.values(cards).reduce((sum, c) => sum + c.reps, 0);
  const totalLapses = Object.values(cards).reduce((sum, c) => sum + c.lapses, 0);

  const accuracy = totalReviews > 0 ? Math.round(((totalReviews - totalLapses) / totalReviews) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Tiến độ học tập</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi hành trình học tiếng Trung của bạn</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="🔥 Ngày liên tiếp" value={streak} unit="ngày" color="orange" />
        <StatCard label="📝 Tổng lần ôn" value={totalReviews} unit="lần" color="indigo" />
        <StatCard label="🎯 Độ chính xác" value={accuracy} unit="%" color="green" />
        <StatCard label="📅 Cần ôn hôm nay" value={vocabStats.dueToday + phraseStats.dueToday} unit="thẻ" color="purple" />
      </div>

      {/* Vocab progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Từ vựng</h2>
        <ProgressRow label="Đã học" value={vocabStats.learned} total={vocabStats.total} color="bg-indigo-500" />
        <ProgressRow label="Thẻ mới" value={vocabStats.newCards} total={vocabStats.total} color="bg-gray-300" />
        <ProgressRow label="Cần ôn hôm nay" value={vocabStats.dueToday} total={vocabStats.total} color="bg-orange-400" />
      </div>

      {/* Phrase progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Mẫu câu</h2>
        <ProgressRow label="Đã học" value={phraseStats.learned} total={phraseStats.total} color="bg-purple-500" />
        <ProgressRow label="Thẻ mới" value={phraseStats.newCards} total={phraseStats.total} color="bg-gray-300" />
        <ProgressRow label="Cần ôn hôm nay" value={phraseStats.dueToday} total={phraseStats.total} color="bg-orange-400" />
      </div>

      {/* By lesson */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Tiến độ theo bài</h2>
        {Object.entries(vocabByLesson)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([lesson, ids]) => {
            const learned = ids.filter((id) => cards[id] && cards[id].reps > 0).length;
            const pct = Math.round((learned / ids.length) * 100);
            return (
              <div key={lesson} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Bài {lesson}</span>
                  <span className="text-gray-500">{learned}/{ids.length} từ ({pct}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
      </div>

      {/* Upcoming reviews */}
      {Object.keys(cards).length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Thẻ sắp đến hạn</h2>
          <div className="space-y-2">
            {Object.values(cards)
              .filter((c) => c.reps > 0)
              .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
              .slice(0, 8)
              .map((c) => {
                const days = daysUntilDue(c);
                return (
                  <div key={c.cardId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-mono text-xs truncate max-w-[180px]">{c.cardId.replace(/^vocab-|^phrase-|^practice-/, "")}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${days <= 0 ? "bg-red-100 text-red-700" : days <= 1 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                      {days <= 0 ? "Cần ôn ngay" : `+${days} ngày`}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const colorMap: Record<string, string> = {
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    green: "text-green-600 bg-green-50 border-green-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
  };
  return (
    <div className={`rounded-2xl border p-4 text-center ${colorMap[color]}`}>
      <p className={`text-2xl font-bold`}>{value}</p>
      <p className="text-xs mt-0.5">{unit}</p>
      <p className="text-xs mt-1 opacity-70">{label}</p>
    </div>
  );
}

function ProgressRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{value}/{total}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
