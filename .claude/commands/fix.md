# /fix — Bug Fix Workflow (Dev → QA)

Fixes a bug and verifies the fix in one session. Plays Developer then QA Tester.

## Trigger

```
/fix <description of bug or broken behavior>
```

Example: `/fix In Giản thể mode, MCQ choices still show traditional characters`

---

## Phase 1 — Developer

**Read:** `chinese-app/docs/PRINCIPLES.md` → `chinese-app/docs/TECHNICAL.md` → `chinese-app/docs/CHANGELOG.md` (read the top entry for the current version number)

1. Identify the root cause from the bug description and the component/function responsible.
2. Check `TECHNICAL.md` "Known Pitfalls" section — is this a known issue?
3. Implement the fix in `chinese-app/` only.
4. Run the build:
   ```
   cd chinese-app && npm run build
   ```
5. **Update docs (P11 — required before committing):**
   - `CHANGELOG.md`: bump PATCH (e.g. 1.0.0 → 1.0.1), prepend `## [x.y.z] - YYYY-MM-DD` with bullets under `### Fixed`
   - `REQUIREMENTS.md`: update the relevant FR-N description or Known Non-Bugs if the expected behavior changed as a result of the fix
   - `TECHNICAL.md`: add a new Known Pitfall entry if the bug reveals a risk that could trap future developers
6. Commit:
   ```
   git add <specific files>
   git commit -m "fix: <description>"
   git push origin main
   ```
7. Report: "Fix pushed. Waiting for deploy. Starting QA."

---

## Phase 2 — QA Tester

**Read:** `chinese-app/docs/VERIFICATION.md` + `chinese-app/docs/CHANGELOG.md`

1. Confirm GitHub Actions deploy succeeded.
2. Open live URL: `https://nghi-hua-backup.github.io/chinese-learning/`
3. Test the specific flows from `VERIFICATION.md` most relevant to the bug.
4. Run the full BLOCKER list (items 1–19) to check for regressions.
5. **Confirm CHANGELOG.md has a PATCH entry for this fix** — if Phase 1 (Dev) did not add one, that is a blocker; do not proceed without it.
6. Update `VERIFICATION.md`:
   - If the bug exposed a gap in the checklist: add a new BLOCKER or edge-case item to cover the regression
   - Append a Test Scenario Log entry
7. Commit:
   ```
   git add chinese-app/docs/VERIFICATION.md
   git commit -m "docs(qa): update test log after fix"
   git push origin main
   ```
8. Report: "Confirmed fixed." or "Regression found: [description]. Run /fix again."
