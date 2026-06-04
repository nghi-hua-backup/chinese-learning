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
| `PhraseSession.tsx` | Phrase/sentence practice session; tracks `answerCorrect` state to display green/red feedback banner after `WritingInput` unmounts | `cards`, `scriptMode` |
| `DialogueSession.tsx` | Dialogue line-by-line practice | `dialogue`, `scriptMode`, `onComplete` |

---

## Writing Input Rules (`WritingInput.tsx`)

- Normalize before comparison: `trim()` + strip Unicode punctuation/symbols (`\p{P}\p{S}`) + `toLowerCase()`
- Accepts `expected` (active-script form) **or** `expectedAlt` (alternate script) as correct
- `lang="zh-Hans"` on textarea — hints iOS to offer Chinese keyboard
- `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}` — prevents iOS autocorrect interference
- Submit on Enter (without Shift) or tap "Kiểm tra" button
- No placeholder text — textarea is intentionally blank so it doesn't interfere with handwriting composition
- Font size: `text-7xl font-bold` for input, `text-8xl` for answer reveal character

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

## Tone-4 Highlighting System (FR-PF-2)

### `lib/tone-utils.ts`
Utilities for tone detection and text segmentation:
- `hasTone4(compound: string)` — returns true if the compound contains a grave-accent vowel (`[àèìòùǜ]`)
- `hasNeutralTone(compound: string)` — returns true if the compound has a vowel sequence with no tone mark (neutral tone syllable)
- `countSyllables(compound: string)` — counts vowel groups in a pinyin compound; one vowel group = one syllable (reliable for standard pinyin)
- `analyzeText(chars: string, pinyin: string): Segment[]` — strips punctuation from `chars`, splits `pinyin` by spaces, maps each compound to a character slice by syllable count; returns `{ chars, pinyin, highlight }[]`

### `components/ToneHighlight.tsx`
Renders a Chinese character string and its pinyin with compound-level light blue highlighting:
- Props: `chars: string`, `pinyin: string`, `charClassName?: string`, `pinyinClassName?: string`
- Uses `analyzeText` to get segments; renders character spans and pinyin spans with `bg-blue-100 rounded px-0.5` on highlighted groups
- Punctuation stripped from alignment calculation but re-inserted for display

### `components/ToneCoachingPanel.tsx`
Static Vietnamese coaching panel, always visible in all practice screens:
- No props, no state — purely presentational
- Placed above the progress bar in `VocabSession`, `PhraseSession`, `DialogueSession`
- Also included in `MultipleChoice` (rendered by `VocabSession` in trắc-nghiệm mode)
- Displays two rules: T4+T1/2/3 and T4+T4

---

## Toast Notification Pattern

A reusable `components/Toast.tsx` client component handles auto-dismissing notifications:
- Props: `message: string`, `onDismiss: () => void`
- Positioned `fixed top-4 right-4 z-50` — overlays all content
- Auto-dismisses via `useEffect` + `setTimeout(3000 ms)`; cleanup on unmount
- Caller controls visibility via conditional render (`toastMessage !== null`) and clears state in `onDismiss`
- Toast state must be declared before any early `return` in the parent component (P8)

## Lesson Completion Badge

Computed entirely from Zustand SRS store at render time — no extra localStorage keys:
- `app/page.tsx` groups vocab card IDs by lesson number into `lessonCardIds: Record<number, string[]>` and passes to `Dashboard`
- `Dashboard.tsx` reads `cards: Record<string, CardProgress>` from `useProgressStore()`
- Badge shows when: every card in the lesson has `reps > 0` AND `scheduled_days >= 1` AND `new Date(due) - now < 7 days` (not overdue by more than 7 days)
- `cards[id] === undefined` means card never reviewed → treat as not completed
- Rendered as a small absolute-positioned green ✓ on the top-right corner of each lesson card (requires `relative` on the Link container)

---

## Known Pitfalls

| Pitfall | Detail |
|---|---|
| React hooks after early return | Crashes Safari silently. All hooks (`useMemo`, `useState`, `useEffect`) must appear before any `if (...) return` in a component. This has happened before in `MultipleChoice.tsx`. |
| basePath double-prefixing | `basePath` in `next.config.ts` is automatically applied by `<Link>`. Never add `/chinese-learning` to an href manually. |
| `—` sentinel in markdown | If simplified == traditional, the markdown uses `—` in the 简体 column. The parser must fall back to the 繁體 value in this case, not store `"—"` as the `simplified` field. |
| `kb.json` in knowledge-base/ | This is a historical stub (107 bytes). It is not referenced by the build pipeline. Do not delete it, but do not add to it either. |
| `chinese-learning/progress/` | Legacy directory from an earlier Notion/SM-2 design. Not used by the current build. `review-log.json` is empty. Do not delete. |
| Punctuation in stored phrases | `chinese-brain.md` and `chinese-practice-bank.md` phrases include full-width punctuation (！？。，). `normalize()` must strip `\p{P}\p{S}` before comparing or users who omit trailing punctuation will always get "Sai rồi". |
| Inline `<span>` border overlap at large font sizes | In `ToneHighlight`, highlighted spans are inline elements. At `text-6xl`/`text-8xl`, adjacent highlighted spans with `border` and minimal `mx-*` appear to visually collide. Fix: use `inline-block` + `mx-1` (≥4px margin) on the HL class so bordered boxes have visible space between them. Do not reduce below `mx-1`. |
