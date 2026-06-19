## [2026-06-03] — Tone-4 Highlighting & Practice Coaching

**Status:** Agreement reached

### Problem
Thanh 4 (4th tone) is difficult to identify and pronounce correctly, especially in compound words and tone combinations. Users need visual cues to recognize tone-4 syllables and pronunciation coaching while practicing.

### Agreed scope
- In practice mode only: light blue background on both Chinese characters and pinyin for any syllable that is tone 4 or neutral tone
- Compound detection: each space-delimited pinyin word is one group — if any syllable in the group is T4 or neutral tone, the entire compound is highlighted as one block
- Separate compounds are highlighted as separate blocks (no merging across word boundaries)
- A coaching panel (top or left of all practice mode screens) permanently shows two Vietnamese rules:
  - "Thanh 4 + Thanh 1/2/3 → Rướn giọng đọc thanh 4"
  - "Thanh 4 + Thanh 4 → Thanh 4 sau đọc nhanh dứt khoát"
- Rules always show — no conditional logic based on card content
- Vietnamese language for all coaching text

### Out of scope (agreed)
- No highlighting outside practice mode (home, vocab browse, etc.)
- No per-card rule-triggering logic (panel is always visible)

### Acceptance criteria (draft)
- AC-1: In practice mode, any syllable with tone 4 mark (à, è, ì, ò, ù, ǜ) has a light blue background on both its Chinese character and pinyin
- AC-2: Neutral tone syllables (no tone mark) are also highlighted in light blue
- AC-3: Tone-4 (or neutral) syllables belonging to the same space-delimited pinyin word are highlighted as one contiguous block; different words are separate blocks
- AC-4: All practice mode screens display a permanent coaching panel (top or left position) with both rules in Vietnamese
- AC-5: The two rules are always visible regardless of what card is currently shown
- AC-6: No highlighting occurs outside of practice mode screens

### Technical notes
- Pinyin is always present and correctly marked in KB files — tone detection is reliable
- Compound grouping = space-delimited pinyin words
- Tone-4 detection: vowels with grave accent (à, è, ì, ò, ù, ǜ)
- Neutral tone detection: syllables with no tone mark

### Design notes
- Highlight color: light blue background
- Coaching panel: top or left of practice screen, styled as an information/inbound message bubble
- Both Chinese characters and their corresponding pinyin are highlighted together

### Open questions
- (none)

---

## [2026-06-03] — Amendment: Tone-4 Highlighting & Practice Coaching

**Amends:** Section "[2026-06-03] — Tone-4 Highlighting & Practice Coaching"
**Specific changes:**

1. **Remove neutral tone highlighting (AC-2 revoked):** Original agreement highlighted neutral-tone syllables (no tone mark, e.g. `zi` in bāozi, `huan` in xǐhuan). Customer clarified that only tone-4 syllables should trigger a highlight. Neutral tones no longer cause a compound to be highlighted.

2. **Highlight style:** Add a visible border (`border border-blue-300`) and more padding (`px-1 py-0.5 mx-px`) so highlights are easier to spot and don't bleed into adjacent text.

3. **Coaching panel — first rule updated:** "Thanh 4 + Thanh 1/2/3" → "Thanh 4 + Thanh 0/1/2/3" to explicitly include the neutral tone in the pronunciation rule (even though neutral tone no longer triggers a highlight, T4 followed by T0 still has a specific pronunciation pattern).

**New agreement:**
- Highlighting triggers only when a compound contains at least one tone-4 syllable (grave accent vowel)
- Neutral tone syllables alone do not cause highlighting
- Coaching panel first rule reads: "Thanh 4 + Thanh 0/1/2/3 → Rướn giọng đọc thanh 4"

**Reason for change:** Visual feedback was too broad — 喜欢 (xǐhuan) and 包子 (bāozi) appeared highlighted due to neutral second syllables, diluting the signal. The user wants highlights to unambiguously flag tone-4 syllables only.

---

## [2026-06-04] — Session Completion UX + Lesson Progress Flag + Quiz Loading State

**Status:** Agreement reached

### Problem
The post-session completion screen is a dead end requiring manual action to continue. Lesson cards give no signal of practice progress. Quiz mode has a jarring jump between questions.

### Agreed scope
- **A — Session completion redirect + toast:**
  - On session end, skip the completion screen entirely and navigate to the same destination as "Quay lại"
  - A fly-out toast appears top-right showing "Hoàn thành phiên học! Đã ôn X từ.", stays 3 seconds then fades out
  - No close button on the toast
