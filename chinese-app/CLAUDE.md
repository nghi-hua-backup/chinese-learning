# Chinese Learning App — Project Brain

This file is the single source of truth for the Chinese learning web app. All future enhancements, bug fixes, or refactors must be consistent with what is documented here, and this file must be kept up to date when anything changes.

---

## Purpose & Context

A personal Chinese learning web app for Nghi Hua, designed to be used on an **iPad with Apple Pencil**. The primary workflow is writing Chinese characters by hand using the iOS native handwriting keyboard (手写), which converts Apple Pencil strokes into text that the app then checks against the expected answer.

**Target user:** Single user (Nghi), no multi-user or auth requirements.
**Target device:** iPad (Safari/WebKit). Must be responsive and touch-friendly.
**Language of UI:** Vietnamese (all labels, buttons, messages in Vietnamese).

---

## Repository Structure

```
chinese-learning/           ← public GitHub repo (nghi-hua-backup/chinese-learning)
├── chinese-app/            ← this Next.js app
│   └── CLAUDE.md           ← this file
├── chinese-learning/
│   └── knowledge-base/
│       ├── chinese-brain.md          ← vocab, grammar, common phrases
│       ├── chinese-practice-bank.md  ← practice sentences, dialogues
│       └── chinese-brain-guide.md    ← structure guide for the markdown files
└── .github/
    └── workflows/
        └── deploy.yml      ← GitHub Actions CI/CD
```

The knowledge base lives one level above the app (`../chinese-learning/knowledge-base/` relative to `chinese-app/`). Both folders share the same repo root.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| State management | Zustand + `persist` middleware | 5.x |
| SRS algorithm | ts-fsrs | 5.x |
| Markdown parsing | unified + remark-parse + remark-gfm | 11.x |
| Runtime | React | 19.x |

---

## Deployment

- **Hosting:** GitHub Pages (free, via public repo)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) — triggers on every push to `main`, builds `chinese-app/` and deploys `out/` to GitHub Pages
- **Live URL:** `https://nghi-hua-backup.github.io/chinese-learning/`
- **Build command (local):** `cd chinese-app && npm install && npm run build`
- **Output:** Static export (`output: "export"` in `next.config.ts`) — no server runtime needed

### Key `next.config.ts` settings

```typescript
output: "export"                        // static export, no Node server
basePath: "/chinese-learning"           // GitHub Pages serves from subdirectory
trailingSlash: true                     // generates /route/index.html for Pages routing
```

`basePath` is automatically prepended to all Next.js `<Link>` hrefs — do not manually prefix routes.

---

## Data Flow: Markdown → App

Knowledge base markdown files are parsed **at build time** (Next.js server components), not at runtime. The parsed data is embedded into the static HTML/JS output.

```
chinese-brain.md + chinese-practice-bank.md
        ↓  lib/parse-markdown.ts  (runs at build time)
        ↓  unified + remark-gfm
        ↓
  VocabCard[], PhraseCard[], PracticeCard[], Dialogue[]
        ↓  lib/data.ts  (cached via module-level variables)
        ↓
  Next.js Server Components (page.tsx files)
        ↓
  React Client Components + FSRS + localStorage
```

**Path resolution:** `lib/parse-markdown.ts` uses:
```typescript
const KB_PATH = path.join(process.cwd(), "..", "chinese-learning", "knowledge-base");
```
During the GitHub Actions build, `working-directory: chinese-app` makes `process.cwd()` = `<repo-root>/chinese-app`, so `../chinese-learning/knowledge-base` resolves correctly.

**To add new content:** Edit the markdown files in `chinese-learning/knowledge-base/`, push to `main` → GitHub Actions rebuilds and redeploys automatically.

---

## Data Types (`lib/types.ts`)

