"use client";

import { useState, useMemo } from "react";
import { GrammarPattern } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import GrammarSession from "@/components/GrammarSession";
import Toast from "@/components/Toast";

interface Props {
  patterns: GrammarPattern[];
}

export default function NguPhapClient({ patterns }: Props) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { scriptMode, getDueCards } = useProgressStore();

  const patternIds = useMemo(() => patterns.map((p) => p.id), [patterns]);
  const dueCount = useMemo(() => getDueCards(patternIds).length, [patternIds, getDueCards]);

  function handleSessionComplete(count: number) {
    setSessionStarted(false);
    setToastMessage(`Hoàn thành phiên học! Đã ôn ${count} mẫu.`);
  }

  if (sessionStarted) {
    return (
      <div>
        <button
          onClick={() => setSessionStarted(false)}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Quay lại
        </button>
        <GrammarSession
          patterns={patterns}
          scriptMode={scriptMode}
          onSessionComplete={handleSessionComplete}
        />
      </div>
    );
  }

  return (
    <>
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📝 Ngữ pháp</h1>
          <p className="text-gray-500 text-sm mt-1">
            {patterns.length} mẫu ngữ pháp · {dueCount} cần ôn hôm nay
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Chọn chế độ luyện tập</p>
          <button
            onClick={() => setSessionStarted(true)}
            disabled={dueCount === 0}
            className={`w-full rounded-2xl p-5 text-left border-2 transition-all ${
              dueCount > 0
                ? "border-indigo-500 bg-indigo-50 hover:bg-indigo-100 active:scale-98"
                : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="font-semibold text-gray-900">Nhận diện</div>
            <div className="text-sm text-gray-500 mt-0.5">
              {dueCount > 0
                ? `${dueCount} mẫu cần ôn — nhìn câu ví dụ, chọn tên ngữ pháp đúng`
                : "Không có mẫu nào cần ôn hôm nay"}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
