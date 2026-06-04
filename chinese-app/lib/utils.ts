import { VocabCard, ScriptMode, CardProgress } from "./types";

export function isLessonComplete(cardIds: string[], cards: Record<string, CardProgress>): boolean {
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

export function getDisplayChar(
  card: { simplified: string; traditional: string },
  mode: ScriptMode
): string {
  return mode === "traditional" ? card.traditional : card.simplified;
}

export function getRandomDistractors(correct: VocabCard, all: VocabCard[], count = 3): VocabCard[] {
  const pool = all.filter((c) => c.id !== correct.id && c.wordType === correct.wordType);
  const fallback = all.filter((c) => c.id !== correct.id);
  const source = pool.length >= count ? pool : fallback;
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}
