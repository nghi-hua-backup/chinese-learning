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

### Tone-4 Highlighting & Coaching Panel (FR-6)
| # | Flow | Pass condition |
|---|---|---|
| 22 | Coaching panel — Từ vựng session | "Quy tắc phát âm Thanh 4" panel with both Vietnamese rules visible above progress bar |
| 23 | Coaching panel — Mẫu câu session | Same panel visible above progress bar |
| 24 | Coaching panel — Hội thoại session | Same panel visible after entering a dialogue |
| 25 | Coaching panel — absent on non-practice screens | Panel NOT visible on Tổng quan and Tiến độ pages |
| 26 | T4 character highlight | Characters with tone-4 pinyin (e.g. 去 qù, 是 shì, 宿舍 sùshè) show light blue background |
| 27 | Neutral tone highlight | Characters with neutral-tone pinyin (e.g. 的 de, 们 men) show light blue background |
| 28 | Compound boundary separation | Adjacent T4 compounds highlighted as SEPARATE blocks (e.g. 請問 + 宿舍 + 在 = 3 distinct blocks, not merged) |
| 29 | Erhua (兒化) alignment | Erhua syllables (e.g. nǎr = 哪兒) correctly map 1 syllable → 2 chars; no offset error for subsequent characters |
| 30 | T1/T2/T3 not highlighted | Non-T4, non-neutral syllables (e.g. 你好 nǐhǎo, 新 xīn, 来 lái) have no blue background |

---

## Edge Cases

| # | Scenario | Expected behavior |
|---|---|---|
| E1 | Fresh install (empty localStorage) | Home shows 0 streak, all cards appear as new |
| E2 | `?autostart=1` with no overdue reviewed cards | Falls through to setup screen normally |
| E3 | Single-card session | Session completes after 1 card; done screen appears |
| E4 | All cards mastered (none due) | Empty state message shown; no crash |
| E5 | Dialogue already completed | ✅ shown on list; completing again doesn't duplicate in store |
| E6 | Correct Chinese sentence typed without trailing punctuation (！？。) | Accepted as correct — `normalize()` strips punctuation before comparing |
| E7 | Input contains only punctuation characters | Marked wrong — stripped input is empty, cannot match a non-empty answer |

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
| 2026-06-02 | QA (Claude) | E6–E7 (punctuation-strip fix), T2 regression, T4 Từ vựng regression — Playwright against live site | PASS — typing "沒關係" (without ！) accepted as correct for stored "沒關係！"; punctuation-only input "！？。，" still marked wrong; genuinely wrong sentence still shows red; Từ vựng correct character still accepted. |
| 2026-06-03 | QA (Claude) | Items 22–30, AC-1–AC-6, home/tiến độ regression — Playwright against local dev server (localhost:3000) | PASS — coaching panel visible in all 3 practice modes, absent on home and tiến độ. T4 chars (請問, 宿舍, 在, 是, shì, qǐngwèn, sùshè, zài) and neutral 的/de highlighted. Compound boundary separation confirmed (3 separate spans, not merged). Erhua fix confirmed: 我 and 來 NOT highlighted after 哪兒; 是 and 的 correctly highlighted. T1/T2/T3 syllables (你, 好, 我, 新, 來) not highlighted. Two bugs found and fixed during QA: (1) char span merging across compound boundaries — fixed by grouping by segment index; (2) erhua char misalignment — fixed by counting +1 char for 兒/儿 suffix. |
