"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/lib/progress-store";

const MIGRATION_KEY = "migration-v2-vocab-only";

export default function MigrationRunner() {
  const pruneToVocabOnly = useProgressStore((s) => s.pruneToVocabOnly);

  useEffect(() => {
    if (localStorage.getItem(MIGRATION_KEY)) return;
    pruneToVocabOnly();
    localStorage.setItem(MIGRATION_KEY, "1");
  }, [pruneToVocabOnly]);

  return null;
}
