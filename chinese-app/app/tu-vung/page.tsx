import { Suspense } from "react";
import { getAllVocab } from "@/lib/data";
import TuVungClient from "./TuVungClient";

export default function TuVungPage() {
  const vocab = getAllVocab();
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Đang tải...</div>}>
      <TuVungClient allCards={vocab} />
    </Suspense>
  );
}
