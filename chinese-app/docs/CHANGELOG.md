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