- **B — Lesson completion flag:**
  - A green checkmark badge appears on each lesson card when all cards in that lesson have SRS interval ≥ 1 day
  - The badge hides when any card in the lesson is overdue by more than 7 days
  - Flag is computed purely from SRS state — no separate "session completed" tracking; interrupted sessions count proportionally via SRS updates
  - New lesson, never practiced: no badge (0 cards at interval ≥ 1 day)
- **C — Quiz loading state:**
  - In Trắc nghiệm mode, show a centered inline spinner within the question card area while transitioning to the next question; the previous question content is not visible during this transition

### Out of scope (agreed)
- No "Học lại từ đầu" button (removed)
- No session-completion gate for the lesson flag
- No backend or cross-device sync (P2)

### Acceptance criteria (draft)
- AC-A1: After the last card in a practice session, the user is redirected to the destination of "Quay lại" — the completion screen is never shown
- AC-A2: A toast appears top-right with "Hoàn thành phiên học! Đã ôn X từ.", visible for 3 seconds, then fades — present on both flashcard and quiz modes
- AC-B1: A lesson card shows a green checkmark badge when every card in that lesson has SRS interval ≥ 1 day
- AC-B2: The badge hides when any card in the lesson is overdue by more than 7 days
- AC-B3: Badge state updates dynamically from localStorage SRS data — no full page reload required
- AC-C1: In Trắc nghiệm mode, a spinner is shown in the question area while the next question is being prepared; the previous question content is not visible during this transition

### Technical notes
- SRS interval data lives in localStorage — read at render time for badge computation
- Toast is a self-dismissing component (setTimeout 3 s)
- P8 applies: all hooks declared before conditional returns in any modified component

### Design notes
- Badge: small green checkmark on top-right of each lesson card (Vietnamese UI, P4)
- Toast: slides in top-right, fades out after 3 s, no close button
- Spinner: centered inline within the quiz card, not a full overlay

### Open questions
- (none)

---

## [2026-06-04] — Lesson Completion Badge on Từ vựng Page

**Status:** Agreement reached

### Problem
The Dashboard is rarely visited, so the existing lesson completion badge is rarely seen. After finishing a practice session the user is returned to the Từ vựng page with no visual signal of which lessons are done or which to practice next.

### Agreed scope
- Show the same green ✓ badge (absolute circle, top-right corner) on each "Bài N" filter button and on the "Tất cả" button on the Từ vựng page
- "Bài N" badge: all cards in that lesson have SRS interval ≥ 1 day and no card is overdue by more than 7 days
- "Tất cả" badge: all cards across all lessons meet the same criteria (pass all card IDs to the same `isLessonComplete` function)
- Badge updates dynamically from localStorage — no page reload needed
- Extract `isLessonComplete` from `components/Dashboard.tsx` to `lib/utils.ts` so both Dashboard and Từ vựng share the same logic

### Out of scope (agreed)
- No badge on Mẫu câu or Hội thoại pages
- No change to Dashboard badge (already implemented and working)
- No change to completion logic or SRS rules

### Acceptance criteria (draft)
- AC-1: Each "Bài N" button on the Từ vựng page shows a green ✓ badge when all cards in that lesson have SRS interval ≥ 1 day and none are overdue by more than 7 days
- AC-2: The "Tất cả" button shows a green ✓ badge when all cards across all lessons meet the same criteria
- AC-3: A badge disappears when any relevant card becomes overdue by more than 7 days
- AC-4: Badges appear immediately after a session completes — no page reload required

### Technical notes
- `isLessonComplete(cardIds, cards)` already exists in Dashboard — extract to `lib/utils.ts`
- `TuVungClient` already imports `useProgressStore`; just needs `cards` destructured
- For "Tất cả": pass `allCards.map(c => c.id)` to `isLessonComplete`
- P8 applies: all hooks declared before any conditional returns

### Design notes
- Badge: identical to Dashboard — `absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold`
- Each filter button needs `relative` positioning to anchor the badge

### Open questions
- (none)

---

## [2026-06-04] — Amendment: Remove ToneCoachingPanel from all practice modes

**Amends:** Section "[2026-06-03] — Tone-4 Highlighting & Practice Coaching" (AC-4, AC-5)

**Specific change:** Original agreement required a permanent coaching panel showing two Vietnamese pronunciation rules to be displayed at the top of all practice mode screens (Flashcard, Trắc nghiệm, Hội thoại). Customer has changed their mind and wants this panel removed everywhere it currently appears.

