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
PracticeMode    "trac-nghiem" | "luyen-viet"
ScriptMode      "traditional" | "simplified"
// ReviewRating removed — binary Right/Wrong system always uses Good (3) internally
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

**Rating:** Always `Rating.Good (3)` — the 4-level scale (Again/Hard/Good/Easy) is no longer exposed. `ReviewRating` type has been removed from `types.ts`. `progress-store.reviewCard(cardId)` takes no rating parameter and always calls FSRS with Good (3), guaranteeing a next review interval ≥ 1 day in all card states.

**Binary Right/Wrong session model (FR-12):**
- **Right** → `reviewCard(cardId)` called, card removed from session queue, FSRS schedules next review ≥ 1 day.
- **Wrong** → card moved to end of session queue, FSRS NOT called. Card remains due (due date unchanged) — if session is exited, it re-appears in the Ôn tập lobby.
- Session ends when queue is empty (all cards resolved as Right).

**Zustand store** (persisted to `localStorage` key `chinese-srs-progress`):
- `cards: Record<string, CardProgress>` — per-card SRS state
- `scriptMode: ScriptMode` — current display mode (default: `"traditional"`)
- `completedDialogues: string[]` — list of completed dialogue IDs

**Key functions:**
- `isDue(progress)` — returns true if `new Date(progress.due) <= new Date()`
- `getOverdueReviewedCards(cardIds)` — returns only cards with `reps > 0` that are currently due (excludes new cards); used by Ôn tập flow
- `reviewCard(cardId)` — always applies Good (3); updates card in store; updates streak
- `markDialogueDone(id)` — appends dialogue ID (idempotent)
- `resetAll()` — clears all card history, streak, and last-study date

**Due logic:** New cards (never reviewed, `reps === 0`) are always due. Reviewed cards are due when `new Date(progress.due) <= new Date()`.

---

## Pages & Routing

