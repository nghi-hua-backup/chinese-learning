# Changelog

All notable changes to this project are documented here. Entries are prepended (newest first).

---

## Versioning Scheme

Format: **`MAJOR.MINOR.PATCH`**

| Digit | When to bump | Example trigger |
|---|---|---|
| **MAJOR** | Complete redesign or breaking structural change | Rebuild app from scratch, migrate to a new framework |
| **MINOR** | New feature shipped end-to-end | New practice mode, new skill/workflow added |
| **PATCH** | Bug fix, content addition, doc update, minor improvement | Fix a broken button, add a new lesson, update a doc |

**Rule (P11):** Every commit that changes code, content, or configuration must prepend a new entry here. No commit is complete without a CHANGELOG update.

---

## [2.3.0] - 2026-06-19

### Added
- Grammar Reference HTML (FR-13): standalone `chinese-learning/grammar-reference.html` — 51 patterns across 10 Nhóm, book-style cards with colored formula chips, SVG fan arrows, Phồn thể ⇄ Giản thể toggle
- Generator script `scripts/generate-grammar-html.js` — Node.js, no external dependencies; auto-invoked in `/kb-update` Bước 8

---

## [2.2.3] - 2026-06-18

### Changed
- KB: Nhóm 7 — bảng tổng hợp phương vị từ (16 từ: 上/下/前/后/里/外/左/右/东/南/西/北/旁/这/那边 + 中间, với cột Dạng 面)

---

## [2.2.2] - 2026-06-18

### Changed
- KB: 方位词 phương vị từ — 10 vocab entries (Bài 7), 5 grammar patterns (Nhóm 7), § 3.7 上/下 + lượng từ thời gian (6 entries), § 3.4 前天/后天 extension

---

## [2.2.1] - 2026-06-16

### Fixed
- Luyện viết: "Kiểm tra" button disappears when the last card in a session is answered Wrong. Root cause: `WritingInput` uses `key={card.id}`; when the same card re-queues to position 0, the key is unchanged so React preserves `submitted=true` state, hiding the button. Fix: added `attempt` counter to `VocabSession` that increments on every Wrong; key changed to `` `${card.id}-${attempt}` `` to force a clean remount.

---

## [2.2.0] - 2026-06-15

### Added
- Binary Right/Wrong SRS rating across all vocab practice modes (FR-12)
- Luyện viết: single "Kiểm tra" button (always enabled); empty input auto-scores Wrong; non-empty input triggers string comparison, auto-advances after 1.5 s
- Trắc nghiệm: correct answer auto-Right; wrong answer auto-Wrong, correct shown briefly, card re-queues at end; 1.4 s auto-advance
- Wrong cards re-queue at END of session queue (mutable queue model replaces fixed index); session ends only when all cards Right
- FSRS always called with Rating.Good (3) on Right — guarantees ≥ 1 day next review; never called on Wrong
- Progress bar now tracks resolved/total unique cards; re-queued Wrong cards don't inflate the denominator

### Removed
- Four-level SRS rating buttons (Lại/Khó/Tốt/Dễ) removed from Luyện viết
- `ReviewRating` type removed from `lib/types.ts`; `SRSRating` component retained but no longer rendered

---

## [2.1.1] - 2026-06-15

### Fixed
- Ôn tập session crash: when a card was rated, the Zustand store update caused `OntapClient.dueCards` to recompute (shrink), propagating a smaller `cards` prop to `VocabSession`, making `index` out of bounds and crashing with a TypeError. Fix: snapshot the due cards into `frozenSessionCards` state when the session starts; `VocabSession` now receives a stable array that doesn't change during the session.

---

## [2.1.0] - 2026-06-15

### Added
- FR-11: Ôn tập (Due-Word Review) — new `/on-tap` route with lesson filter, flat due-word list (Chinese + Vietnamese meaning), mode selector, and VocabSession integration
- Orange due-count badges on Từ vựng lesson filter buttons (bottom-right corner, distinct from green ✓ at top-right); badge absent when count = 0
- "Ôn tập" link button at top of Từ vựng screen navigates to `/on-tap`; orange badge on lesson buttons navigates to `/on-tap?lesson=N`
- Amber styling (`border-amber-400 bg-amber-50`) on Từ vựng lesson buttons when a session for that lesson was interrupted mid-way
- `activeSessions` in Zustand persist store tracks in-progress Ôn tập sessions; survives page close/reload; cleared on session completion