**New agreement:** `<ToneCoachingPanel />` is removed from all practice screens. No coaching panel is shown in any practice mode. The component may be kept in the codebase but must not be rendered.

**Reason for change:** Customer changed their mind — deliberate reversal of the original agreement.

---

## [2026-06-04] — Amendment: Remove ToneHighlight from Trắc nghiệm only

**Amends:** Section "[2026-06-03] — Tone-4 Highlighting & Practice Coaching" (AC-1, AC-3) — scope narrowed for Trắc nghiệm

**Specific change:** Original agreement applied tone-4 highlighting to all practice mode screens. Customer now wants tone-4 highlighting removed from Trắc nghiệm (quiz/multiple-choice) mode only. Highlighting remains in Flashcard and Hội thoại.

**New agreement:**
- Tone-4 highlighting (`ToneHighlight` component) is **removed** from Trắc nghiệm
- Tone-4 highlighting **remains** in Flashcard and Hội thoại — no change to those screens

**Reason for change:** Customer wants the quiz experience to be cleaner and not give tone hints during self-testing.

---

## [2026-06-04] — Hội thoại Answer Diff

**Status:** Agreement reached

### Problem
When practicing Hội thoại (dialogue), after the user taps "Xem đáp án", the app shows the expected KB answer and the user's input side by side but gives no signal about whether they match or where they differ. The user must manually compare characters — this is slow and error-prone for Chinese characters.

### Agreed scope
- After tapping "Xem đáp án" in a user-turn line, compare the user's input against the KB expected answer (`getDisplayChar(line, scriptMode)`) at the **character level**
- **Exact match:** display a green "Chính xác! ✓" banner instead of the diff view
- **Mismatch:** show character-level diff using LCS (Longest Common Subsequence):
  - In the user's input row: characters that do not match (wrong or extra) are shown in **red**
  - In the KB answer row: characters that are missing from the user's input are shown in **green**; matched characters shown normally
- **Empty input:** no diff shown, no match banner — just show the KB answer as before
- Both the user input row and the KB answer row are always shown when `showAnswer = true` and input is non-empty

### Out of scope (agreed)
- No diff in Flashcard or Trắc nghiệm modes
- No pinyin-level diff — character level only
- No whitespace or punctuation normalization (exact character comparison)
- No changes to the "Tiếp →" / "Hoàn thành hội thoại" flow

### Acceptance criteria (draft)
- AC-1: When user's input exactly matches the KB answer, a green "Chính xác! ✓" banner is shown instead of the diff
- AC-2: When input differs from KB answer, the user's input is rendered character-by-character with mismatched/extra characters highlighted in red
- AC-3: When input differs from KB answer, the KB answer is rendered character-by-character with characters missing from the user's input highlighted in green; matched characters shown normally
- AC-4: When input is empty and user taps "Xem đáp án", no diff and no match banner are shown — KB answer block renders as before
- AC-5: Diff is computed at character level using LCS algorithm

### Technical notes
- Expected answer: `getDisplayChar(line, scriptMode)` — always a single string, no ambiguity
- Trigger: `handleCheck()` / "Xem đáp án" button in `DialogueSession.tsx`
- LCS helper function added to `lib/utils.ts`; diff rendering logic in `DialogueSession.tsx`
- Only `DialogueSession.tsx` and `lib/utils.ts` need changes

### Design notes
- Match banner: green background, white text, "Chính xác! ✓", full width, rendered above the "Tiếp →" button
- Diff characters: inline `<span>` elements; red = `text-red-600` (wrong/extra in user input), green = `text-green-600` (missing in KB answer)
- KB answer block and user input block retain existing visual styling

### Open questions
- (none)

---

## [2026-06-07] — Grammar Recognition Practice (Ngữ pháp Tab v1)

**Status:** Agreement reached

### Problem
Grammar patterns learned in each lesson are never surfaced again after the lesson ends. There is no dedicated practice mode for grammar — only vocabulary, quiz, and dialogue are available. Without re-surfacing, patterns are gradually forgotten.

### Agreed scope
- Add a new **"Ngữ pháp"** tab in the main navigation (alongside Từ vựng, Mẫu câu, Hội thoại)
- The tab shows a mode selection screen with one mode: **Nhận diện (Recognition)**
- Recognition session: app shows a Chinese example sentence → user picks the correct grammar pattern name from 4 multiple-choice options (1 correct + 3 random distractors from other patterns)
- After answering: feedback shown (correct/wrong), correct pattern name + Vietnamese explanation revealed
- All 37 patterns practiced together — no per-lesson filtering
- SRS (FSRS) tracks grammar progress per pattern, in a separate namespace from vocabulary SRS, stored in the same Zustand + localStorage store
- Script mode (simplified/traditional) follows the user's existing setting
- Session completion uses the existing toast + auto-redirect UX

