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
| 3 | Trắc nghiệm — complete full session | User returns to setup screen (no completion screen); green toast appears top-right: "Hoàn thành phiên học! Đã ôn X từ." |
| 4 | Trắc nghiệm — toast auto-dismisses | Toast fades out after ~3 seconds; setup screen remains; no crash |
| 5 | Luyện viết — write correct answer | Green ✓ "Chính xác!" banner; auto-advances to next card after ~1.5 s (FR-12: no rating buttons) |
| 6 | Luyện viết — write wrong answer | Red ✗ "Sai rồi" banner + "Đáp án đúng:" with correct character (text-4xl); auto-advances after ~1.5 s; card re-queues at end |
| 7 | Luyện viết — complete full session | User returns to setup screen; green toast appears top-right with correct card count |

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
| 19 | ~~All 6 nav bar links~~ *(N/A — nav bar removed in v2.0.0)* | App root `/` lands on Từ vựng lesson selection screen with no nav bar visible |

### Grammar Recognition Practice — `/ngu-phap` (FR-10)
| # | Flow | Pass condition |
|---|---|---|
| 49 | Ngữ pháp tab in nav | "Ngữ pháp" with 📝 icon appears in bottom nav between Hội thoại and Tiến độ; navigates to `/ngu-phap/` without 404 |
| 50 | Mode selection screen loads | Page shows pattern count ("32 mẫu ngữ pháp"), due count, and "Nhận diện" button |
| 51 | Nhận diện button enabled when due cards exist | Button is enabled (no opacity-50, cursor-not-allowed) and shows due count when grammar cards are due |
| 52 | Nhận diện button disabled when nothing due | After completing all patterns for the day, button shows "Không có mẫu nào cần ôn hôm nay" and is disabled |
| 53 | Recognition session — example card shown | Chinese sentence in active script + pinyin + Vietnamese meaning displayed in card; "Ngữ pháp nào?" label visible |
| 54 | Recognition session — 4 MCQ choices | Exactly 4 choices visible; one is the correct pattern name; 3 are distractors from other patterns |
| 55 | Correct answer — green feedback | Tapping the correct pattern name: button turns green, "✓ Chính xác!" feedback banner appears with pattern name + explanation |
| 56 | Wrong answer — red/green feedback | Tapping a wrong choice: selected button turns red, correct button turns green, "✗ Sai rồi!" banner appears |
| 57 | 1s delay then next card | After selection (correct or wrong), 1 second passes then card advances automatically; counter decrements |
| 58 | Session completion toast | After last card, "Hoàn thành phiên học! Đã ôn N mẫu." toast appears top-right and screen returns to mode selection |
| 59 | Script mode respected | Switching between Phồn thể/Giản thể on another page → returning to Ngữ pháp shows example sentence in selected script |
| 60 | SRS progress persists | After completing a session, grammar patterns have due dates in the future; next visit shows reduced due count |
| 61 | Quay lại button exits session | Tapping "← Quay lại" during a session returns to mode selection without completing the session |

### Session Completion + Lesson Badge + Quiz Spinner (FR-7)
| # | Flow | Pass condition |
|---|---|---|
| 31 | Trắc nghiệm — complete session | No completion screen shown; user lands on setup screen without manual navigation |
| 32 | Toast content | Toast shows "Hoàn thành phiên học! Đã ôn X từ." where X = actual card count reviewed |
| 33 | Toast timing | Toast visible ~3 seconds then fades; no close button present |
| 34 | Luyện viết — complete session | Same redirect + toast behavior as Trắc nghiệm |
| 35 | Lesson badge — completed lesson | Home screen shows green ✓ badge on a lesson card after all its cards are reviewed at least once (reps > 0) and none are overdue by more than 7 days |
| 36 | Lesson badge — new lesson | Home screen shows NO badge on a lesson that has never been practiced |
| 37 | Quiz transition spinner | In Trắc nghiệm, after selecting an answer, a centered spinning indicator appears in the question area during the ~1400ms gap before the next question |

