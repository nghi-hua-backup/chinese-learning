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