### Out of scope (agreed — future versions)
- Fill-in-the-blank mode
- Translation drill mode
- Per-lesson filtering for grammar

### Acceptance criteria (draft)
- AC-1: "Ngữ pháp" tab appears in the main navigation alongside existing tabs
- AC-2: Ngữ pháp tab shows a mode selection screen with "Nhận diện" as the only available mode
- AC-3: Recognition session surfaces grammar pattern cards ordered by SRS schedule (due cards first), drawing from all 37 patterns with no lesson filter
- AC-4: Each card shows one Chinese example sentence and 4 multiple-choice options for the grammar pattern name (1 correct + 3 random distractors)
- AC-5: After picking, the app shows correct/wrong feedback and reveals the correct pattern name and its Vietnamese explanation
- AC-6: Grammar SRS progress is tracked per pattern in localStorage under a separate key namespace from vocabulary (e.g., `grammar:<pattern-slug>`), using the same FSRS mechanism
- AC-7: Session completion triggers the existing "Hoàn thành phiên học!" toast + auto-redirect UX
- AC-8: Example sentences in grammar cards respect the user's current script mode (simplified/traditional)

### Technical notes
- Source data: § 5 Ngữ pháp in `chinese-brain.md` — 37 patterns, each with a named structure, Vietnamese explanation, and 3–5 example sentences
- Grammar SRS keys: pattern-slug format (e.g., `grammar:太_HDT_了`) — separate from vocab card IDs
- Distractors: 3 randomly selected pattern names from the remaining 36 patterns
- No new KB authoring required — existing example sentences are sufficient

### Design notes
- New tab: "Ngữ pháp" added to the main nav bar
- Mode selection screen follows the same pattern as Từ vựng (which offers Flashcard / Trắc nghiệm / Hội thoại)
- Card UI: multiple-choice style consistent with Trắc nghiệm

### Open questions
- (none)

---

## [2026-06-14] — Simplify to Từ vựng-Only

**Status:** Agreement reached

### Problem
Multiple tabs (Từ vựng, Mẫu câu, Hội thoại, Ngữ pháp, Tổng quan) create an overwhelming practice experience. The SRS becomes messy and hard to understand when tracking multiple content types simultaneously.

### Agreed scope
- Remove Mẫu câu, Hội thoại, Ngữ pháp, and Tổng quan (Dashboard) tabs and all their routes entirely
- Remove the navigation bar entirely from all screens
- App lands directly on the Từ vựng lesson selection screen (no separate home screen, no nav)
- Keep both existing Từ vựng practice modes unchanged: **Trắc nghiệm** (multiple choice) and **Writing** (existing handwriting-input mode — user writes with Apple Pencil, system checks correctness)
- Traditional/simplified script toggle remains as-is (global, no change)
- Remove tone-4 highlighting from the Writing mode — tone-4 highlighting is now absent from all screens app-wide
- On first load after update: silently wipe all grammar SRS keys (`grammar:*`) and dialogue SRS keys from localStorage; SRS schedule surfaces only Từ vựng vocabulary cards going forward

### Out of scope (agreed)
- No changes to Trắc nghiệm or Writing mode functionality or UI (beyond removing tone-4 highlight from Writing)
- No new handwriting recognition — existing mechanism unchanged
- No changes to lesson filter buttons, completion badges (on Từ vựng filter buttons), or existing Từ vựng page layout

### Acceptance criteria (draft)
- AC-1: App root loads directly to the Từ vựng lesson selection screen — no nav bar on any screen
- AC-2: No Mẫu câu, Hội thoại, Ngữ pháp, or Tổng quan routes or UI elements exist anywhere in the app
- AC-3: Trắc nghiệm and Writing modes remain fully functional and unchanged (except tone-4 highlight removed from Writing)
- AC-4: Tone-4 highlighting is absent from all screens in the app
- AC-5: On first load after update, all `grammar:*` and dialogue SRS keys are silently wiped from localStorage
- AC-6: SRS schedule surfaces only Từ vựng vocabulary cards
- AC-7: Session completion toast ("Hoàn thành phiên học! Đã ôn X từ.") and auto-redirect remain in effect for both modes (Part A)
- AC-8: Trắc nghiệm transition spinner remains in effect (Part C)