---

## [2.0.2] - 2026-06-14

### Changed
- KB: Bài 11 — Mùa Đông Ở Bắc Kinh Khá Lạnh — 34 vocab entries, 3 grammar patterns, 4 social phrases (§ 6), 41 practice sentences

---

## [2.0.1] - 2026-06-14

### Changed
- KB: Tái cơ cấu `chinese-brain.md` và `chinese-practice-bank.md`:
  - `chinese-brain.md` §5 Ngữ pháp: 41 pattern phẳng → 10 nhóm chủ đề với heading `### Nhóm N`; thay thuật ngữ S/O/V → CN/TN/ĐT; thay 数词/量词/名词/方位词 → tiếng Việt
  - `chinese-practice-bank.md`: sắp xếp lại đúng thứ tự Bài 1→10 (trước đây Bài 10/9/8 đứng đầu, Bài 7 đứng trước Bài 6); thêm mục lục; xóa "Luyện tập tổng hợp" (282 dòng nội dung nhân tạo) và section "Ngữ pháp 的 — Luyện tập" orphaned; file thu gọn từ 832 → 567 dòng
  - `chinese-brain-guide.md`: thêm P-KB1–P-KB4 (quy tắc bảo trì); cập nhật bảng viết tắt CN/TN/ĐT

---

## [2.0.0] - 2026-06-14

### Changed (Breaking — complete structural refactor)
- App simplified to Từ vựng-only: removed Mẫu câu, Hội thoại, Ngữ pháp, Tổng quan (Dashboard), and Tiến độ tabs and all their routes
- Navigation bar removed entirely; app root (`/`) now lands directly on the Từ vựng lesson selection screen
- Removed components: NavBar, Dashboard, DialogueSession, PhraseSession, GrammarSession, ToneHighlight, ToneCoachingPanel
- Tone-4 highlighting removed from Writing (Luyện viết) mode — now absent from all screens
- Added one-time SRS migration: on first load, prunes all non-vocab cards (`grammar-*`, phrase, dialogue, practice) from localStorage and resets `completedDialogues`; guarded by `migration-v2-vocab-only` key so it runs exactly once
- Existing features preserved: Trắc nghiệm mode, Writing (Luyện viết) mode, lesson filter buttons, completion badges on filter buttons, session completion toast + auto-redirect (Part A), Trắc nghiệm transition spinner (Part C), traditional/simplified script toggle

## [1.6.2] - 2026-06-09

### Changed
- KB: Bài 10 — Nhà bạn có mấy người? — 32 từ vựng, 4 lượng từ (件/只/条/张), 3 mẫu ngữ pháp mới + 1 mở rộng, 6 câu § 6, 22 câu ví dụ + 13 hội thoại + 7 dịch thuật trong practice bank

## [1.6.1] - 2026-06-08

### Changed
- KB: Bổ sung số đếm — tái cấu trúc § 3.1, thêm 百/千/万/亿 với quy tắc tổ hợp; 5 entry Bài 9 Từ vựng (百/千/万/亿/两); nhóm mới "Số tiền thực tế (VND)" trong § 6

---

## [1.6.0] - 2026-06-07

### Added
- Grammar Recognition Practice (FR-10): new "Ngữ pháp" tab in main navigation
- `app/ngu-phap/page.tsx` — server component calling `getAllGrammar()` for all 32 patterns
- `app/ngu-phap/NguPhapClient.tsx` — mode selection screen with "Nhận diện" mode and due-count stat
- `components/GrammarSession.tsx` — recognition session: due-pattern queue, random example sentence, 4 MCQ choices (1 correct + 3 random distractors), correct/wrong feedback with pattern name + Vietnamese explanation, SRS auto-rating (correct = Good/3, wrong = Again/1), 1s delay between cards, toast + redirect on completion
- Grammar SRS coexists in the existing `cards` map using `grammar-<slug>` ID prefix — no store changes required

---

## [1.5.2] - 2026-06-07

### Changed
- KB: Bài 9 amendment — 17 câu thông dụng (PHẦN 3) thêm vào § 6 chinese-brain.md: 1 vào Chào hỏi, 4 vào Câu xã giao khác, 4 nhóm mới Mua bán, 8 nhóm mới Câu lệnh & Biểu đạt ngắn

