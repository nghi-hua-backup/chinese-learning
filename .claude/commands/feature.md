# /feature — Full Feature Workflow (PM → Dev → QA)

Implements a new feature end-to-end in one session. Plays three roles in sequence: Product Manager, Developer, then QA Tester.

## Trigger

```
/feature <feature description>
```

Example: `/feature Add audio pronunciation — tap a button to hear the character read aloud`

---

## Phase 1 — Product Manager

**Read:** `chinese-app/docs/PRINCIPLES.md` → `chinese-app/docs/REQUIREMENTS.md`

1. Check that the feature does not violate any principle in `PRINCIPLES.md`. If it does, tell the user which principle and ask them to reconsider or explicitly override it.
2. Check if a similar feature already exists in `REQUIREMENTS.md` (implemented or pending).
3. Clarify acceptance criteria with the user if they are not clear from the description. Keep it to 2–4 criteria max.
4. Add the feature to `REQUIREMENTS.md` under "Pending Features" with priority, description, and acceptance criteria. Use the next available PF-N number.
5. Commit `REQUIREMENTS.md`:
   ```
   git add chinese-app/docs/REQUIREMENTS.md
   git commit -m "docs(pm): add PF-N: <feature name>"
   ```
6. Report: "Requirement documented as PF-N. Starting implementation."

---

## Phase 2 — Developer

**Read:** `chinese-app/docs/TECHNICAL.md` + `chinese-app/docs/CHANGELOG.md` (PRINCIPLES.md and REQUIREMENTS.md already read in Phase 1)

1. Identify which files need to change based on the feature.
2. Implement the feature in `chinese-app/` only — never edit `chinese-learning/` source files.
3. Follow existing patterns: server component (`page.tsx`) + client component (`*Client.tsx`) split.
4. Use `getDisplayChar(card, scriptMode)` for all character display.
5. Run the build to verify no TypeScript errors:
   ```
   cd chinese-app && npm run build
   ```
6. **Update docs (P11 — required):**
   - `REQUIREMENTS.md`: move PF-N from "Pending Features" to "Functional Requirements — Implemented"; assign the next FR-N number; update NFRs if affected
   - `TECHNICAL.md`: add new components, data types, pitfalls, or architectural patterns introduced
   - `CHANGELOG.md`: read the current top entry to get the latest version, bump MINOR (e.g. 1.0.0 → 1.1.0), prepend `## [x.y.0] - YYYY-MM-DD` with bullets under `### Added`
7. Commit all changes together (code + docs):
   ```
   git add <specific files>
   git commit -m "feat: <feature description>"
   git push origin main
   ```
8. Report: "Implementation complete. Pushed to main. Waiting for GitHub Actions deploy."

---

## Phase 3 — QA Tester

**Read:** `chinese-app/docs/VERIFICATION.md` + `chinese-app/docs/CHANGELOG.md`

1. Check GitHub Actions status — confirm the deploy succeeded (green check on latest commit).
2. Open the live URL: `https://nghi-hua-backup.github.io/chinese-learning/`
3. Run the relevant BLOCKER flows from `VERIFICATION.md` that touch the new feature.
4. Verify each acceptance criterion from PF-N (now in REQUIREMENTS.md as FR-N).
5. Run the full BLOCKER list (items 1–19) to check for regressions.
6. **Confirm CHANGELOG.md has an entry for this release** — if Phase 2 (Dev) did not add one, add it now before proceeding. A missing CHANGELOG entry is a blocker.
7. Add test scenarios for the new feature to `VERIFICATION.md` under the appropriate section.
8. Append a Test Scenario Log entry in `VERIFICATION.md`.
9. Commit `VERIFICATION.md`:
   ```
   git add chinese-app/docs/VERIFICATION.md
   git commit -m "docs(qa): add test scenarios for <feature name>"
   git push origin main
   ```
10. Report pass/fail summary. If any BLOCKER fails: "Issue found: [description]. Run /fix to address."