### Technical notes
- Remove tab/nav component from layout
- Remove page routes: Mẫu câu, Hội thoại, Ngữ pháp, Tổng quan (Dashboard)
- Update app root to render Từ vựng directly
- One-time localStorage migration on init: clear `grammar:*` keys and dialogue SRS keys (exact dialogue key prefix to be confirmed by Dev reading the store)
- Remove `ToneHighlight` component from Writing mode

### Design notes
- Existing Từ vựng page layout (lesson filters, completion badges on filter buttons, mode selection) unchanged
- Existing Writing and Trắc nghiệm UI unchanged except tone-4 highlight removal

### Open questions
- Exact localStorage key prefix for dialogue SRS data — to be confirmed by Dev reading the store

---

## [2026-06-14] — Amendment: Grammar Recognition Practice voided

**Amends:** Section "[2026-06-07] — Grammar Recognition Practice (Ngữ pháp Tab v1)"
**Specific change:** The entire Ngữ pháp tab and all its routes, UI, and SRS data are removed as part of the Từ vựng-only refactor.
**New agreement:** Feature is voided. Grammar SRS data (`grammar:*` keys) is wiped from localStorage on first load after the update.
**Reason for change:** App simplified to Từ vựng-only — all other tabs removed.

---

## [2026-06-14] — Amendment: Hội thoại Answer Diff voided

**Amends:** Section "[2026-06-04] — Hội thoại Answer Diff"
**Specific change:** The entire Hội thoại tab and all its routes and UI are removed as part of the Từ vựng-only refactor.
**New agreement:** Feature is voided. Dialogue SRS data is wiped from localStorage on first load after the update.
**Reason for change:** App simplified to Từ vựng-only — all other tabs removed.

---

## [2026-06-14] — Amendment: Tone-4 Highlighting completely removed

**Amends:** Section "[2026-06-03] — Tone-4 Highlighting & Practice Coaching" and all subsequent amendments
**Specific change:** Previous amendments had removed tone-4 highlighting from Trắc nghiệm only, leaving it in Flashcard (Writing) and Hội thoại. Hội thoại is now removed entirely. Tone-4 highlighting is now also removed from the Writing mode.
**New agreement:** Tone-4 highlighting (`ToneHighlight` component) is removed from all screens in the app. The feature is fully voided.
**Reason for change:** App simplified to Từ vựng-only; customer wants a cleaner practice experience without tone hints.

---

## [2026-06-14] — Amendment: Session Completion UX — Part B voided (Dashboard removed)

**Amends:** Section "[2026-06-04] — Session Completion UX + Lesson Progress Flag + Quiz Loading State" — Part B only
**Specific change:** Part B specified a green checkmark badge on each lesson card on the Dashboard. The Dashboard (Tổng quan) is now removed entirely.
**New agreement:** Part B is voided. Parts A (session completion toast + auto-redirect) and C (Trắc nghiệm transition spinner) remain fully in effect.
**Reason for change:** Dashboard removed as part of the Từ vựng-only refactor.

---

## [2026-06-15] — SRS Enhancement: Ôn Tập (Due-Word Review)

**Status:** Agreement reached

### Problem
After the Từ vựng-only simplification, users have no visibility into which words the SRS algorithm has scheduled for re-practice. There is no dedicated flow to review only the words that are due today, and no way to resume an interrupted practice session.

### Agreed scope

**1. Due-count badges on lesson buttons (TuVungClient home screen)**
- Each lesson button ("Tất cả" + "Bài N") shows an orange badge with the count of **reviewed words that are due for re-practice** (i.e. `getOverdueReviewedCards` — reps > 0 and isDue).
- Badge coexists with the existing green ✓ badge; they appear simultaneously at different positions on the same button.
- Badge is hidden when count = 0.

**2. "Ôn tập" button on the home screen**
- A dedicated button at the top of TuVungClient navigates to `/on-tap`.
- Tapping a lesson button (or its orange badge area) can also open `/on-tap?lesson=N` pre-filtered to that lesson.

**3. Ôn tập screen (`/on-tap` route)**
- Layout matches TuVungClient: lesson filter buttons ("Tất cả" + "Bài N") at top.
- Below the filter: a flat list of due reviewed words for the selected lesson — each row shows the Chinese character + Vietnamese meaning (minimal, no pinyin, no word type).
- A "Bắt đầu ôn" button below the list opens the mode selector, then launches VocabSession with only those due reviewed cards.
- Empty state: simple Vietnamese message if no words are due (e.g. "Không có từ nào cần ôn hôm nay.").
- Uses `useSearchParams()` + `<Suspense>` (P1 static export requirement).