### Từ vựng Page — Lesson Completion Badges (FR-8)
| # | Flow | Pass condition |
|---|---|---|
| 38 | Bài N badge — completed lesson | On the `/tu-vung` setup screen, a "Bài N" filter button shows a green ✓ badge when all cards in that lesson have `reps > 0` and none are overdue by more than 7 days |
| 39 | Bài N badge — new lesson | A "Bài N" button shows NO badge if no cards in that lesson have been practiced (`reps = 0` for all) |
| 40 | Tất cả badge — all lessons complete | The "Tất cả" button shows a green ✓ badge only when all lessons individually meet the completion criteria |
| 41 | Tất cả badge — some lessons incomplete | The "Tất cả" button shows NO badge if any single lesson has at least one card not yet practiced or overdue by more than 7 days |
| 42 | Badge disappears after overdue | After a card's due date passes by more than 7 days, its lesson's badge disappears (visible on next page load or store rehydration) |
| 43 | Badge updates after session | Completing a practice session for a lesson causes the lesson's badge to appear immediately on the setup screen (no page reload required — badge state reads from Zustand store) |

### Ôn Tập (Due-Word Review) — `/on-tap` (FR-11)
| # | Flow | Pass condition |
|---|---|---|
| 62 | "Ôn tập" link on Từ vựng screen | Orange "🔁 Ôn tập" button visible at top of `/tu-vung` setup screen; links to `/on-tap`; shows total due count badge inline when count > 0 |
| 63 | Orange due-count badge on lesson buttons | Each "Bài N" filter button shows an orange badge at bottom-right when that lesson has due reviewed cards; badge absent when count = 0; green ✓ badge (if present) remains at top-right — no overlap |
| 64 | Orange badge tap → pre-filtered Ôn tập | Tapping the orange badge on "Bài N" navigates to `/on-tap?lesson=N`; lesson filter is pre-selected to Bài N on arrival |
| 65 | Ôn tập lesson filter | On `/on-tap`, tapping a different "Bài N" filter button updates the due word list immediately (no reload); "Tất cả" shows union of all due cards |
| 66 | Due count display | When due cards exist, Ôn tập shows an orange count number (e.g. "5") with label "từ cần ôn hôm nay" and a "Bắt đầu ôn (N từ)" button — no word list |
| 67 | "Bắt đầu ôn" launches session | Tapping "Bắt đầu ôn (N từ)" starts a VocabSession with exactly those N due cards in the selected mode |
| 72 | Session rating — no crash | Rate the first card in an Ôn tập session (correct or wrong); next card appears without crash; session continues to completion |
| 68 | Session completion — toast + clear | After the last card is rated, "Hoàn thành phiên học! Đã ôn N từ." toast fires, screen returns to Ôn tập setup; no amber badge on Từ vựng buttons for that lesson |
| 69 | Mid-session interrupt — amber persists | Navigate away mid-session (back button or hard reload); return to `/tu-vung` — affected "Bài N" button(s) show amber border (`border-amber-400 bg-amber-50`) |
| 70 | "Tất cả" session interrupt — per-lesson amber | Start an Ôn tập session for "Tất cả", rate some cards, navigate away; each lesson that still has remaining cards shows amber on its individual "Bài N" button |
| 71 | Empty state — no due words | When no reviewed cards are due for the selected filter, Ôn tập screen shows "✅ Không có từ nào cần ôn!" and "Tất cả từ đã học đều ổn định." — no "Bắt đầu ôn" button |

