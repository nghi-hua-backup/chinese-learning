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
