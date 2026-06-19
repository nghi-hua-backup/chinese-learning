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

### FR-10: Grammar Recognition Practice (`/ngu-phap`)
- New "Ngữ pháp" tab in the main navigation alongside existing tabs
- Mode selection screen with "Nhận diện" as the only available mode + due-count stat
- Recognition session: one random example sentence per pattern card; 4 MCQ choices (1 correct grammar pattern name + 3 random distractors from other patterns)
- After picking: correct/wrong feedback banner + reveals correct pattern name and Vietnamese explanation
- Correct → SRS rating Good (3); wrong → Again (1); 1s feedback delay, then next card
- All 32 patterns practiced together (no lesson filter); SRS tracks per pattern using existing `cards` map with `grammar-<slug>` ID prefix (no namespace collision with vocab)
- Session completion triggers existing "Hoàn thành phiên học!" toast + auto-redirect UX
- Example sentences respect user's current script mode (simplified/traditional) via `getDisplayChar`

### FR-13: Grammar Reference HTML
- `chinese-learning/grammar-reference.html` opens locally in any browser and shows all §5 Ngữ pháp patterns
- Patterns are grouped by Nhóm with styled group headers
- Each pattern card has a formula header (large colored chips + purple Vietnamese expansion + amber explanation), left panel (pinyin → key char → subtitle), SVG fan arrows, and example rows (pinyin / 36px Chinese / Vietnamese)
- Phồn thể ⇄ Giản thể toggle switches all Chinese text on the page; traditional form hidden by default via CSS class
- `node scripts/generate-grammar-html.js` regenerates the file from the current state of `chinese-brain.md` (no npm dependencies)
- Generator invoked automatically in Bước 8 of `/kb-update` / `/lesson` skill; output committed in the same KB commit

### FR-12: Binary Right/Wrong SRS Rating
- All practice modes (Trắc nghiệm, Luyện viết) use binary Right/Wrong — no Lại/Khó/Tốt/Dễ buttons anywhere
- Luyện viết: single "Kiểm tra" button (always enabled); no input → auto-Wrong; input → string comparison → Right/Wrong with 1.5s auto-advance
- Trắc nghiệm: correct answer = auto-Right; wrong answer = auto-Wrong, correct briefly shown, card re-queues at end of session; 1.4s auto-advance
- Wrong cards re-queue at the END of the remaining session queue (mutable queue model)
- FSRS called once per card on final Right (Rating.Good = 3 always); not called on Wrong; guarantees ≥ 1 day next review
- Session ends only when all cards Right; exiting mid-session leaves unresolved cards due in Ôn tập lobby

### FR-11: SRS Enhancement — Ôn Tập (Due-Word Review)
- Home screen shows an orange badge with due-review count on each lesson button where count > 0; badge is absent when count = 0
- Green ✓ and orange due-count badge coexist (green at `-top-1.5 -right-1.5`, orange at `-bottom-1.5 -right-1.5`) without overlap
- "Ôn tập" button at the top of the Từ vựng screen links to `/on-tap`; shows total due count inline
- Tapping an orange badge on a lesson button navigates to `/on-tap?lesson=N` pre-filtered to that lesson
- `/on-tap` screen has its own lesson filter buttons; selecting a filter updates the word list without a page reload
- Word list shows only reviewed words that are due (not new cards); each row shows Chinese character + Vietnamese meaning
- "Bắt đầu ôn" launches VocabSession with only the filtered due reviewed cards
- Completing all cards clears the in-progress state and fires the session completion toast
- Closing mid-session (back-navigate or hard reload) leaves remaining cards stored in Zustand persist store
- After an interrupted session, the Từ vựng screen shows amber styling (`border-amber-400 bg-amber-50`) on the affected individual lesson button(s)
- After an interrupted "Tất cả" session, amber is distributed per individual lesson button based on remaining card lessons
- When no words are due, Ôn tập screen shows a Vietnamese empty-state message
- `activeSessions: Record<number, { cardIds: string[], startedAt: string }>` persisted in Zustand store (key 0 = Tất cả, key N = specific lesson)

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