```typescript
VocabCard       id, lesson, lessonTitle, simplified, traditional, pinyin, hanViet, wordType, meaning
PhraseCard      id, category, simplified, traditional, pinyin, meaning
PracticeCard    id, lesson, simplified, traditional, pinyin, meaning
GrammarPattern  id, name, structure, explanation, examples[]
DialogueLine    simplified, traditional, pinyin, meaning, speaker?
Dialogue        id, title, lesson, lines[]
CardProgress    cardId, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review
ReviewRating    1 | 2 | 3 | 4   (Again / Hard / Good / Easy)
PracticeMode    "trac-nghiem" | "luyen-viet"
```

### Simplified vs Traditional

Every card carries both `simplified` and `traditional` fields. Display rules:
- When showing a character as the answer, display as `simplified/traditional` (e.g. `难/難`) when both differ; show just one when they are the same.
- Writing practice (`WritingInput`) accepts **either** form as a correct answer. Pass `expected={card.traditional}` and `expectedAlt={card.simplified}` (when they differ) to `WritingInput`.

---

## FSRS Spaced Repetition (`lib/srs.ts`, `lib/progress-store.ts`)

Algorithm: **FSRS** (Free Spaced Repetition Scheduler) via `ts-fsrs`. More accurate than SM-2.

**Rating scale shown to user after each card:**
- 1 — Lại (Again) — complete blank
- 2 — Khó (Hard) — recalled with effort
- 3 — Tốt (Good) — recalled correctly
- 4 — Dễ (Easy) — recalled instantly

**Progress persistence:** Zustand store persisted to `localStorage` under key `chinese-srs-progress`. Single-device only (iPad). No server sync.

**Auto-rating:** Multiple choice (`trac-nghiem`) auto-rates — correct → Good (3), wrong → Again (1) — after a 1.4 s delay. Writing (`luyen-viet`) requires the user to manually rate via `SRSRating`.

**Due logic:** New cards (never reviewed) are always due. Reviewed cards are due when `new Date(progress.due) <= new Date()`.

---