### FR-9: Tone-4 Cleanup + Hội thoại Answer Diff
| # | Flow | Pass condition |
|---|---|---|
| 44 | Trắc nghiệm — MCQ choices plain text | In Trắc nghiệm mode, MCQ choice cards show the Chinese character as plain text (no light blue highlight on any choice, even for T4 chars like 去/是) |
| 45 | Luyện viết — answer reveal still highlights | In Luyện viết mode, after reveal, T4 characters in the answer still show light blue background (ToneHighlight intact) |
| 46 | Hội thoại — exact match banner | In a user-turn line: type the exact expected Chinese characters, tap "Xem đáp án" → green "Chính xác! ✓" banner shown; no diff row shown |
| 47 | Hội thoại — mismatch diff | In a user-turn line: type a wrong/partial answer, tap "Xem đáp án" → "Đáp án mẫu:" block shows missing chars in green; "Bạn viết:" block shows extra/wrong chars in red; matched chars shown normally |
| 48 | Hội thoại — empty input unchanged | In a user-turn line: leave textarea empty, tap "Xem đáp án" → "Đáp án mẫu:" shows KB answer as before (ToneHighlight); no diff block; no "Chính xác! ✓" banner |

### Tone-4 Highlighting & Coaching Panel (FR-6, FR-9)
| # | Flow | Pass condition |
|---|---|---|
| 22 | Coaching panel — absent from Từ vựng session | No "Quy tắc phát âm Thanh 4" panel visible in the Từ vựng practice screen (removed in FR-9) |
| 23 | Coaching panel — absent from Mẫu câu session | No coaching panel visible in the Mẫu câu practice screen (removed in FR-9) |
| 24 | Coaching panel — absent from Hội thoại session | No coaching panel visible after entering a dialogue (removed in FR-9) |
| 25 | Coaching panel — absent everywhere | Panel NOT visible on any screen — Tổng quan, Tiến độ, and all three practice modes |
| 26 | T4 character highlight — Luyện viết & Hội thoại | Characters with tone-4 pinyin (e.g. 去 qù, 是 shì, 宿舍 sùshè) show light blue background in Luyện viết answer reveal and Hội thoại (FR-9: scope restricted — Trắc nghiệm excluded) |
| 27 | Neutral tone NOT highlighted | Neutral-tone syllables alone (e.g. 的 de, 们 men, 包子 bāozi, 喜欢 xǐhuan) do NOT receive a blue background — only tone-4 syllables trigger highlighting |
| 28 | Compound boundary separation | Adjacent T4 compounds highlighted as SEPARATE blocks (e.g. 請問 + 宿舍 + 在 = 3 distinct blocks, not merged) with visible spacing between bordered boxes (no visual collision) |
| 29 | Erhua (兒化) alignment | Erhua syllables (e.g. nǎr = 哪兒) correctly map 1 syllable → 2 chars; no offset error for subsequent characters |
| 30 | T1/T2/T3 not highlighted | Non-T4, non-neutral syllables (e.g. 你好 nǐhǎo, 新 xīn, 来 lái) have no blue background |

### Binary Right/Wrong SRS Rating (FR-12)

