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
