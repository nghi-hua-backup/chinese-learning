# Requirements

This file is the authoritative record of all features, requirements, and scope decisions. The PM role maintains it; the Developer role reads it before starting any feature.

---

## Functional Requirements — Implemented

### FR-1: Vocabulary Practice (`/tu-vung`)
- Lesson filter (individual lesson or "Tất cả"), practice mode selector, script toggle (Phồn thể / Giản thể)
- FSRS card queue from filtered lesson set; new cards always due, reviewed cards due by date
- **Trắc nghiệm mode:** 4-option MCQ (1 correct + 3 same-word-type distractors); choices show active script only; auto-rates after 1.4s (correct = Good/3, wrong = Again/1)
- **Luyện viết mode:** Apple Pencil textarea; accepts active-script form and alternate form as correct; green/red banner + answer reveal + manual SRS rating
- `?autostart=1` URL param — skips setup screen, starts review-only session (overdue reviewed cards only, no new cards)

### FR-2: Phrase & Sentence Practice (`/mau-cau`)
- Two tabs: **Câu thông dụng** (common phrases from `§6` of `chinese-brain.md`) and **Câu luyện tập** (practice sentences from `chinese-practice-bank.md`)
- Lesson filter on Câu luyện tập tab
- Script toggle (same Zustand `scriptMode`)
- Writing mode with correct/incorrect feedback banner (green ✓ / red ✗) after submission, followed by answer reveal and manual SRS rating

### FR-3: Dialogue Practice (`/hoi-thoai`)
- Situation-based dialogues from `chinese-practice-bank.md`
- Script toggle on setup screen
- Line-by-line reveal with translation; self-assessed (no auto-check)
- Completion tracking: completed dialogues show ✅, incomplete show 🎯
- Completion state persists across reloads (Zustand store → localStorage)

### FR-4: Progress Overview (`/tien-do`)
- Stats: total cards, learned count, due today, streak days
- **Ôn ngay CTA:** prominent banner when overdue *reviewed* cards exist (reps > 0); links to `/tu-vung?autostart=1`
- Upcoming review list with character in active script mode
- **Reset progress:** red button at page bottom; two-step confirmation; calls `resetAll()` on Zustand store (clears all card history, streak, last-study date)

### FR-9: Tone-4 Cleanup + Hội thoại Answer Diff
- `ToneCoachingPanel` removed from all practice screens (Từ vựng, Mẫu câu, Hội thoại)
- `ToneHighlight` removed from Trắc nghiệm (quiz) mode; retained in Luyện viết (Flashcard) and Hội thoại
- After tapping "Xem đáp án" in Hội thoại: exact input match → green "Chính xác! ✓" banner; mismatch → LCS character-level diff with wrong/extra chars in red (user input) and missing chars in green (KB answer); empty input → KB answer shown as before with no diff

### FR-8: Lesson Completion Badge on Từ vựng Page
- Each "Bài N" filter button on the Từ vựng page shows a green ✓ badge when all cards in that lesson have `reps > 0` and none are overdue by more than 7 days
- The "Tất cả" button shows a green ✓ badge when all cards across all lessons meet the same criteria
- Badge disappears when any relevant card becomes overdue by more than 7 days
- Badge state updates dynamically from Zustand/localStorage SRS data — no page reload required
- `isLessonComplete` extracted from `Dashboard.tsx` to `lib/utils.ts` and shared by both Dashboard and Từ vựng page

### FR-7: Session Completion UX + Lesson Progress Flag + Quiz Loading State
- After the last card in a practice session, the completion screen is skipped; the user returns to the setup screen
- A fly-out toast appears top-right with "Hoàn thành phiên học! Đã ôn X từ." — visible for 3 seconds then fades; present in both Trắc nghiệm and Luyện viết modes
- Each lesson card on the home screen shows a green ✓ badge when every card in that lesson has `reps > 0`, `scheduled_days >= 1`, and is not overdue by more than 7 days
- Badge state computed dynamically from Zustand/localStorage SRS data — no page reload needed
- In Trắc nghiệm mode, a spinner appears in the question card area during the 1400ms transition between questions

### FR-6: Tone-4 Highlighting & Practice Coaching Panel
- In all practice mode screens (Từ vựng, Mẫu câu, Hội thoại): light blue background on both Chinese character and pinyin for any syllable with tone 4 (à/è/ì/ò/ù/ǜ) or neutral tone (no tone mark)
- Compound words (space-delimited pinyin groups) highlighted as one block; separate compounds are separate blocks
- Permanent coaching panel at top of all practice screens showing two Vietnamese rules: "Thanh 4 + Thanh 1/2/3 → Rướn giọng đọc thanh 4" and "Thanh 4 + Thanh 4 → Thanh 4 sau đọc nhanh dứt khoát"
- Panel always visible — no conditional logic based on card content
- No highlighting outside practice mode screens

### FR-5: Script Mode (Global)
- Phồn thể / Giản thể toggle on setup screens
- Persists across all pages and reloads via Zustand store → localStorage
- Affects: MCQ choice display, answer reveal, writing check, progress page card labels

