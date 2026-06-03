"use client";

import { analyzeText } from "@/lib/tone-utils";

interface Props {
  chars: string;
  pinyin: string;
  charClassName?: string;
  pinyinClassName?: string;
  showPinyin?: boolean;
}

const HL = "bg-blue-100 rounded px-0.5";

export default function ToneHighlight({
  chars,
  pinyin,
  charClassName = "",
  pinyinClassName = "",
  showPinyin = true,
}: Props) {
  const segments = analyzeText(chars, pinyin);

  // Build per-character highlight map (for non-punctuation chars in order)
  const highlightMap: boolean[] = [];
  for (const seg of segments) {
    for (let i = 0; i < seg.chars.length; i++) {
      highlightMap.push(seg.highlight);
    }
  }

  // Render character line: walk original string, group same-highlight runs
  const charSpans: React.ReactNode[] = [];
  let group = "";
  let groupHl = false;
  let mapIdx = 0;
  let key = 0;

  function flushGroup() {
    if (!group) return;
    charSpans.push(
      <span key={key++} className={groupHl ? HL : undefined}>
        {group}
      </span>
    );
    group = "";
  }

  for (const c of Array.from(chars)) {
    const isPunct = /[\p{P}\p{S}\s]/u.test(c);
    if (isPunct) {
      flushGroup();
      charSpans.push(<span key={key++}>{c}</span>);
    } else {
      const hl = highlightMap[mapIdx] ?? false;
      mapIdx++;
      if (group && hl !== groupHl) flushGroup();
      group += c;
      groupHl = hl;
    }
  }
  flushGroup();

  // Render pinyin line: one span per compound
  const pinyinSpans: React.ReactNode[] = [];
  segments.forEach((seg, i) => {
    if (i > 0) pinyinSpans.push(<span key={`sp-${i}`}> </span>);
    pinyinSpans.push(
      <span key={`py-${i}`} className={seg.highlight ? HL : undefined}>
        {seg.pinyin}
      </span>
    );
  });

  return (
    <>
      <p className={charClassName}>{charSpans}</p>
      {showPinyin && <p className={pinyinClassName}>{pinyinSpans}</p>}
    </>
  );
}