---

## [1.5.1] - 2026-06-07

### Changed
- KB: Bài 9 — Táo bán như thế nào? — 43 từ vựng, 2 lượng từ (斤/公斤), 1 số đếm (两), 1 KBP-11 append (对 Giới từ), 6 pattern ngữ pháp (去 vs 走; 两 vs 二; 一下儿 vs 一会儿; A+给+B+V; 还 hái; 别/别的), 57 câu luyện tập + 13 dòng hội thoại BTVN

---

## [1.5.0] - 2026-06-04

### Added
- Hội thoại answer diff: after "Xem đáp án", exact input match shows a green "Chính xác! ✓" banner; mismatch shows LCS character-level diff with wrong/extra chars in red and missing chars in green; empty input shows KB answer unchanged
- `computeLCSDiff` helper in `lib/utils.ts` (O(n×m) LCS with backtrack)

### Removed
- Tone coaching panel (`ToneCoachingPanel`) removed from all practice screens (Từ vựng, Mẫu câu, Hội thoại)
- Tone-4 character highlighting (`ToneHighlight`) removed from Trắc nghiệm quiz choices; retained in Luyện viết and Hội thoại

---

## [1.4.1] - 2026-06-04

### Added
- KB: Bài 8 — 35 từ vựng, 1 quy tắc phát âm (đọc dãy số), 4 pattern ngữ pháp (快+V, 什么都/也, DTLH, 跟一起), 36 câu luyện tập, 4 tình huống tổng hợp

---

## [1.4.0] - 2026-06-04

### Added
- Lesson completion badges (green ✓) on the "Tất cả" and "Bài N" filter buttons on the Từ vựng page — same SRS-based logic as the Dashboard, updated dynamically from localStorage with no reload needed
- Extracted `isLessonComplete` from `Dashboard.tsx` to `lib/utils.ts` so both Dashboard and Từ vựng share the same implementation

---

## [1.3.1] - 2026-06-04

### Fixed
- `Dashboard`: lesson completion badge (✓) never appeared after a single practice session — `scheduled_days >= 1` was always false for Learning-state cards (FSRS puts first-reviewed cards into Learning with `scheduled_days = 0`). Removed the `scheduled_days` check; badge now shows when all cards have `reps > 0` and none are overdue by more than 7 days.

---

## [1.3.0] - 2026-06-04

### Added
- FR-7: Session completion redirect + fly-out toast — after the last card in a practice session, the completion screen is skipped entirely; the user is redirected to the setup screen and a green toast appears top-right with "Hoàn thành phiên học! Đã ôn X từ." for 3 seconds then fades out. Works in both Trắc nghiệm and Luyện viết modes.
- FR-7: Lesson completion badge — each lesson card on the home screen shows a green ✓ badge when every card in that lesson has been reviewed at least once, has SRS interval ≥ 1 day, and is not overdue by more than 7 days. Badge state is computed dynamically from localStorage SRS data with no page reload required.
- FR-7: Quiz transition spinner — in Trắc nghiệm mode, a centered spinning indicator appears in the question area during the 1400ms gap between answering a question and advancing to the next one.
- New: `components/Toast.tsx` — reusable auto-dismissing toast component (fixed top-right, 3s lifetime with 400ms fade-out)

---

## [1.2.3] - 2026-06-03

### Fixed
- `ToneHighlight`: adjacent highlighted compound blocks visually overlapped at large font sizes (`text-6xl`, `text-8xl`) — changed `mx-px` to `mx-1` (4px each side) and added `inline-block` so bordered boxes are properly spaced and don't collide.

---

## [1.2.0] - 2026-06-03

### Added
- FR-6: Tone-4 highlighting — in all practice modes (Từ vựng, Mẫu câu, Hội thoại), any syllable with tone 4 (à/è/ì/ò/ù/ǜ) or neutral tone is highlighted with a light blue background on both the Chinese character and its pinyin. Compound words (space-delimited pinyin groups) are highlighted as one block; separate words are separate blocks.
- FR-6: Permanent Vietnamese coaching panel at the top of all practice screens showing two rules: "Thanh 4 + Thanh 1/2/3 → Rướn giọng đọc thanh 4" and "Thanh 4 + Thanh 4 → Thanh 4 sau đọc nhanh dứt khoát".
- New: `lib/tone-utils.ts` — syllable-level tone detection and text segmentation utilities
- New: `components/ToneHighlight.tsx` — character + pinyin rendering with compound-level light blue highlights
- New: `components/ToneCoachingPanel.tsx` — static Vietnamese coaching panel

