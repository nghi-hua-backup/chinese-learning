"use client";

import { useState } from "react";
import { Dialogue, ScriptMode } from "@/lib/types";
import { getDisplayChar, computeLCSDiff } from "@/lib/utils";
import ToneHighlight from "./ToneHighlight";

interface Props {
  dialogue: Dialogue;
  onDone: () => void;
  scriptMode: ScriptMode;
}

export default function DialogueSession({ dialogue, onDone, scriptMode }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const line = dialogue.lines[lineIndex];
  const isLast = lineIndex >= dialogue.lines.length - 1;
  // Alternate: even lines = system says, odd lines = user writes
  const isUserTurn = lineIndex % 2 !== 0;
  const expected = getDisplayChar(line, scriptMode);
  const isExactMatch = showAnswer && isUserTurn && input.length > 0 && input === expected;
  const diffResult = showAnswer && isUserTurn && input.length > 0 && input !== expected
    ? computeLCSDiff(input, expected)
    : null;

  function handleCheck() {
    setShowAnswer(true);
  }

  function handleNext() {
    if (isLast) {
      onDone();
      return;
    }
    setLineIndex((i) => i + 1);
    setInput("");
    setShowAnswer(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${((lineIndex) / dialogue.lines.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">{lineIndex + 1}/{dialogue.lines.length}</span>
      </div>

      {/* Previous lines context */}
      {lineIndex > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto">
          {dialogue.lines.slice(0, lineIndex).map((l, i) => (
            <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-xs text-sm ${i % 2 === 0 ? "bg-gray-200 text-gray-700" : "bg-indigo-100 text-indigo-800"}`}>
                <ToneHighlight
                  chars={getDisplayChar(l, scriptMode)}
                  pinyin={l.pinyin}
                  charClassName="text-xl font-medium"
                  pinyinClassName="text-xs text-gray-500 mt-0.5"
                />
                <p className="text-xs text-gray-500 mt-0.5">{l.meaning}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Current line */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        {!isUserTurn ? (
          <>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Lượt hệ thống</p>
            <ToneHighlight
              chars={getDisplayChar(line, scriptMode)}
              pinyin={line.pinyin}
              charClassName="text-6xl font-bold text-gray-800 mb-1"
              pinyinClassName="text-indigo-500"
            />
            <p className="text-gray-600 mt-1 text-sm">{line.meaning}</p>
            <button
              onClick={handleNext}
              className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-all"
            >
              {isLast ? "Hoàn thành" : "Tiếp →"}
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Lượt của bạn — viết câu trả lời</p>
            <p className="text-gray-500 italic text-sm mb-4">"{line.meaning}"</p>

            {!showAnswer ? (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  placeholder=""
                  lang="zh-Hans"
                  inputMode="text"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full text-5xl border-2 border-gray-300 rounded-xl p-3 focus:border-indigo-500 outline-none resize-none"
                />
                <button
                  onClick={handleCheck}
                  className="mt-3 w-full bg-purple-600 text-white rounded-xl py-3 font-semibold hover:bg-purple-700 transition-all"
                >
                  Xem đáp án
                </button>
              </>
            ) : (
              <>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Đáp án mẫu:</p>
                  {diffResult ? (
                    <p className="text-5xl font-bold leading-relaxed">
                      {diffResult.expectedChars.map((c, i) => (
                        <span key={i} className={c.matched ? "text-gray-800" : "text-green-600"}>{c.char}</span>
                      ))}
                    </p>
                  ) : (
                    <ToneHighlight
                      chars={getDisplayChar(line, scriptMode)}
                      pinyin={line.pinyin}
                      charClassName="text-5xl font-bold text-gray-800"
                      pinyinClassName="text-indigo-600 text-sm mt-1"
                    />
                  )}
                </div>
                {isExactMatch && (
                  <div className="mt-3 bg-green-500 text-white rounded-xl p-4 text-center font-semibold text-lg">
                    Chính xác! ✓
                  </div>
                )}
                {diffResult && (
                  <div className="mt-3 bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Bạn viết:</p>
                    <p className="text-xl leading-relaxed">
                      {diffResult.inputChars.map((c, i) => (
                        <span key={i} className={c.matched ? "text-gray-700" : "text-red-600"}>{c.char}</span>
                      ))}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition-all"
                >
                  {isLast ? "Hoàn thành hội thoại" : "Tiếp →"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