| Route | Server component | Client component | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` | `components/Dashboard.tsx` | Home: streak, due count, lesson overview |
| `/tu-vung` | `app/tu-vung/page.tsx` | `app/tu-vung/TuVungClient.tsx` | Vocabulary practice |
| `/mau-cau` | `app/mau-cau/page.tsx` | `app/mau-cau/MauCauClient.tsx` | Phrases + practice sentences |
| `/hoi-thoai` | `app/hoi-thoai/page.tsx` | `app/hoi-thoai/HoiThoaiClient.tsx` | Dialogue practice |
| `/ngu-phap` | `app/ngu-phap/page.tsx` | `app/ngu-phap/NguPhapClient.tsx` | Grammar recognition practice |
| `/tien-do` | `app/tien-do/page.tsx` | `app/tien-do/TienDoClient.tsx` | Progress overview |

Pattern: server component parses markdown + passes data as props → client component handles interaction, SRS, UI state.

---

## Components

| Component | Purpose | Key props |
|---|---|---|
| `NavBar.tsx` | Bottom navigation bar | `active: string` |
| `Dashboard.tsx` | Home screen: streak, due count, lesson links | `vocabCards`, `progress` |
| `VocabSession.tsx` | Vocabulary flashcard session — mutable queue, binary Right/Wrong rating, mode switching. Right → FSRS + remove from queue. Wrong → move to end of queue (no FSRS). Session ends when queue is empty. | `cards`, `scriptMode`, `reviewOnly?`, `lesson?`, `onSessionComplete` |
| `MultipleChoice.tsx` | 4-option MCQ for trắc nghiệm mode | `card`, `allCards`, `scriptMode`, `onRate` |
| `WritingInput.tsx` | Textarea for handwriting input + feedback | `expected`, `expectedAlt?`, `onSubmit` |
| `SRSRating.tsx` | 4-button rating bar — **unused** since PF-2 (binary Right/Wrong). File retained but not rendered anywhere. | `onRate: (rating: number) => void` |
| `PhraseSession.tsx` | Phrase/sentence practice session; tracks `answerCorrect` state to display green/red feedback banner after `WritingInput` unmounts | `cards`, `scriptMode` |
| `DialogueSession.tsx` | Dialogue line-by-line practice | `dialogue`, `scriptMode`, `onComplete` |
| `GrammarSession.tsx` | Grammar recognition session — due-pattern queue, MCQ, SRS rating | `patterns`, `scriptMode`, `onSessionComplete` |

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

## Tone-4 Highlighting System (FR-6, FR-9)

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
- **Used in:** Luyện viết answer reveal (`VocabSession`, `PhraseSession`), Hội thoại (previous lines + system turn + KB answer on empty input) — **not** in Trắc nghiệm (`MultipleChoice`)

### `components/ToneCoachingPanel.tsx`
Static Vietnamese coaching panel — component exists but is **not rendered anywhere** (removed from all practice screens in FR-9):
- No props, no state — purely presentational
- Do not re-add to any practice screen without a new INTAKE agreement

### `lib/utils.ts` — `computeLCSDiff`
- `DiffChar = { char: string; matched: boolean }`
- `computeLCSDiff(input, expected): { inputChars: DiffChar[], expectedChars: DiffChar[] }`
- Standard O(n×m) LCS DP table with backtrack; assigns `matched: true` to characters that are part of the LCS
- Used in `DialogueSession.tsx` to render char-level diff after "Xem đáp án"

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
- `isLessonComplete(cardIds: string[], cards: Record<string, CardProgress>): boolean` lives in `lib/utils.ts` (shared by Dashboard and Từ vựng page)
- Badge shows when: every card has `reps > 0` AND not overdue by more than 7 days (`now - new Date(due) <= 7 days`)
- `cards[id] === undefined` means card never reviewed → treat as not completed
- Do NOT check `scheduled_days >= 1` — FSRS sets this to 0 after the first review until the card graduates to Review state (see pitfall below)
- Rendered as `absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold` on the container (requires `relative` on the container)
- **Dashboard:** `app/page.tsx` groups vocab card IDs by lesson → `lessonCardIds: Record<number, string[]>` passed as prop to `Dashboard.tsx`
- **Từ vựng page:** `TuVungClient.tsx` builds the same map via `useMemo` from `allCards`; "Tất cả" button passes `allCards.map(c => c.id)` to `isLessonComplete`

---

## Grammar Practice (FR-10)

### Route and components
- `app/ngu-phap/page.tsx` — server component; calls `getAllGrammar()` and passes `GrammarPattern[]` to client
- `app/ngu-phap/NguPhapClient.tsx` — mode selection screen; shows "Nhận diện" as the only mode + due-count stat
- `components/GrammarSession.tsx` — recognition session; manages due-pattern queue, card display, SRS rating

### SRS namespace
Grammar pattern IDs from `parseGrammar()` use the format `grammar-<slug>` (e.g., `grammar-太-hdt-了`). This prefix is distinct from all vocab card IDs (format: differs by lesson/word structure), so grammar progress safely coexists in the same `cards` map of `useProgressStore` with zero collision. No new store fields are needed — `reviewCard`, `getOrCreate`, and `getDueCards` all work with grammar IDs unchanged.

### Recognition card mechanics
Each session turn: pick one random example from `pattern.examples` → display `getDisplayChar(example, scriptMode)` + `example.pinyin` → generate 3 random distractors from the other 36 pattern names → show 4 shuffled choices. On pick: correct → `reviewCard(pattern.id, 3)` (Good), wrong → `reviewCard(pattern.id, 1)` (Again) → 1s feedback delay → next card. Empty queue → Toast + navigate back.

### Script mode for grammar examples
`GrammarExample` carries `simplified` and `traditional` fields. `getDisplayChar(example, scriptMode)` works directly (same shape as `VocabCard`).

---

## Ôn Tập — Due-Word Review (PF-3)

### Overview
Surfaces due reviewed vocabulary, provides a dedicated `/on-tap` review screen, and tracks in-progress sessions across page closes/crashes.

### Route and components
- `app/on-tap/page.tsx` — server component; calls `getAllVocab()`, wraps `OntapClient` in `<Suspense>` (required because `OntapClient` uses `useSearchParams()`)
- `app/on-tap/OntapClient.tsx` — client component; reads `?lesson=N` param; lesson filter buttons; flat due-word list; "Bắt đầu ôn" → mode selector → `VocabSession`

### Session tracking (progress-store.ts)
New Zustand state persisted to `chinese-srs-progress`:
- `activeSessions: Record<number, { cardIds: string[], startedAt: string }>` — keyed by lesson number (0 = "Tất cả", 1–N = specific lesson)
- `startSession(lesson: number, cardIds: string[])` — records the full card list at session start
- `completeSessionCard(lesson: number, cardId: string)` — removes one card from the active session
- `clearSession(lesson: number)` — removes the entry entirely on normal completion
- `getInProgressLessons(): number[]` — returns lesson keys with non-empty cardId arrays

### In-progress amber styling on home screen
- `TuVungClient` computes amber lesson set from `activeSessions`: for each active session entry, group its remaining `cardIds` by `VocabCard.lesson` (using an `allCards` lookup map) to get the set of affected lesson numbers.
- Lesson button style: `border-amber-400 bg-amber-50` when the lesson is in that set.
- A "Tất cả" (lesson=0) interrupted session distributes amber across individual lesson buttons, not the "Tất cả" button itself.

### Due-count badge positions (coexistence with green ✓)
- Green ✓ badge: `absolute -top-1.5 -right-1.5`
- Orange due-count badge: `absolute -bottom-1.5 -right-1.5`
- Both require `relative` on the button container.

### VocabSession integration
- `VocabSession` accepts an optional `lesson?: number` prop (defaults to `undefined` / not tracked when used from normal Từ vựng flow).
- On mount (`useEffect`): if `lesson !== undefined`, call `startSession(lesson, dueIds)`.
- After each card rating in `handleRate` / `handleResult` callback: if `lesson !== undefined`, call `completeSessionCard(lesson, card.id)`.
- On normal session completion (`onSessionComplete`): call `clearSession(lesson)` before invoking the callback.

---

## Grammar Reference HTML (FR-13)

Standalone reference file — entirely outside the Next.js app. No P1–P10 constraints apply.

- **Generator:** `scripts/generate-grammar-html.js` — Node.js, zero npm dependencies, run with `node scripts/generate-grammar-html.js` from the repo root
- **Output:** `chinese-learning/grammar-reference.html` — open locally in any browser; 51 patterns across 10 Nhóm as of 2026-06-19
- **Input:** `chinese-learning/knowledge-base/chinese-brain.md` §5 Ngữ pháp section (between `## 5.` and `## 6.` headings)
- **Parsing:** `#### ` → pattern; `**Cấu trúc[^:]*:**` → formula chips; `**Giải thích:**` first sentence → amber note; all `- Chinese /pinyin/ — Vietnamese` bullets → examples
- **Formula color mapping:** `CN` → purple; `了`/`的`/`吗`/`吧` → blue particle; `HDT`/`HĐT` → gold/brown; `DT`/`TN` → green; `ĐT` → teal; pure Chinese chars → red key; anything else → neutral
- **Key char sizing:** `data-len` attribute on `.key-char`; CSS `[data-len="3"]` → 42px, `[data-len="4"]` → 34px, ≥5 → 26px
- **Auto-sync:** invoked in Bước 8 of `/kb-update` (and `/lesson` which follows the same steps); the generated HTML is `git add`ed and committed in the same KB commit
- **SVG arrows:** drawn at runtime via `getBoundingClientRect()` in inline `<script>`; redrawn on `load` + `resize`; unique `markerId` per card avoids SVG `id` collisions

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
| FSRS `scheduled_days` is 0 after first review | After a new card is first reviewed (even rated Good), FSRS puts it in **Learning** state with `scheduled_days = 0` — the next review is in minutes, not days. `scheduled_days >= 1` is only true once a card graduates to **Review** state (after passing the Learning phase). Do not use `scheduled_days >= 1` as a proxy for "has been practiced" — use `reps > 0` instead. |
| Ôn tập session card list must be frozen at start | `OntapClient.dueCards` is a `useMemo` that depends on the Zustand `cards` store. When `reviewCard()` is called during a session, the store updates → `dueCards` shrinks → the new smaller array is passed as the `cards` prop to `VocabSession` → `VocabSession.dueCards` also shrinks → `index` goes out of bounds → `card` is `undefined` → TypeError crash. Fix: snapshot `[...dueCards]` into `frozenSessionCards` state when the session starts; always pass `frozenSessionCards` (not the live `dueCards`) to `VocabSession`. |
| WritingInput key must include attempt counter | `WritingInput` uses internal `submitted` state to hide the "Kiểm tra" button after submission. When a Wrong card re-queues to position 0 in the same session, `key={card.id}` is unchanged — React preserves the old component instance with `submitted=true`, leaving the button permanently hidden. Fix: `VocabSession` has an `attempt` counter that increments on every `markWrong()`; `WritingInput` key is `` `${card.id}-${attempt}` `` so re-queued cards always get a fresh component. |
