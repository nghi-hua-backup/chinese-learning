"use client";

import { useState } from "react";
import { Dialogue } from "@/lib/types";
import DialogueSession from "@/components/DialogueSession";

interface Props {
  dialogues: Dialogue[];
}

export default function HoiThoaiClient({ dialogues }: Props) {
  const [selected, setSelected] = useState<Dialogue | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm">
          ← Danh sách hội thoại
        </button>
        <h2 className="text-lg font-bold text-gray-900 mb-4">{selected.title}</h2>
        <DialogueSession
          dialogue={selected}
          onDone={() => {
            setDone((prev) => new Set([...prev, selected.id]));
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
                  <span className="text-2xl">{done.has(d.id) ? "✅" : "🎯"}</span>
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