---

## [1.2.2] - 2026-06-03

### Fixed
- `tone-utils`: Removed neutral tone from highlight trigger — only compounds containing a tone-4 syllable (grave accent vowel) are now highlighted. Previously, words like 喜欢 (xǐhuan) and 包子 (bāozi) were highlighted because their second syllable had no tone mark; this created too many false positives.
- `ToneHighlight`: Improved highlight styling — added `border border-blue-300`, increased horizontal/vertical padding (`px-1 py-0.5`), added `mx-px` gap between adjacent spans so highlights are visually distinct and don't bleed into each other.
- `ToneCoachingPanel`: Updated first rule to "Thanh 4 + Thanh 0/1/2/3 → Rướn giọng đọc thanh 4" (added Thanh 0 / neutral tone to the rule text).

---

## [1.2.1] - 2026-06-03

### Fixed
- `ToneHighlight`: consecutive T4 compounds were merged into one highlight block — fixed by grouping character spans by segment index (compound boundary) instead of by highlight status
- `tone-utils`: erhua (兒化) syllables like `nǎr` (哪兒) mapped 1 syllable → 1 char, causing all subsequent character-segment assignments to be off by one — fixed by detecting erhua compounds and counting +1 char for the 兒/儿 suffix

---

## [1.1.3] - 2026-06-02

### Added
- KB: Ngữ pháp 的 — 3 grammar patterns (ĐT/Cụm từ + 的 + DT, HDT + 的 + DT với quy tắc âm tiết, lược bỏ 的 trong cụm cố định), 8 câu luyện tập, 3 tình huống luyện tập tổng hợp

---

## [1.1.2] - 2026-06-02

### Added
- KB: Bài 7 — 10 missing sentences + 3 corrections in chinese-practice-bank.md:
  - Hội thoại Đi ăn cơm: added 好，我也去食堂。; fixed 好了→好的, 很好吃→很好喝, 我不喝→我不喝了
  - Vị trí & Công việc: added 你做什么工作？, 我是学生。, 我现在有空儿。
  - 会/知道: added 我知道这是什么！
  - Luyện tập 2: added full block (5 sentences on 专业, 空儿, 知道, 玩儿, 住在)

---

## [1.1.1] - 2026-06-02

### Fixed
- `WritingInput`: correct answers flagged as wrong when stored phrase contains trailing punctuation (！？。，etc.). `normalize()` now strips all Unicode punctuation and symbols (`\p{P}\p{S}`) before comparing — users writing by hand on iPad won't append those characters.

---

## [1.1.0] - 2026-06-02

### Added
- FR-2: Correct/incorrect feedback banner in Mẫu câu practice — green ✓ / red ✗ signal appears after answer submission, matching the Từ vựng Luyện viết pattern. Root cause: `WritingInput` unmounted before its internal feedback rendered; fixed by tracking `answerCorrect` in `PhraseSession` and rendering the banner in the answer-reveal phase.

---

## [1.0.0] - 2026-06-02

### Baseline — Initial documented release

**App features (implemented):**
- FR-1: Vocabulary flashcard practice with FSRS spaced repetition
- FR-2: Phrase flashcard practice with FSRS spaced repetition
- FR-3: Dialogue reading and comprehension practice
- FR-4: Progress tracking (due counts, review history, localStorage persistence)
- FR-5: Script mode toggle — Simplified (简体) / Traditional (繁體) display

**Tech stack:** Next.js 16, TypeScript 5, Tailwind CSS 4, Zustand 5, ts-fsrs 5, unified + remark

**Content:** Bài 1–7 (BOYA Sơ Cấp), targeting HSK1+

**Infrastructure:** GitHub Pages static hosting, GitHub Actions CI/CD (auto-deploy on push to `main`)

**Pending features:** PF-1 (Audio Pronunciation — not yet implemented)
