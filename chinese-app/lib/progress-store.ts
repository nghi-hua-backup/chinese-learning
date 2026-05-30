"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CardProgress, ReviewRating, ScriptMode } from "./types";
import { createNewCard, reviewCard, isDue } from "./srs";

interface ProgressState {
  cards: Record<string, CardProgress>;
  streak: number;
  lastStudyDate: string | null;
  scriptMode: ScriptMode;
  setScriptMode: (mode: ScriptMode) => void;
  reviewCard: (cardId: string, rating: ReviewRating) => void;
  getOrCreate: (cardId: string) => CardProgress;
  getDueCards: (cardIds: string[]) => string[];
  getStats: (cardIds: string[]) => {
    total: number;
    learned: number;
    dueToday: number;
    newCards: number;
  };
  resetAll: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      cards: {},
      streak: 0,
      lastStudyDate: null,
      scriptMode: "traditional",

      setScriptMode(mode) {
        set({ scriptMode: mode });
      },

      getOrCreate(cardId) {
        const existing = get().cards[cardId];
        if (existing) return existing;
        return createNewCard(cardId);
      },

      reviewCard(cardId, rating) {
        const existing = get().getOrCreate(cardId);
        const updated = reviewCard(existing, rating);
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

      getDueCards(cardIds) {
        const { cards } = get();
        return cardIds.filter((id) => {
          const progress = cards[id];
          if (!progress) return true; // new card = always due
          return isDue(progress);
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