| # | Flow | Pass condition |
|---|---|---|
| 73 | "Kiểm tra" always enabled | In Luyện viết, the "Kiểm tra" button is enabled (not grey/disabled) both with and without text in the textarea |
| 74 | Empty input → auto-Wrong | Tap "Kiểm tra" with blank textarea → red ✗ banner + "Đáp án đúng:" reveal appears; card re-queues at end; next card auto-advances after ~1.5 s |
| 75 | Correct input → auto-Right | Type the correct character(s), tap "Kiểm tra" → green ✓ "Chính xác!" banner; card resolved; next card (or completion toast) after ~1.5 s |
| 76 | Wrong input → auto-Wrong | Type incorrect text, tap "Kiểm tra" → red ✗ banner + answer reveal; card re-queued at end; next card after ~1.5 s |
| 77 | Trắc nghiệm correct → auto-Right | Tap correct MCQ choice → button turns green; spinner appears; next card (or completion) after ~2.6 s; no rating button shown |
| 78 | Trắc nghiệm wrong → auto-Wrong | Tap wrong MCQ choice → selected button turns red, correct button turns green; spinner appears; card re-queues at end; next card after ~2.6 s |
| 79 | No 4-level rating buttons visible | In both Trắc nghiệm and Luyện viết, no Lại/Khó/Tốt/Dễ buttons appear anywhere in the session UI |
| 80 | Wrong card re-queues at END | Mark a card Wrong; it appears again only after all currently remaining cards in the session (not immediately next) |
| 81 | Session ends only when all Right | Mark all cards Right (including previously Wrong ones); completion toast fires and screen returns to setup — no card left in queue |
| 82 | Post-session Ôn tập lobby = 0 | After a full session where all cards are marked Right, Ôn tập lobby shows "Không có từ nào cần ôn!" for that lesson (FSRS scheduled ≥ 1 day, so not due today) |
| 83 | Last card Wrong → "Kiểm tra" still visible | In Luyện viết, answer the last card in the session incorrectly; the card re-queues and the "Kiểm tra" button is visible and tappable on the re-shown card (not stuck/hidden) |

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
| E8 | Interrupted session (navigate away mid-session) | Lesson badge on home screen reflects only cards that were actually rated; partially-reviewed lesson does not show badge if not all cards meet the criteria |

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
| 2026-06-03 | QA (Claude) | Fix: adjacent highlight box overlap (1.2.3) — item 28 + visual check — Playwright local dev | PASS — bounding boxes confirm 8px gap between 請問/宿舍 and 宿舍/在 (right=584→left=592, right=715→left=723). No overlap. computedStyle marginLeft=4px confirms mx-1 applied. Vocab single-word highlight (坐/zuò, 叫/jiào) clean. Pinyin spans also non-overlapping. |
| 2026-06-04 | QA (Claude) | FR-7 (1.3.0): P1 (build), P3 (live URL), BLOCKER 1 (home page), 31–37 (FR-7 flows), E8 (interrupted session) — P1/P3/BLOCKER-1 verified via build log + WebFetch. Items 31–37 require JS execution in live browser (client-rendered). BLOCKER items 3, 4, 7 updated in VERIFICATION.md to reflect FR-7 completion behavior (old completion screen removed). No regressions found in static-verifiable flows. | PASS (static checks). Items 31–37 require manual iPad Safari verification. |
| 2026-06-04 | QA (Claude) | Fix 1.3.1: lesson badge `scheduled_days` bug — P1 (build ✓), P3 (live URL ✓), BLOCKER 1 (home page ✓). Root cause: FSRS `scheduled_days = 0` for first-reviewed (Learning state) cards; `scheduled_days >= 1` check removed. Item 35 in VERIFICATION.md updated to reflect corrected badge criterion. Items 31, 35–36 require manual iPad verification on live site after deploy. | PASS (static checks). Manual: verify ✓ badge appears on home screen after completing first practice session for a lesson. |
| 2026-06-04 | QA (Claude) | FR-8 (1.4.0): lesson completion badges on Từ vựng page — P1 (build ✓ from Phase 3), P3 (live URL ✓ via WebFetch), BLOCKER 1 (home page content correct ✓). `/tu-vung` page loads (shows "Đang tải..." as expected for client-rendered app). Items 38–43 (FR-8 badge flows) require JS execution in live browser — cannot be verified via WebFetch. BLOCKER items 2–19 carry forward from prior sessions (no regressions in static-verifiable flows). Added test scenarios 38–43 to VERIFICATION.md. | PASS (static checks). Manual: verify ✓ badge appears on Bài N buttons and Tất cả button on the Từ vựng setup screen after completing a practice session. |
| 2026-06-04 | QA (Claude) | FR-9 (1.5.0): tone-4 cleanup + Hội thoại answer diff — P1 (build ✓ from Phase 3, all 8 pages generated), P2 (GitHub Actions deploy ✓ — commit 6658798, 58s), P3 (live URL ✓ — home page loads with all content). Code-level AC verification: ToneCoachingPanel absent from all 4 practice components (grep confirms 0 occurrences) ✓; ToneHighlight absent from MultipleChoice.tsx ✓; ToneHighlight retained in VocabSession, PhraseSession, DialogueSession ✓; computeLCSDiff in lib/utils.ts ✓; isExactMatch/diffResult derived consts guard `input.length > 0` (AC-4 empty-input path) ✓; "Chính xác! ✓" banner (AC-1) ✓; red inputChars / green expectedChars (AC-2, AC-3) ✓; LCS DP+backtrack algorithm (AC-5) ✓. Updated stale items 22–25 (coaching panel now "absent" not "visible"). Added test scenarios 44–48. Items 44–48 require JS execution in live browser — cannot be verified via WebFetch. | PASS (static + code checks). Manual: verify items 44–48 on live iPad Safari. |
| 2026-06-07 | QA (Claude) | FR-10 (1.6.0): Grammar Recognition Practice — P1 (build ✓ from Phase 3, 9 static pages generated incl. /ngu-phap/), P2 (GitHub Actions deploy ✓ — commit 838865e, status: success), P3 (live URL ✓ — /ngu-phap/ loads, shows "32 mẫu ngữ pháp · 32 cần ôn hôm nay"). BLOCKER-19 updated: all 6 nav links confirmed (added Ngữ pháp between Hội thoại and Tiến độ) ✓. Code-level AC verification: "Ngữ pháp" link in NavBar ✓; getAllGrammar() called in page.tsx ✓; getDueCards/dueCount in NguPhapClient ✓; "Nhận diện" button with disabled guard ✓; random example selection (Math.random) ✓; 4 MCQ choices (1 correct + 3 distractors, shuffled) ✓; reviewCard(id, isCorrect ? 3 : 1) ✓; setTimeout 1000ms ✓; onSessionComplete toast "Hoàn thành phiên học! Đã ôn N mẫu." ✓; getDisplayChar(currentExample, scriptMode) — no direct .simplified/.traditional access ✓; all hooks before early return (P8) ✓. Docs fix: corrected pattern count from "37" to "32" in CHANGELOG.md + REQUIREMENTS.md (parser filters by ---+Cấu trúc: blocks; 38 ### headers but only 32 pass filter). Added test scenarios 49–61. Items 50–61 require JS execution in live browser. | PASS (static + code checks). Manual: verify items 49–61 on live iPad Safari. |
| 2026-06-15 | QA (Claude) | fix 2.1.1: Ôn tập session crash — Root cause confirmed: `OntapClient.dueCards` useMemo depends on Zustand `cards`; calling `reviewCard()` during a session shrinks the memo → new smaller `cards` prop propagates to `VocabSession` → `dueCards` shrinks inside session → `index` out of bounds → TypeError. Fix: snapshot `[...dueCards]` into `frozenSessionCards` state on session start; `VocabSession` receives stable array for full session. P1 (build ✓ — TypeScript clean, 4 routes). P2 (deploy in-progress at QA time, commit f8d3e002). Code-level: `frozenSessionCards` state declared before any early return (P8 ✓); passed as `cards` prop to `VocabSession`; cleared on both session complete and ← Quay lại; start button sets `setFrozenSessionCards([...dueCards])` then `setSessionStarted(true)`. Added BLOCKER item 72 (rate first card — no crash). Updated item 66 (word list removed in prior commit 1660c32). Manual: verify item 72 on live site after deploy. |
| 2026-06-15 | QA (Claude) | FR-11 (2.1.0): Ôn Tập (Due-Word Review) — P1 (build ✓ from Phase 3, 4 static routes: `/`, `/_not-found`, `/on-tap`, `/tu-vung`), P2 (live URL loads — "Đang tải..." Suspense fallback confirmed, deploy inferred success from commit 0598345), P3 (live URL ✓). Code-level AC verification (all 13 ACs): orange badge conditional `dueCountByLesson[l] > 0` (AC-1) ✓; green `-top-1.5 -right-1.5` + orange `-bottom-1.5 -right-1.5` non-overlapping (AC-2) ✓; "Ôn tập" Link href="/on-tap" + inline count (AC-3) ✓; orange badge `router.push(\`/on-tap?lesson=${l}\`)` (AC-4) ✓; lesson filter `setSelectedLesson` → `dueCards` useMemo reactive update (AC-5) ✓; `getOverdueReviewedCards` filters reps>0+isDue; rows show `getDisplayChar`+`meaning` (AC-6) ✓; VocabSession receives `cards={dueCards}` (AC-7) ✓; `clearSession(lesson)` before `onSessionComplete` + toast (AC-8) ✓; `activeSessions` in Zustand persist — survives page close (AC-9) ✓; `inProgressLessons.has(l)` → `bg-amber-50 border-amber-400` (AC-10) ✓; key=0 session distributes amber per card.lesson (AC-11) ✓; empty state "Không có từ nào cần ôn!" (AC-12) ✓; `activeSessions: Record<number, {cardIds, startedAt}>` in ProgressState + persist (AC-13) ✓. BLOCKER-19 updated: nav bar removed in v2.0.0 — item marked N/A. Added test scenarios 62–71. Items 62–71 require JS execution in live browser. | PASS (static + code checks). Manual: verify items 62–71 on live iPad Safari. |
| 2026-06-16 | QA (Claude) | fix 2.2.1: Last-card Wrong → "Kiểm tra" button hidden — Playwright local dev (localhost:3000, Bài 1 Luyện viết, 16-card session). Submitted empty Wrong on all 16 cards in sequence including the last card. BLOCKER #83: Kiểm tra visible after last-card Wrong re-queue ✅. Textarea disabled=null (enabled) ✅. Textarea value="" (fresh remount) ✅. 2nd re-queue of same card also stays interactive ✅. BLOCKER #73: Kiểm tra never had disabled attr ✅. BLOCKER #6: wrong text "测" → red ✗ "Sai rồi" banner + "Đáp án đúng:" revealed ✅. Screenshot confirms fresh WritingInput with empty textarea and blue Kiểm tra button after last-card re-queue. | PASS |
| 2026-06-15 | QA (Claude) | FR-12 (2.2.0): Binary Right/Wrong SRS Rating — P1 (build ✓ — commit fa0ea63, TypeScript clean). P2 (GitHub Actions — gh CLI unavailable; inferred from commit fa0ea63 on main). P3 (live URL ✓ — "Đang tải..." Suspense fallback, expected behavior). Code-level AC verification (all 9 ACs): AC-1 — grep for SRSRating/Lại/Khó/Tốt/Dễ in VocabSession + app/ returns 0 hits ✓; AC-2 — WritingInput.tsx "Kiểm tra" button rendered without `disabled` attr ✓; AC-3 — `if (!input.trim()) { onResult(false, "") }` empty-input path ✓; AC-4 — normalize+equality check in handleSubmit ✓; AC-5 — MultipleChoice.getStyle() turns correct green + wrong-selected red; onResult → VocabSession.markRight/markWrong ✓; AC-6 — `if (newQueue.length === 0) onSessionComplete()` in markRight ✓; AC-9 — reviewCard(id) calls reviewCard(existing, 3) [Good] in progress-store.ts; ts-fsrs guarantees ≥ 1 day ✓. AC-7/AC-8 behavioral (FSRS not called on Wrong → cards stay due if session exited). BLOCKER items 5 and 6 updated (removed stale "SRS rating buttons" reference). Added test scenarios 73–82. Items 73–82 require JS execution in live browser. | PASS (static + code checks). Manual: verify items 73–82 on live iPad Safari. |
