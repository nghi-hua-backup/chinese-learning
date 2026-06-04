import { getAllVocab, getAllPhrases, getAllPractice } from "@/lib/data";
import Dashboard from "@/components/Dashboard";

export default function HomePage() {
  const vocab = getAllVocab();
  const phrases = getAllPhrases();
  const practice = getAllPractice();

  const allVocabIds = vocab.map((c) => c.id);
  const allPhraseIds = [...phrases.map((c) => c.id), ...practice.map((c) => c.id)];
  const lessons = Array.from(new Set(vocab.map((c) => c.lesson))).sort((a, b) => a - b);

  const lessonCardIds: Record<number, string[]> = {};
  lessons.forEach((lesson) => {
    lessonCardIds[lesson] = vocab.filter((c) => c.lesson === lesson).map((c) => c.id);
  });

  return (
    <Dashboard
      vocabCount={vocab.length}
      phraseCount={phrases.length + practice.length}
      allVocabIds={allVocabIds}
      allPhraseIds={allPhraseIds}
      lessons={lessons}
      lessonCardIds={lessonCardIds}
    />
  );
}
