import { getAllPhrases, getAllPractice } from "@/lib/data";
import MauCauClient from "./MauCauClient";

export default function MauCauPage() {
  const phrases = getAllPhrases();
  const practice = getAllPractice();
  return <MauCauClient phrases={phrases} practice={practice} />;
}