---

## Non-Functional Requirements

### NFR-1: Platform Target
- iPad Safari / WebKit, touch-friendly, thumb-reachable controls
- Apple Pencil handwriting input as primary writing method (no OCR library)

### NFR-2: Performance
- Static export — zero server round-trips for content
- Build time: under 60 seconds locally
- First page load: under 3 seconds on iPad Wi-Fi

### NFR-3: Reliability
- No crash on any flow listed in `docs/VERIFICATION.md`
- React Rules of Hooks enforced (see `docs/PRINCIPLES.md` P8)

### NFR-4: Maintainability
- Markdown is the content source — new content via text edit only, no database
- Single user, single device — no multi-user complexity
- All approved changes committed and pushed (git is source of truth)

---

## Confirmed Limitations (Not Bugs)

| Limitation | Reason |
|---|---|
| No audio pronunciation | Not yet implemented (see PF-1) |
| No multi-device sync | Single-device by design (P2) |
| No user accounts or auth | Single user by design (P2) |
| Content update requires a push | Static export — build-time only (P7) |
| No Cantonese support | Deferred to future phase |

---

## Pending Features (Backlog)

### PF-2: Grammar Recognition Practice (Ngữ pháp Tab v1)
**Priority:** High
**Description:** A new "Ngữ pháp" tab in the main navigation with a single "Nhận diện" (Recognition) practice mode. The app shows a Chinese example sentence from § 5 of `chinese-brain.md` and the user picks the correct grammar pattern name from 4 multiple-choice options (1 correct + 3 random distractors). SRS (FSRS) tracks progress per grammar pattern in a separate localStorage namespace from vocabulary. Future versions will add fill-in-the-blank and translation drill modes.
**Acceptance criteria:**
- AC-1: "Ngữ pháp" tab appears in the main navigation alongside existing tabs
- AC-2: Ngữ pháp tab shows a mode selection screen with "Nhận diện" as the only available mode
- AC-3: Recognition session surfaces grammar pattern cards ordered by SRS schedule (due cards first), drawing from all 37 patterns with no lesson filter
- AC-4: Each card shows one Chinese example sentence and 4 multiple-choice options for the grammar pattern name (1 correct + 3 random distractors)
- AC-5: After picking, the app shows correct/wrong feedback and reveals the correct pattern name and its Vietnamese explanation
- AC-6: Grammar SRS progress is tracked per pattern in localStorage under a separate key namespace from vocabulary (e.g., `grammar:<pattern-slug>`), using the same FSRS mechanism
- AC-7: Session completion triggers the existing "Hoàn thành phiên học!" toast + auto-redirect UX
- AC-8: Example sentences in grammar cards respect the user's current script mode (simplified/traditional)

**Tech approach (Tech Lead):**
- Components affected: `NavBar.tsx` (add link), new `app/ngu-phap/page.tsx` (server), new `app/ngu-phap/NguPhapClient.tsx` (mode selection), new `components/GrammarSession.tsx` (recognition session)
- Implementation strategy: Grammar IDs from parser are already prefixed `grammar-<slug>` (e.g., `grammar-太-hdt-了`), so they naturally coexist in the existing `cards` map of `progress-store.ts` without namespace collision — no store changes required. `getAllGrammar()` from `lib/data.ts` already parses all 37 patterns. `getDisplayChar()` accepts any object with `simplified`/`traditional` fields, so `GrammarExample` is compatible. `GrammarSession` uses the existing `reviewCard(patternId, rating)` and `getDueCards(patternIds)` from `useProgressStore`. Each card picks one random example from `pattern.examples`, generates 3 random distractors from other pattern names, and auto-rates correct=Good(3) / wrong=Again(1) after a 1s feedback delay. Session completion reuses the existing `Toast.tsx` + navigate-back pattern from `VocabSession`.
- Risks / pitfalls: P8 — all hooks in `GrammarSession` must appear before any early return (empty-queue guard). Distractor generation must handle edge cases: if fewer than 3 other patterns exist, use all available others (not an issue with 37 patterns, but defensive coding required).
- P-constraints to watch: P1 (static export — grammar data parsed at build time in server component only), P7 (no runtime fetch), P8 (hooks before early returns), P4 (all UI labels in Vietnamese)

---

### PF-1: Audio Pronunciation
**Priority:** Medium
**Description:** Web Speech API (`speechSynthesis`) to read characters/sentences aloud on demand. A 🔊 button per card; `utterance.lang = "zh-CN"`. No backend or API key required.
**Acceptance criteria:**
- 🔊 button appears on each vocab card (both modes)
- Tapping the button reads the character aloud in Mandarin
- Works in Safari/WebKit on iPad (Web Speech API is supported)
- Button does not interfere with the handwriting input flow

---

## Out of Scope (Unless Explicitly Added by User)

- Multi-user support
- Backend / server runtime
- OCR or computer vision for handwriting recognition
- Cantonese or other Chinese dialect support
- Desktop-optimized UI
- Cloud sync or cross-device progress sharing
- Gamification (leaderboards, achievements)
