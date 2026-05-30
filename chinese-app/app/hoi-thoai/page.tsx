import { getAllDialogues } from "@/lib/data";
import HoiThoaiClient from "./HoiThoaiClient";

export default function HoiThoaiPage() {
  const dialogues = getAllDialogues();
  return <HoiThoaiClient dialogues={dialogues} />;
}