**4. In-progress / resume tracking**
- When a session is interrupted (closed, crashed, or left mid-session), the remaining card IDs are persisted in the Zustand store under a per-lesson key (0 = "Tất cả", 1–N = specific lesson).
- VocabSession calls `startSession` on mount, `completeSessionCard` after each card is rated, and `clearSession` on normal completion.
- On the home screen, lesson buttons for lessons with remaining in-progress cards turn amber: `border-amber-400 bg-amber-50`.
- If a "Tất cả" (lesson=0) session is interrupted, the amber style appears on each individual lesson button that still has remaining cards (not just the "Tất cả" button), using the `VocabCard.lesson` field to group remaining cards by lesson.
- Normal session completion clears the in-progress state for that lesson.

### Out of scope (agreed)
- New/unseen words are not included in the Ôn tập due list (only reviewed words that are due).
- No audio, no pinyin in the word list rows.
- No explicit "Resume" screen or separate route — in-progress is surfaced only through the amber button color change on the home screen.
- No per-word "last reviewed" timestamp display.
- All existing Từ vựng practice behavior (modes, toast, green ✓ badge, completion redirect, Trắc nghiệm spinner) is unchanged.

### Acceptance criteria (draft)
- AC-1: Home screen shows an orange badge with due-review count on each lesson button where count > 0; badge is absent when count = 0.
- AC-2: Green ✓ and orange due-count badge coexist on the same button without overlap.
- AC-3: "Ôn tập" button appears at the top of the home screen and navigates to `/on-tap`.
- AC-4: Tapping a lesson button (or its orange badge) navigates to `/on-tap?lesson=N` pre-filtered to that lesson.
- AC-5: Ôn tập screen has its own lesson filter buttons; selecting a filter updates the word list without a page reload.
- AC-6: Ôn tập word list shows only reviewed words that are due (not new cards); each row shows Chinese character + Vietnamese meaning.
- AC-7: "Bắt đầu ôn" launches VocabSession with only the filtered due reviewed cards (not all due cards).
- AC-8: Completing all cards in an Ôn tập session clears the in-progress state and fires the session completion toast.
- AC-9: Closing mid-session (back-navigate or hard reload) leaves remaining cards stored in Zustand persist store.
- AC-10: After an interrupted session, the home screen shows amber styling (`border-amber-400 bg-amber-50`) on the affected lesson button(s).
- AC-11: After an interrupted "Tất cả" session, amber styling appears per individual lesson button (not just "Tất cả"), based on which lessons still have remaining cards.
- AC-12: When no words are due, Ôn tập screen shows a simple Vietnamese empty-state message.
- AC-13: Build passes with no TypeScript errors; all existing Từ vựng modes (Trắc nghiệm, Luyện viết) work end-to-end after changes.

### Technical notes
- `getOverdueReviewedCards(cardIds)` already exists in `progress-store.ts` — use as-is for both badge counts and session card filtering.
- New Zustand state: `activeSessions: Record<number, { cardIds: string[], startedAt: string }>` with `startSession(lesson, cardIds)`, `completeSessionCard(lesson, cardId)`, `clearSession(lesson)`, `getInProgressLessons()`.
- `/on-tap/page.tsx` — server component calling `getAllVocab()`, wrapping `OntapClient` in `<Suspense>`.
- `/on-tap/OntapClient.tsx` — client component; uses `useSearchParams()` for `?lesson=N` pre-filter.
- P1 (static export), P8 (hooks before returns), P9 (basePath via Link), P4 (Vietnamese UI) all apply.
- Badge positions: green ✓ at `absolute -top-1.5 -right-1.5`; orange due-count at a different corner (e.g. `-bottom-1.5 -right-1.5`) to avoid overlap.

### Design notes
- Device: iPad-first (P3).
- Ôn tập word list: flat, minimal — Chinese character (large) + Vietnamese meaning. No pinyin, no word type.
- In-progress visual: amber border + background on lesson button only (no banner or separate UI element).
- Empty state: single line of text centered on screen.

### Open questions
- (none)

---

## [2026-06-15] — Amendment: Ôn Tập — Remove word list

