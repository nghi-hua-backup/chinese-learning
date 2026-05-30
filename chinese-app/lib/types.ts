export interface VocabCard {
  id: string;
  lesson: number;
  lessonTitle: string;
  simplified: string;
  traditional: string;
  pinyin: string;
  hanViet: string;
  wordType: string;
  meaning: string;
}

export interface GrammarPattern {
  id: string;
  name: string;
  structure: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface GrammarExample {
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
}

export interface PhraseCard {
  id: string;
  category: string;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
}

export interface PracticeCard {
  id: string;
  lesson: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
}

export interface DialogueLine {
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  speaker?: string;
}

export interface Dialogue {
  id: string;
  title: string;
  lesson: number;
  lines: DialogueLine[];
}

export interface CardProgress {
  cardId: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: string;
}

export type ReviewRating = 1 | 2 | 3 | 4;

export type PracticeMode = "trac-nghiem" | "luyen-viet";
export type CardType = "vocab" | "phrase" | "practice";
