import { parseVocab, parsePhrases, parseGrammar, parsePractice, parseDialogues, parseLessonDialogues } from "./parse-markdown";
import { VocabCard, PhraseCard, GrammarPattern, PracticeCard, Dialogue } from "./types";

// These are cached at module level (server-side singleton during build / dev)
let _vocab: VocabCard[] | null = null;
let _phrases: PhraseCard[] | null = null;
let _grammar: GrammarPattern[] | null = null;
let _practice: PracticeCard[] | null = null;
let _dialogues: Dialogue[] | null = null;

export function getAllVocab(): VocabCard[] {
  if (!_vocab) _vocab = parseVocab();
  return _vocab;
}

export function getAllPhrases(): PhraseCard[] {
  if (!_phrases) _phrases = parsePhrases();
  return _phrases;
}

export function getAllGrammar(): GrammarPattern[] {
  if (!_grammar) _grammar = parseGrammar();
  return _grammar;
}

export function getAllPractice(): PracticeCard[] {
  if (!_practice) _practice = parsePractice();
  return _practice;
}

export function getAllDialogues(): Dialogue[] {
  if (!_dialogues) {
    const situational = parseDialogues();
    const lessonBased = parseLessonDialogues();
    _dialogues = [...lessonBased, ...situational];
  }
  return _dialogues;
}

export function getVocabByLesson(lesson: number): VocabCard[] {
  return getAllVocab().filter((c) => c.lesson === lesson);
}

export function getLessons(): number[] {
  const lessons = new Set(getAllVocab().map((c) => c.lesson));
  return Array.from(lessons).sort((a, b) => a - b);
}

