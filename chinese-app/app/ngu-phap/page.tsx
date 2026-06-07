import { Suspense } from "react";
import { getAllGrammar } from "@/lib/data";
import NguPhapClient from "./NguPhapClient";

export default function NguPhapPage() {
  const patterns = getAllGrammar();
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Đang tải...</div>}>
      <NguPhapClient patterns={patterns} />
    </Suspense>
  );
}