**Amends:** Section "[2026-06-15] — SRS Enhancement: Ôn Tập (Due-Word Review)"
**Specific change:**
- AC-5 (original): "Ôn tập screen has its own lesson filter buttons; selecting a filter updates the word list without a page reload."
  **New:** "Selecting a filter updates the due count without a page reload."
- AC-6 (original): "Ôn tập word list shows only reviewed words that are due (not new cards); each row shows Chinese character + Vietnamese meaning."
  **New:** "No word list — the due count is displayed as a number only (e.g. '5 từ cần ôn hôm nay')."
- Design note (original): "Ôn tập word list: flat, minimal — Chinese character (large) + Vietnamese meaning. No pinyin, no word type."
  **New:** Removed entirely.

**New agreement:** The `/on-tap` screen shows lesson filter buttons, a due count number, and the "Bắt đầu ôn" button. No per-word list is rendered. All other AC (1–4, 7–13) and in-progress tracking are unchanged.
**Reason for change:** Word list adds visual weight without value — the user does not need to preview individual words before starting the session.

---

## [2026-06-15] — Binary Right/Wrong SRS Rating

**Status:** Agreement reached

### Problem
The 4-level rating system (Lại/Khó/Tốt/Dễ) creates confusing UX and an "unlimited practicing" loop: cards rated Lại/Again receive very short FSRS intervals (sub-day), causing them to re-appear in the Ôn tập lobby immediately after a session ends — giving the impression of never being done.

### Agreed scope

**1. Remove 4-level rating from all practice modes**
- Lại/Khó/Tốt/Dễ buttons are removed from everywhere in the app (Trắc nghiệm and Luyện viết, in both Từ vựng and Ôn tập flows).
- Replaced with binary Right/Wrong — auto-determined by the app in both modes.

**2. "Right" behavior**
- Card is resolved for the current session.
- FSRS is called once with `Good (3)`, scheduling the next review ≥ 1 day from today.
- Card is removed from the session queue.

**3. "Wrong" behavior**
- Card is re-queued at the **end** of the remaining session cards (not immediately next).
- FSRS is NOT called on Wrong — only called once on the final Right.

**4. Session ends** only when all cards have been marked Right (or the user exits manually).

**5. Trắc nghiệm specifics**
- Selecting the correct multiple-choice answer = auto-Right; card is removed from the queue, auto-advance to next card.
- Selecting a wrong answer = auto-Wrong; the correct answer is briefly highlighted, then auto-advance. Card silently re-queues at the end. No explicit Right/Wrong button needed.

**6. Luyện viết specifics**
- A single "Kiểm tra" button replaces the 4-button rating row.
- The button is always enabled, even if there is no input on the writing pad.
- Auto-check is performed by **string comparison**: the text the user typed/wrote is compared against the expected character/word.
- No input on the pad → auto-Wrong (card re-queues at end).
- Input matches the expected answer → auto-Right (card resolved, FSRS called).
- Input does not match → auto-Wrong (card re-queues at end).

**7. Session exit mid-session**
- Cards not yet resolved as Right remain due and appear in the Ôn tập lobby count on the next visit (natural behavior — their FSRS due date is unchanged).

**8. After a complete session**
- All cards are resolved as Right → FSRS schedules each for a future date (≥ 1 day) → Ôn tập lobby shows 0.

### Out of scope (agreed)
- No change to which cards are included (`getDueCards` / `getOverdueReviewedCards` logic unchanged).
- No change to session freeze-at-start logic (`frozenSessionCards` retained).
- No change to Ôn tập lobby layout, session completion toast, or completion redirect.
- No change to mid-session exit behavior — unresolved cards staying due is the natural result of FSRS not being called on Wrong.

### Acceptance criteria (draft)
- AC-1: No Lại/Khó/Tốt/Dễ buttons anywhere in the app.
- AC-2: Luyện viết shows a single "Kiểm tra" button that is always enabled (replaces the 4-button row).
- AC-3: "Kiểm tra" with NO text input → card auto-marked Wrong; re-queued at end of session.
- AC-4: "Kiểm tra" with text input → string comparison against expected answer → auto-Right (card resolved) or auto-Wrong (card re-queued at end).
- AC-5: In Trắc nghiệm, selecting the correct answer = auto-Right, auto-advance. Selecting a wrong answer = auto-Wrong, correct answer briefly highlighted, card re-queues at end of session. No extra button.
- AC-6: Session ends (completion toast fires) only when all cards have been marked Right.
- AC-7: After a complete session, the Ôn tập lobby shows 0 due cards.
- AC-8: Exiting mid-session leaves unresolved cards due in the lobby (appear in count on next visit).
- AC-9: All Right resolutions (including Wrong-then-Right within a session) schedule the next review ≥ 1 day from today — no sub-day interval.

