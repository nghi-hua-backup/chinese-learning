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

### PF-2: Tone-4 Cleanup + Hội thoại Answer Diff
**Priority:** High
**Description:** Three agreed changes from INTAKE.md [2026-06-04]:
1. **Remove ToneCoachingPanel** from all practice screens (Từ vựng Flashcard, Trắc nghiệm, Mẫu câu, Hội thoại) — reversal of FR-6 coaching panel sub-feature
2. **Remove ToneHighlight** from Trắc nghiệm (quiz) mode only — keep ToneHighlight in Flashcard and Hội thoại
3. **Hội thoại Answer Diff** — after tapping "Xem đáp án", compare input against KB answer using LCS character-level diff; show green match banner on exact match, or red/green diff spans on mismatch

**Acceptance criteria:**
- AC-1: No coaching panel appears on any practice screen
- AC-2: ToneHighlight is absent from Trắc nghiệm (quiz); still present in Luyện viết (Flashcard) and Hội thoại
- AC-3: Exact input match → green "Chính xác! ✓" banner in Hội thoại answer reveal
- AC-4: Mismatch → user input shown character-by-character with wrong/extra chars in red; KB answer shown with missing chars in green
- AC-5: Empty input → no diff, no banner (KB answer shown as before)

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
