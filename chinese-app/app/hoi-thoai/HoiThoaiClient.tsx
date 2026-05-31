"use client";

import { useState } from "react";
import { Dialogue } from "@/lib/types";
import { useProgressStore } from "@/lib/progress-store";
import DialogueSession from "@/components/DialogueSession";

interface Props {
  dialogues: Dialogue[];
}

export default function HoiThoaiClient({ dialogues }: Props) {
  const [selected, setSelected] = useState<Dialogue | null>(null);
  const { scriptMode, setScriptMode, completedDialogues, markDialogueDone } = useProgressStore();

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
          ← Danh sách hội thoại
        </button>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{selected.title}</h2>
        <DialogueSession
          dialogue={selected}
          scriptMode={scriptMode}
          onDone={() => {
            markDialogueDone(selected.id);
            setSelected(null);
          }}
        />
      </div>
    );
  }

  const byLesson = dialogues.reduce<Record<number, Dialogue[]>>((acc, d) => {
    if (!acc[d.lesson]) acc[d.lesson] = [];
    acc[d.lesson].push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🗣️ Luyện hội thoại</h1>
        <p className="text-gray-500 text-sm mt-1">Thực hành hội thoại theo tình huống</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-700">
        <p className="font-medium mb-1">Cách luyện tập</p>
        <p>Hệ thống sẽ đóng vai A, bạn đóng vai B. Dùng Apple Pencil để viết câu trả lời của bạn, sau đó so sánh với đáp án mẫu.</p>
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

      {Object.entries(byLesson)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([lesson, items]) => (
          <div key={lesson} className="space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Bài {lesson}</h2>
            {items.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelected(d)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{completedDialogues.includes(d.id) ? "✅" : "🎯"}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{d.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{d.lines.length} lượt thoại</p>
                  </div>
                  <span className="text-gray-300 text-xl">›</span>
                </div>
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
