import fs from "fs";
import path from "path";
import { VocabCard, PhraseCard, GrammarPattern, GrammarExample, PracticeCard, Dialogue, DialogueLine } from "./types";

const KB_PATH = path.join(process.cwd(), "..", "chinese-learning", "knowledge-base");

function readFile(filename: string): string {
  return fs.readFileSync(path.join(KB_PATH, filename), "utf-8");
}

function parseMarkdownTable(block: string): Record<string, string>[] {
  const lines = block.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 3) return [];

  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  const rows: Record<string, string>[] = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i]
      .split("|")
      .map((c) => c.trim())
      .filter((_, idx) => idx > 0 && idx <= headers.length);
    if (cells.length < headers.length) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿　-〿]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseVocab(): VocabCard[] {
  const content = readFile("chinese-brain.md");
  const cards: VocabCard[] = [];

  // Extract section §2 Từ vựng
  const vocabSection = content.match(/## 2\. Từ vựng[\s\S]*?(?=## 3\.)/)?.[0] ?? "";

  // Split by lesson headers
  const lessonBlocks = vocabSection.split(/(?=### Bài \d+)/);

  for (const block of lessonBlocks) {
    const lessonMatch = block.match(/### (Bài (\d+)[^\n]*)/);
    if (!lessonMatch) continue;
    const lessonTitle = lessonMatch[1].trim();
    const lessonNum = parseInt(lessonMatch[2]);

    const rows = parseMarkdownTable(block);
    for (const row of rows) {
      const traditional = row["繁體"] ?? "";
      if (!traditional || traditional === "繁體") continue;

      const simplified = row["简体"] === "—" || row["简体"] === "" ? traditional : row["简体"];
      const pinyin = row["Pinyin"] ?? "";
      const hanViet = row["Hán Việt"] ?? "";
      const wordType = row["Từ loại"] ?? "";
      const meaning = row["Nghĩa (Tiếng Việt)"] ?? "";

      if (!traditional || !pinyin) continue;

      cards.push({
        id: `vocab-bai${lessonNum}-${slugify(traditional)}`,
        lesson: lessonNum,
        lessonTitle,
        simplified,
        traditional,
        pinyin,
        hanViet,
        wordType,
        meaning,
      });
    }
  }

  return cards;
}

export function parsePhrases(): PhraseCard[] {
  const content = readFile("chinese-brain.md");
  const cards: PhraseCard[] = [];

  const phraseSection = content.match(/## 6\. Câu thông dụng[\s\S]*?(?=## 7\.|$)/)?.[0] ?? "";
  const categoryBlocks = phraseSection.split(/(?=### )/);

  for (const block of categoryBlocks) {
    const catMatch = block.match(/### ([^\n]+)/);
    if (!catMatch) continue;
    const category = catMatch[1].trim();

    const rows = parseMarkdownTable(block);
    for (const row of rows) {
      const traditional = row["繁體"] ?? "";
      if (!traditional || traditional === "繁體") continue;

      const simplified = row["简体"] === "—" || row["简体"] === "" ? traditional : row["简体"];
      const pinyin = row["Pinyin"] ?? "";
      const meaning = row["Nghĩa"] ?? "";

      if (!traditional || !pinyin) continue;

      cards.push({
        id: `phrase-${slugify(category)}-${slugify(traditional)}`,
        category,
        simplified,
        traditional,
        pinyin,
        meaning,
      });
    }
  }

  return cards;
}

export function parseGrammar(): GrammarPattern[] {
  const content = readFile("chinese-brain.md");
  const patterns: GrammarPattern[] = [];

  const grammarSection = content.match(/## 5\. Ngữ pháp[\s\S]*?(?=## 6\.)/)?.[0] ?? "";
  const patternBlocks = grammarSection.split(/\n---\n/).filter((b) => b.includes("**Cấu trúc:**"));

  for (const block of patternBlocks) {
    const nameMatch = block.match(/### ([^\n]+)/);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim();

    const structureMatch = block.match(/\*\*Cấu trúc:\*\*([^\n*]+(?:\n[^\n*]+)*?)(?=\n\*\*)/);
    const structure = structureMatch ? structureMatch[1].trim() : "";

    const explanationMatch = block.match(/\*\*Giải thích:\*\*([^\n*]+(?:\n[^\n*]+)*?)(?=\n\*\*)/);
    const explanation = explanationMatch ? explanationMatch[1].trim() : "";

    // Parse bullet-point examples: - 汉字 / 漢字 / /pinyin/ — meaning
    const examples: GrammarExample[] = [];
    const exampleLines = block.match(/^- .+/gm) ?? [];
    for (const line of exampleLines) {
      // Format: 简体 / 繁體 /pinyin/ — meaning   OR  just 简体 /pinyin/ — meaning
      const parts = line.replace(/^- /, "").split(/\s*—\s*/);
      if (parts.length < 2) continue;
      const meaning = parts.slice(1).join("—").trim();
      const chinesePart = parts[0];

      // Extract pinyin between /…/
      const pinyinMatch = chinesePart.match(/\/([^/]+)\//);
      const pinyin = pinyinMatch ? pinyinMatch[1].trim() : "";
      const chineseNoPin = chinesePart.replace(/\/[^/]+\//, "").trim();

      // Split simplified / traditional
      const charParts = chineseNoPin.split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean);
      const simplified = charParts[0] ?? "";
      const traditional = charParts[1] ?? simplified;

      if (!simplified && !pinyin) continue;
      examples.push({ simplified, traditional, pinyin, meaning });
    }

    // Also grab table rows if present
    const tableRows = parseMarkdownTable(block);
    for (const row of tableRows) {
      const trad = row["繁體"] ?? row["Hành động"] ?? "";
      if (!trad || trad === "繁體") continue;
    }

    patterns.push({
      id: `grammar-${slugify(name)}`,
      name,
      structure,
      explanation,
      examples,
    });
  }

  return patterns;
}

export function parsePractice(): PracticeCard[] {
  const content = readFile("chinese-practice-bank.md");
  const cards: PracticeCard[] = [];

  const lessonBlocks = content.split(/(?=### Bài \d+)/);
  for (const block of lessonBlocks) {
    const lessonMatch = block.match(/### Bài (\d+)/);
    if (!lessonMatch) continue;
    const lessonNum = parseInt(lessonMatch[1]);

    // Only take the main practice table (not dialogue sub-sections)
    const mainTableBlock = block.split(/### Bài \d+ — Hội thoại/)[0];
    const rows = parseMarkdownTable(mainTableBlock);

    for (const row of rows) {
      const traditional = row["繁體"] ?? "";
      if (!traditional || traditional === "繁體") continue;

      const simplified = row["简体"] === "—" || row["简体"] === "" ? traditional : row["简体"];
      const pinyin = row["Pinyin"] ?? "";
      const meaning = row["Nghĩa (Tiếng Việt)"] ?? "";

      if (!traditional || !pinyin) continue;

      cards.push({
        id: `practice-bai${lessonNum}-${slugify(traditional.slice(0, 10))}`,
        lesson: lessonNum,
        simplified,
        traditional,
        pinyin,
        meaning,
      });
    }
  }

  // Deduplicate by id
  const seen = new Set<string>();
  return cards.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export function parseDialogues(): Dialogue[] {
  const content = readFile("chinese-practice-bank.md");
  const dialogues: Dialogue[] = [];

  // Find "Luyện tập tổng hợp" sections or situation blocks
  const situationRegex = /#### (Tình huống \d+[^\n]*)\n([\s\S]*?)(?=####|###|$)/g;
  let match: RegExpExecArray | null;

  // Track which "Cập nhật sau Bài N" context we're in
  const updateBlocks = content.split(/### Cập nhật sau Bài (\d+)/);

  let dialogueIdx = 0;
  for (let bi = 1; bi < updateBlocks.length; bi += 2) {
    const lessonNum = parseInt(updateBlocks[bi]);
    const blockContent = updateBlocks[bi + 1] ?? "";

    const regex = /#### (Tình huống \d+[^\n]*)\n([\s\S]*?)(?=####|$)/g;
    while ((match = regex.exec(blockContent)) !== null) {
      const title = match[1].trim();
      const tableBlock = match[2];

      const rows = parseMarkdownTable(tableBlock);
      const lines: DialogueLine[] = rows
        .filter((r) => r["繁體"] && r["繁體"] !== "繁體")
        .map((r) => {
          const traditional = r["繁體"];
          const simplified = r["简体"] === "—" || r["简体"] === "" ? traditional : r["简体"];
          return {
            simplified,
            traditional,
            pinyin: r["Pinyin"] ?? "",
            meaning: r["Nghĩa (Tiếng Việt)"] ?? "",
          };
        });

      if (lines.length === 0) continue;

      dialogues.push({
        id: `dialogue-bai${lessonNum}-${++dialogueIdx}`,
        title,
        lesson: lessonNum,
        lines,
      });
    }
  }

  return dialogues;
}

// Also parse Bài 3 dialogue from practice bank
export function parseLessonDialogues(): Dialogue[] {
  const content = readFile("chinese-practice-bank.md");
  const dialogues: Dialogue[] = [];

  const regex = /### (Bài \d+ — Hội thoại[^\n]*)\n([\s\S]*?)(?=---|\n###|$)/g;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim();
    const lessonMatch = title.match(/Bài (\d+)/);
    const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : 0;

    const rows = parseMarkdownTable(match[2]);
    const lines: DialogueLine[] = rows
      .filter((r) => r["繁體"] && r["繁體"] !== "繁體")
      .map((r) => ({
        simplified: r["简体"] === "—" || r["简体"] === "" ? r["繁體"] : r["简体"],
        traditional: r["繁體"],
        pinyin: r["Pinyin"] ?? "",
        meaning: r["Nghĩa (Tiếng Việt)"] ?? "",
      }));

    if (lines.length === 0) continue;

    dialogues.push({
      id: `lesson-dialogue-bai${lessonNum}-${++idx}`,
      title,
      lesson: lessonNum,
      lines,
    });
  }

  return dialogues;
}
