# /fix — Bug Fix Workflow (Dev → QA)

Fixes a bug and verifies the fix in one session. Plays Developer then QA Tester.

## Trigger

```
/fix <description of bug or broken behavior>
```

Example: `/fix In Giản thể mode, MCQ choices still show traditional characters`

---

## Phase 1 — Developer

**Read:** `chinese-app/docs/PRINCIPLES.md` → `chinese-app/docs/TECHNICAL.md`

1. Identify the root cause from the bug description and the component/function responsible.
2. Check `TECHNICAL.md` "Known Pitfalls" section — is this a known issue?
3. Implement the fix in `chinese-app/` only.
4. Run the build:
   ```
   cd chinese-app && npm run build
   ```
5. If the fix reveals a new pitfall (e.g., an unexpected behavior that could trap future developers), add it to the "Known Pitfalls" section of `TECHNICAL.md`.
6. Commit:
   ```
   git add <specific files>
   git commit -m "fix: <description>"
   git push origin main
   ```
7. Report: "Fix pushed. Waiting for deploy. Starting QA."

---

## Phase 2 — QA Tester

**Read:** `chinese-app/docs/VERIFICATION.md`

1. Confirm GitHub Actions deploy succeeded.
2. Open live URL: `https://nghi-hua-backup.github.io/chinese-learning/`
3. Test the specific flows from `VERIFICATION.md` most relevant to the bug.
4. Run the full BLOCKER list (items 1–19) to check for regressions.
5. Append a Test Scenario Log entry in `VERIFICATION.md`.
6. Commit if VERIFICATION.md was updated:
   ```
   git add chinese-app/docs/VERIFICATION.md
   git commit -m "docs(qa): update test log after fix"
   git push origin main
   ```
7. Report: "Confirmed fixed." or "Regression found: [description]. Run /fix again."
