import { VocabCard, ScriptMode, CardProgress } from "./types";

export type DiffChar = { char: string; matched: boolean };

export function computeLCSDiff(
  input: string,
  expected: string
): { inputChars: DiffChar[]; expectedChars: DiffChar[] } {
  const m = input.length;
  const n = expected.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (input[i - 1] === expected[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  const inputMatched = new Array(m).fill(false);
  const expectedMatched = new Array(n).fill(false);
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (input[i - 1] === expected[j - 1]) {
      inputMatched[i - 1] = true;
      expectedMatched[j - 1] = true;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return {
    inputChars: input.split("").map((char, idx) => ({ char, matched: inputMatched[idx] })),
    expectedChars: expected.split("").map((char, idx) => ({ char, matched: expectedMatched[idx] })),
  };
}

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
