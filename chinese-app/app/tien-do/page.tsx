import { getAllVocab, getAllPhrases, getAllPractice } from "@/lib/data";
import TienDoClient from "./TienDoClient";

export default function TienDoPage() {
  const vocab = getAllVocab();
  const phrases = getAllPhrases();
  const practice = getAllPractice();

  const vocabByLesson = vocab.reduce<Record<number, string[]>>((acc, c) => {
    if (!acc[c.lesson]) acc[c.lesson] = [];
    acc[c.lesson].push(c.id);
    return acc;
  }, {});

  const cardLabels: Record<string, string> = {};
  for (const c of vocab) {
    cardLabels[c.id] = c.simplified === c.traditional ? c.simplified : `${c.simplified}/${c.traditional}`;
  }
  for (const c of phrases) {
    cardLabels[c.id] = c.simplified === c.traditional ? c.simplified : `${c.simplified}/${c.traditional}`;
  }
  for (const c of practice) {
    cardLabels[c.id] = c.simplified === c.traditional ? c.simplified : `${c.simplified}/${c.traditional}`;
  }

  return (
    <TienDoClient
      allVocabIds={vocab.map((c) => c.id)}
      allPhraseIds={[...phrases.map((c) => c.id), ...practice.map((c) => c.id)]}
      vocabByLesson={vocabByLesson}
      cardLabels={cardLabels}
    />
  );
}
