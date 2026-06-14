import { Suspense } from "react";
import { getAllVocab } from "@/lib/data";
import TuVungClient from "./tu-vung/TuVungClient";

export default function Home() {
  const allCards = getAllVocab();
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Đang tải...</div>}>
      <TuVungClient allCards={allCards} />
    </Suspense>
  );
}
