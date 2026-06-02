# Verification Checklist

QA reference for testing the deployed app. Run this after every significant change. Test on the **live URL** using iPad Safari (or simulate): `https://nghi-hua-backup.github.io/chinese-learning/`

A failure on any **BLOCKER** item = do not consider the change complete. Hand off to `/fix`.

---

## Pre-Flight

| # | Check | Pass condition |
|---|---|---|
| P1 | Local build succeeds | `cd chinese-app && npm run build` exits 0, `out/` is created |
| P2 | GitHub Actions deploy | Green check ✓ on latest commit in the repo |
| P3 | Live URL responds | `https://nghi-hua-backup.github.io/chinese-learning/` loads without 404 |

---

## BLOCKER Flows (crash or wrong behavior = stop, report, fix)

### Home Page
| # | Flow | Pass condition |
|---|---|---|
| 1 | Page loads | Dashboard shows streak count, due count, and lesson link list |

### Vocabulary — `/tu-vung`
| # | Flow | Pass condition |
|---|---|---|
| 2 | Setup screen loads | Lesson filter dropdown + mode selector + script toggle visible |
| 3 | Trắc nghiệm — complete full session | "Hoàn thành phiên học!" screen appears without crash |
| 4 | Trắc nghiệm — "Học lại từ đầu" | Session restarts cleanly from card 0 |
| 5 | Luyện viết — write correct answer | Green ✓ banner + answer reveal (text-8xl character) + SRS rating buttons |
| 6 | Luyện viết — write wrong answer | Red ✗ banner + answer reveal + SRS rating buttons |
| 7 | Luyện viết — complete full session | Done screen appears; restart works |

### Script Mode (global)
| # | Flow | Pass condition |
|---|---|---|
| 8 | Phồn thể mode — MCQ | Choices show traditional only (e.g. `難`, not `难/難`) |
| 9 | Giản thể mode — MCQ | Choices show simplified only (e.g. `难`) |
| 10 | Script mode persists across pages | Set mode in Từ vựng; navigate to Mẫu câu — same mode is active |

### Phrases — `/mau-cau`
| # | Flow | Pass condition |
|---|---|---|
| 11 | Complete a Câu thông dụng session | Done screen appears, no crash |
| 12 | Complete a Câu luyện tập session | Done screen appears, no crash |
| 20 | Mẫu câu — write wrong answer | Red "✗ Sai rồi" banner appears above answer reveal; answer reveal (character, pinyin, meaning) and SRS rating buttons visible |
| 21 | Mẫu câu — write correct answer | Green "✓ Chính xác!" banner appears above answer reveal; answer reveal and SRS rating buttons still visible |

### Dialogues — `/hoi-thoai`
| # | Flow | Pass condition |
|---|---|---|
| 13 | Complete a dialogue | "Hoàn thành hội thoại" reached, no crash |
| 14 | Completion mark persists | Reload page — completed dialogue still shows ✅ |

### Progress — `/tien-do`
| # | Flow | Pass condition |
|---|---|---|
| 15 | Page loads | Stats displayed (total, learned, due, streak); reset button visible |
| 16 | Reset progress (two-step) | First tap shows confirm prompt; confirm → streak resets to 0, cards cleared |
| 17 | Ôn ngay CTA visible | When overdue reviewed cards > 0, indigo banner with count appears |
| 18 | Ôn ngay CTA links correctly | Tapping banner navigates to `/tu-vung?autostart=1` (review-only session, no setup screen) |

### Navigation
| # | Flow | Pass condition |
|---|---|---|
| 19 | All 4 nav bar links | Each link navigates correctly; active tab highlighted; no 404 |

---

## Edge Cases

| # | Scenario | Expected behavior |
|---|---|---|
| E1 | Fresh install (empty localStorage) | Home shows 0 streak, all cards appear as new |
| E2 | `?autostart=1` with no overdue reviewed cards | Falls through to setup screen normally |
| E3 | Single-card session | Session completes after 1 card; done screen appears |
| E4 | All cards mastered (none due) | Empty state message shown; no crash |
| E5 | Dialogue already completed | ✅ shown on list; completing again doesn't duplicate in store |

---

## Known Non-Bugs (do not file as issues)

- The `—` character in practice sentences is intentional (simplified == traditional for that entry)
- `chinese-learning/progress/` directory is empty — this is a legacy artifact, not a missing feature
- `kb.json` in knowledge-base/ is a stub — not used by the build

---

## Test Scenario Log

Append an entry after each QA session.

| Date | Tester | Items checked | Issues found |
|---|---|---|---|
| 2026-06-02 | QA (Claude) | P1–P3, 1, 11–15, 19 checked; items 2–10, 16–18 not browser-testable (JS-rendered) | none — reorganization touched only docs/skills/boilerplate, zero app code changed |
| 2026-06-02 | QA (Claude) | P1, 5–7 (Luyện viết textarea font) — Playwright local dev run | PASS — textarea computed 72px / fontWeight 700 (text-7xl font-bold). Placeholder visually large and bold. No regressions on setup screen or session flow. |
| 2026-06-02 | QA (Claude) | P3, 1, 2, 5, 11, 13, 15, 19 — Playwright against live site | PASS — placeholder attr is null on textarea (removed). Home, tu-vung, mau-cau, hoi-thoai, tien-do all load. All 5 nav links present. No regressions. |
| 2026-06-02 | QA (Claude) | Items 20–21 (Mẫu câu feedback banner), T3 (Từ vựng regression) — Playwright against live site | PASS — red "✗ Sai rồi" banner + answer reveal + SRS rating all visible after wrong answer; green "✓ Chính xác!" banner + answer reveal + SRS rating all visible after correct answer; Từ vựng Luyện viết red banner unaffected. |