## Pages & Routing

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` + `components/Dashboard.tsx` | Home: streak, due count, lesson overview |
| `/tu-vung` | `app/tu-vung/` | Vocabulary practice |
| `/mau-cau` | `app/mau-cau/` | Common phrases + lesson practice sentences |
| `/hoi-thoai` | `app/hoi-thoai/` | Dialogue practice by situation |
| `/tien-do` | `app/tien-do/` | Progress overview |

Each page is split into a **server component** (`page.tsx` — parses markdown, no client state) and a **client component** (`*Client.tsx` — handles interaction, SRS, UI state).

---

## Components

| Component | Purpose |
|---|---|
| `NavBar.tsx` | Bottom navigation bar (iPad thumb-friendly) |
| `Dashboard.tsx` | Home screen: streak, due count, lesson links |
| `VocabSession.tsx` | Vocabulary flashcard session — card queue, progress, mode switching |
| `MultipleChoice.tsx` | 4-option multiple choice for `trac-nghiem` mode |
| `WritingInput.tsx` | Textarea for handwriting input + correct/wrong feedback |
| `SRSRating.tsx` | 4-button rating bar (Lại / Khó / Tốt / Dễ) shown after writing |
| `PhraseSession.tsx` | Phrase/sentence practice session |
| `DialogueSession.tsx` | Dialogue line-by-line practice; shows `simplified/traditional` in chat history, current system turn, and answer reveal; placeholder clears on textarea focus |

---

## Practice Modes

### Từ vựng (Vocabulary) — `/tu-vung`

1. User selects lesson filter (or "Tất cả") and practice mode.
2. FSRS selects due cards from the filtered set.
3. Each card shows the **Vietnamese meaning** as the question.

**Trắc nghiệm mode:**
- 4 multiple-choice options (1 correct + 3 distractors of the same word type).
- Auto-rates after selection (correct = Good, wrong = Again) with 1.4 s delay.

**Luyện viết mode:**
- Large `<textarea>` for Apple Pencil handwriting input.
- Accepts both simplified and traditional as correct.
- After submission: shows green `✓ Chính xác!` or red `✗ Sai rồi` banner, then reveals the answer card with `simplified/traditional`, pinyin, meaning.
- User manually rates with `SRSRating`.

### Mẫu câu (Phrases & Sentences) — `/mau-cau`

Two tabs:
- **Câu thông dụng** — common everyday phrases from `§6` of `chinese-brain.md`
- **Câu luyện tập** — practice sentences from `chinese-practice-bank.md`, filterable by lesson

Practice uses `PhraseSession` (writing mode, self-assess).

### Hội thoại (Dialogues) — `/hoi-thoai`

Situation-based dialogues from `chinese-practice-bank.md`. User reads each line, reveals translation, then rates. No auto-check (self-assess only).

### Tiến độ (Progress) — `/tien-do`

Overview of total cards, learned, due today, streak. Reads from the Zustand/localStorage store.

Upcoming review list displays cards by their character label (`simplified/traditional` format, e.g. `难/難`) rather than raw IDs.

Includes a **reset progress** button (red, at the bottom of the page) with a two-step confirmation dialog. Confirming calls `resetAll()` on the Zustand store, which clears all card history, streak, and last-study date.

---

## Writing Input Rules (`WritingInput.tsx`)

- Normalization before comparison: `trim()` + collapse whitespace + `toLowerCase()`
- Accepts either `expected` or `expectedAlt` (for simplified/traditional flexibility)
- `lang="zh-Hans"` on the textarea — hints iOS to offer Chinese keyboard
- `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}` to prevent iOS autocorrect interference
- Submit on Enter key (without Shift) or tap "Kiểm tra" button
- Placeholder clears on focus so it doesn't obscure handwriting composition
- Font size: `text-5xl` (large characters improve readability and handwriting recognition)

---

## Markdown Parsing Rules (`lib/parse-markdown.ts`)

- **Vocab** — from `§2 Từ vựng` in `chinese-brain.md`, split by `### Bài N` headers. Columns: `繁體 | 简体 | Pinyin | Hán Việt | Từ loại | Nghĩa (Tiếng Việt)`
- **Phrases** — from `§6 Câu thông dụng` in `chinese-brain.md`, grouped by `###` category. Columns: `繁體 | 简体 | Pinyin | Nghĩa`
- **Grammar** — from `§5 Ngữ pháp` in `chinese-brain.md`, blocks with `**Cấu trúc:**` / `**Giải thích:**` / bullet examples
- **Practice sentences** — from `chinese-practice-bank.md`, split by `### Bài N` headers, same columns as vocab
- **Dialogues** — from `#### Tình huống N` blocks within `### Cập nhật sau Bài N` sections

If `简体` is `"—"` or empty, `simplified` falls back to the `繁體` value.

---

## Known Constraints & Decisions

| Decision | Reason |
|---|---|
| Static export (no server) | GitHub Pages does not support a Node.js server runtime |
| `localStorage` only, no sync | Single-device use (iPad); no backend complexity needed |
| No OCR — use iOS native handwriting | iOS handwriting keyboard (手写) is accurate and free; no library needed |
| `basePath: '/chinese-learning'` | GitHub Pages serves from a subdirectory, not the root |
| Public repo `nghi-hua-backup/chinese-learning` | GitHub Pages requires a public repo on the free plan |
| `personal-development` repo stays private | Contains unrelated private content (career/, french-learning/) |
| Vietnamese UI language | The learner is Vietnamese; Chinese is the language being learned |
| Both simplified and traditional stored per card | Lessons use traditional, but the learner may write in simplified |

---

## Pending / Future Enhancements

- **Audio pronunciation** — Web Speech API (`speechSynthesis`) to read words/sentences aloud on demand. A 🔊 button per card; `utterance.lang = "zh-CN"`. Simple, no backend or API key needed. Not yet implemented.

---

## How to Run Locally

```bash
cd chinese-app
npm install
npm run dev     # dev server at http://localhost:3000/chinese-learning
npm run build   # static export → out/
```
