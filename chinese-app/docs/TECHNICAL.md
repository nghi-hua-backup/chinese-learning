# Technical Reference

Developer reference for implementation detail. Read this after `PRINCIPLES.md`. Update the relevant section after every code change.

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

- **Host:** GitHub Pages (public repo `nghi-hua-backup/chinese-learning`)
- **CI/CD:** `.github/workflows/deploy.yml` — triggers on push to `main`, builds `chinese-app/`, deploys `out/` to Pages
- **Live URL:** `https://nghi-hua-backup.github.io/chinese-learning/`
- **Local build:** `cd chinese-app && npm install && npm run build`
- **Local dev:** `cd chinese-app && npm run dev` → `http://localhost:3000/chinese-learning`

### Key `next.config.ts` settings

| Setting | Value | Reason |
|---|---|---|
| `output` | `"export"` | Static export, no Node server |
| `basePath` | `"/chinese-learning"` | GitHub Pages subdirectory |
| `trailingSlash` | `true` | Generates `/route/index.html` for Pages routing |
| `outputFileTracingIncludes` | `../chinese-learning/knowledge-base/**` | Includes KB markdown in build trace |

---

## Data Flow: Markdown → App

```
chinese-brain.md + chinese-practice-bank.md
        ↓  lib/parse-markdown.ts  (runs at build time in server components)
        ↓  unified + remark-gfm
        ↓
  VocabCard[], PhraseCard[], PracticeCard[], GrammarPattern[], Dialogue[]
        ↓  lib/data.ts  (cached via module-level variables)
        ↓
  Next.js Server Components (page.tsx files — no client state)
        ↓
  React Client Components (*Client.tsx) + Zustand/localStorage
```

**Path resolution:** `lib/parse-markdown.ts` uses:
```typescript
const KB_PATH = path.join(process.cwd(), "..", "chinese-learning", "knowledge-base");
```
During GitHub Actions build, `working-directory: chinese-app` makes `process.cwd()` = `<repo-root>/chinese-app`, so `../chinese-learning/knowledge-base` resolves correctly.

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
ScriptMode      "traditional" | "simplified"
```

---

## Script Mode Contract

- Every card carries both `simplified` and `traditional` fields
- `getDisplayChar(card, scriptMode)` in `lib/utils.ts` is the **only** access point for displaying a character — always use this, never access `card.simplified` or `card.traditional` directly in components
- `WritingInput` passes `expected={getDisplayChar(card, scriptMode)}` and `expectedAlt` as the alternate form (accepts both as correct)
- If `简体` is `"—"` or empty in the markdown, `simplified` falls back to the `traditional` value (handled in `parse-markdown.ts`)

---

## FSRS Spaced Repetition (`lib/srs.ts`, `lib/progress-store.ts`)

**Algorithm:** FSRS via `ts-fsrs` (more accurate than SM-2)

**Rating scale:**
- 1 — Lại (Again) — complete blank
- 2 — Khó (Hard) — recalled with effort
- 3 — Tốt (Good) — recalled correctly
- 4 — Dễ (Easy) — recalled instantly

**Zustand store** (persisted to `localStorage` key `chinese-srs-progress`):
- `cards: Record<string, CardProgress>` — per-card SRS state
- `scriptMode: ScriptMode` — current display mode (default: `"traditional"`)
- `completedDialogues: string[]` — list of completed dialogue IDs

**Key functions:**
- `isDue(progress)` — returns true if `new Date(progress.due) <= new Date()`
- `getOverdueReviewedCards(cardIds)` — returns only cards with `reps > 0` that are currently due (excludes new cards); used by Ôn ngay flow
- `markDialogueDone(id)` — appends dialogue ID (idempotent)
- `resetAll()` — clears all card history, streak, and last-study date

**Auto-rating:** Multiple choice auto-rates — correct → Good (3), wrong → Again (1) — after 1.4s delay. Writing mode requires manual rating via `SRSRating`.

**Due logic:** New cards (never reviewed, `reps === 0`) are always due. Reviewed cards are due when `new Date(progress.due) <= new Date()`.

---

## Pages & Routing

| Route | Server component | Client component | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` | `components/Dashboard.tsx` | Home: streak, due count, lesson overview |
| `/tu-vung` | `app/tu-vung/page.tsx` | `app/tu-vung/TuVungClient.tsx` | Vocabulary practice |
| `/mau-cau` | `app/mau-cau/page.tsx` | `app/mau-cau/MauCauClient.tsx` | Phrases + practice sentences |
| `/hoi-thoai` | `app/hoi-thoai/page.tsx` | `app/hoi-thoai/HoiThoaiClient.tsx` | Dialogue practice |
| `/tien-do` | `app/tien-do/page.tsx` | `app/tien-do/TienDoClient.tsx` | Progress overview |

