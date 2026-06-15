"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CardProgress, ScriptMode } from "./types";
import { createNewCard, reviewCard, isDue } from "./srs";

interface ProgressState {
  cards: Record<string, CardProgress>;
  streak: number;
  lastStudyDate: string | null;
  scriptMode: ScriptMode;
  setScriptMode: (mode: ScriptMode) => void;
  reviewCard: (cardId: string) => void;
  getOrCreate: (cardId: string) => CardProgress;
  completedDialogues: string[];
  markDialogueDone: (id: string) => void;
  getDueCards: (cardIds: string[]) => string[];
  getOverdueReviewedCards: (cardIds: string[]) => string[];
  getStats: (cardIds: string[]) => {
    total: number;
    learned: number;
    dueToday: number;
    newCards: number;
  };
  resetAll: () => void;
  pruneToVocabOnly: () => void;
  activeSessions: Record<number, { cardIds: string[]; startedAt: string }>;
  startSession: (lesson: number, cardIds: string[]) => void;
  completeSessionCard: (lesson: number, cardId: string) => void;
  clearSession: (lesson: number) => void;
  getInProgressLessons: () => number[];
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      cards: {},
      streak: 0,
      lastStudyDate: null,
      scriptMode: "traditional",
      completedDialogues: [],
      activeSessions: {},

      markDialogueDone(id) {
        set((state) => ({
          completedDialogues: state.completedDialogues.includes(id)
            ? state.completedDialogues
            : [...state.completedDialogues, id],
        }));
      },

      setScriptMode(mode) {
        set({ scriptMode: mode });
      },

      getOrCreate(cardId) {
        const existing = get().cards[cardId];
        if (existing) return existing;
        return createNewCard(cardId);
      },

      reviewCard(cardId) {
        const existing = get().getOrCreate(cardId);
        const updated = reviewCard(existing, 3);
        const today = new Date().toISOString().slice(0, 10);
        const lastDate = get().lastStudyDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        set((state) => ({
          cards: { ...state.cards, [cardId]: updated },
          lastStudyDate: today,
          streak:
            lastDate === today
              ? state.streak
              : lastDate === yesterday
              ? state.streak + 1
              : 1,
        }));
      },

      resetAll() {
        set({ cards: {}, streak: 0, lastStudyDate: null });
      },

      pruneToVocabOnly() {
        set((state) => ({
          cards: Object.fromEntries(
            Object.entries(state.cards).filter(([id]) => id.startsWith("vocab-"))
          ),
          completedDialogues: [],
        }));
      },

      startSession(lesson, cardIds) {
        set((state) => ({
          activeSessions: {
            ...state.activeSessions,
            [lesson]: { cardIds, startedAt: new Date().toISOString() },
          },
        }));
      },

      completeSessionCard(lesson, cardId) {
        set((state) => {
          const session = state.activeSessions[lesson];
          if (!session) return state;
          return {
            activeSessions: {
              ...state.activeSessions,
              [lesson]: { ...session, cardIds: session.cardIds.filter((id) => id !== cardId) },
            },
          };
        });
      },

      clearSession(lesson) {
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [lesson]: _removed, ...rest } = state.activeSessions;
          return { activeSessions: rest };
        });
      },

      getInProgressLessons() {
        const { activeSessions } = get();
        return Object.keys(activeSessions)
          .map(Number)
          .filter((l) => (activeSessions[l]?.cardIds.length ?? 0) > 0);
      },

      getDueCards(cardIds) {
        const { cards } = get();
        return cardIds.filter((id) => {
          const progress = cards[id];
          if (!progress) return true; // new card = always due
          return isDue(progress);
        });
      },

      getOverdueReviewedCards(cardIds) {
        const { cards } = get();
        return cardIds.filter((id) => {
          const progress = cards[id];
          return progress && progress.reps > 0 && isDue(progress);
        });
      },

      getStats(cardIds) {
        const { cards } = get();
        const total = cardIds.length;
        const learned = cardIds.filter((id) => cards[id] && cards[id].reps > 0).length;
        const dueToday = cardIds.filter((id) => {
          const p = cards[id];
          if (!p) return true;
          return isDue(p);
        }).length;
        const newCards = cardIds.filter((id) => !cards[id] || cards[id].reps === 0).length;
        return { total, learned, dueToday, newCards };
      },
    }),
    {
      name: "chinese-srs-progress",
    }
  )
);
