import { createEmptyCard, fsrs, generatorParameters, Rating, Card, RecordLog } from "ts-fsrs";
import { CardProgress } from "./types";

const f = fsrs(generatorParameters({ enable_fuzz: true }));

export function createNewCard(cardId: string): CardProgress {
  const card = createEmptyCard();
  return toProgress(cardId, card, new Date().toISOString());
}

export function reviewCard(progress: CardProgress, rating: number): CardProgress {
  const card = fromProgress(progress);
  const now = new Date();
  const log: RecordLog = f.repeat(card, now);

  const fsrsRating =
    rating === 1 ? Rating.Again : rating === 2 ? Rating.Hard : rating === 3 ? Rating.Good : Rating.Easy;

  const result = log[fsrsRating];
  return toProgress(progress.cardId, result.card, now.toISOString());
}

export function isDue(progress: CardProgress): boolean {
  return new Date(progress.due) <= new Date();
}

export function daysUntilDue(progress: CardProgress): number {
  const diff = new Date(progress.due).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function toProgress(cardId: string, card: Card, lastReview: string): CardProgress {
  return {
    cardId,
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: lastReview,
  };
}

function fromProgress(p: CardProgress): Card {
  return {
    due: new Date(p.due),
    stability: p.stability,
    difficulty: p.difficulty,
    elapsed_days: p.elapsed_days,
    scheduled_days: p.scheduled_days,
    reps: p.reps,
    lapses: p.lapses,
    state: p.state,
    last_review: p.last_review ? new Date(p.last_review) : undefined,
  } as Card;
}
