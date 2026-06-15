import { Suspense } from "react";
import { getAllVocab } from "@/lib/data";
import OntapClient from "./OntapClient";

export default function OntapPage() {
  const allCards = getAllVocab();
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Đang tải...</div>}>
      <OntapClient allCards={allCards} />
    </Suspense>
  );
}
