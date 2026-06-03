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
const PUNCT_RE = /[\p{P}\p{S}\s]/u;

export default function ToneHighlight({
  chars,
  pinyin,
  charClassName = "",
  pinyinClassName = "",
  showPinyin = true,
}: Props) {
  const segments = analyzeText(chars, pinyin);

  // Build per-character segment index map (index into segments[])
  // so we break char spans at compound boundaries, not just highlight boundaries
  const segmentIndexMap: number[] = [];
  segments.forEach((seg, i) => {
    for (let j = 0; j < seg.chars.length; j++) segmentIndexMap.push(i);
  });

  // Render character line: group chars by segment index (one span per compound)
  const charSpans: React.ReactNode[] = [];
  let group = "";
  let groupSegIdx = -1;
  let mapIdx = 0;
  let key = 0;

  function flushGroup() {
    if (!group) return;
    const seg = segments[groupSegIdx];
    charSpans.push(
      <span key={key++} className={seg?.highlight ? HL : undefined}>
        {group}
      </span>
    );
    group = "";
  }

  for (const c of Array.from(chars)) {
    if (PUNCT_RE.test(c)) {
      flushGroup();
      charSpans.push(<span key={key++}>{c}</span>);
      groupSegIdx = -1;
    } else {
      const sIdx = segmentIndexMap[mapIdx] ?? -1;
      mapIdx++;
      if (group && sIdx !== groupSegIdx) flushGroup();
      group += c;
      groupSegIdx = sIdx;
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
