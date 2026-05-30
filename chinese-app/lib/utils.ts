import { VocabCard } from "./types";

export function getRandomDistractors(correct: VocabCard, all: VocabCard[], count = 3): VocabCard[] {
  const pool = all.filter((c) => c.id !== correct.id && c.wordType === correct.wordType);
  const fallback = all.filter((c) => c.id !== correct.id);
  const source = pool.length >= count ? pool : fallback;
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}