Pattern: server component parses markdown + passes data as props → client component handles interaction, SRS, UI state.

---

## Components

| Component | Purpose | Key props |
|---|---|---|
| `NavBar.tsx` | Bottom navigation bar | `active: string` |
| `Dashboard.tsx` | Home screen: streak, due count, lesson links | `vocabCards`, `progress` |
| `VocabSession.tsx` | Vocabulary flashcard session — card queue, mode switching | `cards`, `scriptMode`, `reviewOnly?` |
| `MultipleChoice.tsx` | 4-option MCQ for trắc nghiệm mode | `card`, `allCards`, `scriptMode`, `onRate` |
| `WritingInput.tsx` | Textarea for handwriting input + feedback | `expected`, `expectedAlt?`, `onSubmit` |
| `SRSRating.tsx` | 4-button rating bar (Lại/Khó/Tốt/Dễ) | `onRate: (rating: ReviewRating) => void` |
| `PhraseSession.tsx` | Phrase/sentence practice session | `cards`, `scriptMode` |
| `DialogueSession.tsx` | Dialogue line-by-line practice | `dialogue`, `scriptMode`, `onComplete` |

---

## Writing Input Rules (`WritingInput.tsx`)

- Normalize before comparison: `trim()` + collapse whitespace + `toLowerCase()`
- Accepts `expected` (active-script form) **or** `expectedAlt` (alternate script) as correct
- `lang="zh-Hans"` on textarea — hints iOS to offer Chinese keyboard
- `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}` — prevents iOS autocorrect interference
- Submit on Enter (without Shift) or tap "Kiểm tra" button
- Placeholder clears on focus (prevents obscuring handwriting composition)
- Font size: `text-5xl` for input, `text-8xl` for answer reveal character

---

## Markdown Parsing Rules (`lib/parse-markdown.ts`)

| Content type | Source file | Source section | Column order |
|---|---|---|---|
| Vocabulary | `chinese-brain.md` | `§2 Từ vựng` → `### Bài N` | `繁體 \| 简体 \| Pinyin \| Hán Việt \| Từ loại \| Nghĩa` |
| Common phrases | `chinese-brain.md` | `§6 Câu thông dụng` → `###` categories | `繁體 \| 简体 \| Pinyin \| Nghĩa` |
| Grammar patterns | `chinese-brain.md` | `§5 Ngữ pháp` | Blocks with `**Cấu trúc:**` / `**Giải thích:**` / bullet examples |
| Practice sentences | `chinese-practice-bank.md` | `### Bài N` | Same as vocab |
| Dialogues | `chinese-practice-bank.md` | `#### Tình huống N` within `### Cập nhật sau Bài N` | `简体 \| 繁體 \| Pinyin \| Nghĩa` |

If `简体` is `"—"` or empty → `simplified` falls back to `traditional` value.

---

## Known Pitfalls

| Pitfall | Detail |
|---|---|
| React hooks after early return | Crashes Safari silently. All hooks (`useMemo`, `useState`, `useEffect`) must appear before any `if (...) return` in a component. This has happened before in `MultipleChoice.tsx`. |
| basePath double-prefixing | `basePath` in `next.config.ts` is automatically applied by `<Link>`. Never add `/chinese-learning` to an href manually. |
| `—` sentinel in markdown | If simplified == traditional, the markdown uses `—` in the 简体 column. The parser must fall back to the 繁體 value in this case, not store `"—"` as the `simplified` field. |
| `kb.json` in knowledge-base/ | This is a historical stub (107 bytes). It is not referenced by the build pipeline. Do not delete it, but do not add to it either. |
| `chinese-learning/progress/` | Legacy directory from an earlier Notion/SM-2 design. Not used by the current build. `review-log.json` is empty. Do not delete. |