### Technical notes
- Session queue management: `frozenSessionCards` array; Wrong → move card to end of array (do not remove); Right → remove card from array. Session ends when array is empty.
- `completeSessionCard` (Zustand) is called only on Right, not on Wrong.
- `reviewCard` (FSRS) is called once per card per session, on final Right, with `Rating.Good (3)`. This guarantees ≥ 1 day interval across all card states (Learning and Review).
- Luyện viết auto-check: simple string equality check between the text input value and `getDisplayChar(card, scriptMode)`. Dev to handle trimming and any normalisation (e.g., full-width vs half-width characters) during implementation.
- No card ever receives `Rating.Again (1)` through this flow → no sub-day FSRS interval → Ôn tập lobby is always clean after a complete session.
- P4 (Vietnamese UI), P8 (hooks before returns), P1 (static export) all apply.

### Design notes
- "Kiểm tra" button: primary styling, full-width, always enabled.
- Trắc nghiệm: existing correct-answer highlight feedback retained; auto-advance after wrong pick (no extra tap required).
- No explicit "Đúng"/"Sai" labels shown to the user — the result is communicated by the auto-advance and session queue behavior.

### Open questions
- (none)

---

## [2026-06-19] — Grammar Reference HTML

**Status:** Agreement reached

### Problem
Grammar patterns from the KB are only seen during lesson intake — there is no way to casually re-read and memorize them afterward.

### Agreed scope
- Standalone `chinese-learning/grammar-reference.html` — not part of the Next.js app, opened directly in a browser
- Shows all patterns from §5 Ngữ pháp of `chinese-brain.md`, grouped by Nhóm
- Layout matches the "100 Chinese Grammar Formulas" book style:
  - Formula header: large colored components (CN/key/HDT etc.) + purple Vietnamese subtitle line + amber italic explanation note
  - Left panel: small pinyin → large red key character → Vietnamese meaning word only (no explanation text in panel)
  - Fan SVG arrows drawn by JavaScript from left panel center to each example row
  - Examples: pinyin above / colored Chinese (36px, key word red, subject blue) / Vietnamese translation below
- Vietnamese-only — no English anywhere in the file
- Global Phồn thể ⇄ Giản thể toggle button switches all Chinese text page-wide
- Auto-sync: `node scripts/generate-grammar-html.js` regenerates the file from `chinese-brain.md` and is called automatically at the end of every `/lesson` and `/kb-update` run, committed in the same git commit as the KB update

### Out of scope (agreed)
- No quiz or practice interactivity
- Not integrated into the Next.js app
- No English text

### Acceptance criteria (draft)
- AC-1: `chinese-learning/grammar-reference.html` opens locally in any browser and shows all §5 Ngữ pháp patterns
- AC-2: Patterns are grouped by Nhóm with styled group headers
- AC-3: Each pattern card has a formula header, left panel, fan SVG arrows, and example rows
- AC-4: Phồn thể ⇄ Giản thể toggle switches all Chinese text on the page
- AC-5: `node scripts/generate-grammar-html.js` regenerates the file from the current state of `chinese-brain.md`
- AC-6: The generator script is called automatically at the end of every `/lesson` and `/kb-update` run

### Technical notes
- Generator: `scripts/generate-grammar-html.js` — Node.js, no external dependencies
- Input: `chinese-learning/knowledge-base/chinese-brain.md` §5 Ngữ pháp section
- Output: `chinese-learning/grammar-reference.html`
- SVG arrows drawn at runtime via `getBoundingClientRect()` — redrawn on `load` and `resize`
- Script/traditional toggle: `body.classList.toggle('traditional')` + CSS `.simp`/`.trad` display switching

### Design notes
- Formula components: purple for CN (主语), red for key grammar element, gold/brown for HDT (tính từ), blue for particles (了), green for noun/place
- Formula subtitle: color #6d28d9 (purple), 18px, semi-bold
- Explanation note: color #b45309 (amber), 18px, italic
- Left panel: pinyin 13px italic / key character 56px red bold / meaning word 13px
- Example Chinese text: 36px, with colored `<span>` highlights on key words
- Group title: 20px, purple left border accent
- Background: warm off-white (#f5f3ef); cards: white with soft shadow

### Open questions
- (none)
