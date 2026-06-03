# /feature — Full Feature Workflow (PM → Tech Lead → Dev → QA + UAT)

Implements a new feature end-to-end in one session. Plays four roles in sequence: Product Manager, Tech Lead, Developer, then QA Tester with PM sign-off.

## Trigger

```
/feature <feature description>
```

Example: `/feature Add audio pronunciation — tap a button to hear the character read aloud`

---

## Workflow State — Compaction Resilience

Long workflows can span many tool calls. If the conversation context is compacted mid-workflow, key variables (feature name, PF-N number, commit hashes) may be summarised away. To handle this gracefully:

**At the start of this skill**, write a state checkpoint file:

```
Write to: .claude/workflow-state.md
---
skill: /feature
feature: <feature description>
started: <YYYY-MM-DD>
phase-1-pm: pending
phase-2-techlead: pending
phase-3-dev: pending
phase-4-qa-uat: pending
---
```

**After each phase completes**, update the relevant line in `.claude/workflow-state.md` with `✅ done — <key output>` (e.g. `✅ done — PF-5, commit abc1234`).

**At the start of each phase**, read `.claude/workflow-state.md` first. If you are resuming after context compaction — i.e. you do not have clear recall of what the previous phase produced — the state file gives you the exact PF-N number, commit hash, and feature name needed to continue correctly.

**After Phase 4 completes successfully**, delete `.claude/workflow-state.md`:
```
rm .claude/workflow-state.md
```

`.claude/workflow-state.md` is a temporary scratchpad — it is never committed to git.

---

## Phase 1 — Product Manager

**Read (in this order):**
1. `chinese-app/docs/INTAKE.md` — if it exists, check for conflicts or duplicates
2. `chinese-app/docs/PRINCIPLES.md`
3. `chinese-app/docs/REQUIREMENTS.md`

**INTAKE.md check (do this before anything else):**
- Scan INTAKE.md for any previous agreement that overlaps with this feature request.
- If a conflict or duplicate is found, stop and report it to the user before proceeding:
  > "INTAKE.md records a previous agreement relevant to this feature: [quote]. This request [overlaps with / conflicts with] that agreement. Shall I proceed, or would you like to run `/intake` first to update the agreement?"
- If no conflict: proceed normally.

**Steps:**
1. Check the feature does not violate any principle in `PRINCIPLES.md`. If it does, tell the user which principle and ask them to reconsider or explicitly override it.
2. Check if a similar feature already exists in `REQUIREMENTS.md` (implemented or pending).
3. Clarify acceptance criteria with the user if not clear from the description. Keep it to 2–4 criteria maximum.
4. Add the feature to `REQUIREMENTS.md` under "Pending Features" with priority, description, and acceptance criteria. Use the next available PF-N number.
5. Commit `REQUIREMENTS.md`:
   ```
   git add chinese-app/docs/REQUIREMENTS.md
   git commit -m "docs(pm): add PF-N: <feature name>"
   ```
6. Update `.claude/workflow-state.md`: set `phase-1-pm: ✅ done — <PF-N number>, commit <hash>`
7. Report: "Requirement documented as PF-N. Starting technical analysis."

---

## Phase 2 — Tech Lead

**Read:** `chinese-app/docs/TECHNICAL.md` (PRINCIPLES.md and REQUIREMENTS.md already read in Phase 1)

Before the developer writes a single line of code, analyze the PF-N requirement and document the technical approach.

**Steps:**
1. Identify which existing components, data structures, and patterns from `TECHNICAL.md` apply to this feature.
2. Determine the implementation approach:
   - Which files will change (pages, components, lib)?
   - Is a new component needed, or can an existing one be extended?
   - Any data model changes required?
   - Any risks or known pitfalls from `TECHNICAL.md` that apply?
3. Sketch the interaction flow (text description — no code yet).
4. Flag any PRINCIPLES.md constraints that Dev must keep in mind (especially P1 static export, P7 build-time data, P8 hooks order).
5. Append a tech analysis block directly under the PF-N entry in `REQUIREMENTS.md`:
   ```markdown
   **Tech approach (Tech Lead):**
   - Components affected: ...
   - Implementation strategy: ...
   - Risks / pitfalls: ...
   - P-constraints to watch: ...
   ```
6. If this feature introduces a new architectural pattern not yet in `TECHNICAL.md`, add a brief note to the appropriate section of `TECHNICAL.md` now (so Dev has it as a reference).
7. Commit:
   ```
   git add chinese-app/docs/REQUIREMENTS.md chinese-app/docs/TECHNICAL.md
   git commit -m "docs(techlead): add tech analysis for PF-N: <feature name>"
   ```
8. Update `.claude/workflow-state.md`: set `phase-2-techlead: ✅ done — commit <hash>`
9. Report: "Technical approach documented. Starting implementation."

---

## Phase 3 — Developer

**Read:** `chinese-app/docs/CHANGELOG.md` (PRINCIPLES.md, REQUIREMENTS.md, and TECHNICAL.md already read in Phases 1–2)

1. Re-read the PF-N entry in `REQUIREMENTS.md` — note both the acceptance criteria and the Tech Lead's analysis block.
2. Implement the feature in `chinese-app/` only — never edit `chinese-learning/` source files.
3. Follow existing patterns: server component (`page.tsx`) + client component (`*Client.tsx`) split.
4. Use `getDisplayChar(card, scriptMode)` for all character display.
5. Run the build to verify no TypeScript errors:
   ```
   cd chinese-app && npm run build
   ```
6. **Update docs (P11 — required):**
   - `REQUIREMENTS.md`: move PF-N from "Pending Features" to "Functional Requirements — Implemented"; assign the next FR-N number; update NFRs if affected
   - `TECHNICAL.md`: add new components, data types, pitfalls, or architectural patterns introduced; remove or correct any stale notes from the Tech Lead analysis block if implementation diverged
   - `CHANGELOG.md`: read the current top entry to get the latest version, bump MINOR (e.g. 1.0.0 → 1.1.0), prepend `## [x.y.0] - YYYY-MM-DD` with bullets under `### Added`
7. Commit all changes together (code + docs):
   ```
   git add <specific files>
   git commit -m "feat: <feature description>"
   git push origin main
   ```
8. Update `.claude/workflow-state.md`: set `phase-3-dev: ✅ done — FR-N assigned, commit <hash>`
9. Report: "Implementation complete. Pushed to main. Waiting for GitHub Actions deploy."

---

## Phase 4 — QA Tester + PM Sign-off

**Read:** `chinese-app/docs/VERIFICATION.md` + `chinese-app/docs/CHANGELOG.md`

### QA Tester steps:
1. Check GitHub Actions status — confirm the deploy succeeded (green check on latest commit).
2. Open the live URL: `https://nghi-hua-backup.github.io/chinese-learning/`
3. Run the relevant BLOCKER flows from `VERIFICATION.md` that touch the new feature.
4. Verify each acceptance criterion from PF-N (now FR-N in `REQUIREMENTS.md`).
5. Run the full BLOCKER list (items 1–19) to check for regressions.
6. **Confirm `CHANGELOG.md` has an entry for this release** — if Phase 3 (Dev) did not add one, add it now before proceeding. A missing CHANGELOG entry is a blocker.
7. Add test scenarios for the new feature to `VERIFICATION.md` under the appropriate section.
8. Append a Test Scenario Log entry in `VERIFICATION.md`.
9. Commit `VERIFICATION.md`:
   ```
   git add chinese-app/docs/VERIFICATION.md
   git commit -m "docs(qa): add test scenarios for <feature name>"
   git push origin main
   ```
10. If any BLOCKER fails: stop here, report "Issue found: [description]. Run /fix to address." Do not proceed to PM sign-off until all BLOCKERs pass.

### PM Sign-off (UAT):
Once QA passes all BLOCKERs and acceptance criteria:

1. Re-read the acceptance criteria for this feature (FR-N entry in `REQUIREMENTS.md`).
2. Verify each acceptance criterion one more time on the live URL from a business perspective (not a technical one — does it solve the stated problem?).
3. Cross-check against `INTAKE.md` if the feature originated from a customer intake session — confirm the delivered feature matches the agreed scope.
4. Produce a brief sign-off:
   > "UAT passed. All [N] acceptance criteria met. The feature matches the agreed scope in INTAKE.md (if applicable). Ready for customer use."
5. Update `.claude/workflow-state.md`: set `phase-4-qa-uat: ✅ done`
6. Delete the state file — workflow completed successfully:
   ```
   rm .claude/workflow-state.md
   ```
7. Notify the customer:
   > "✅ **[Feature name] is live.**
   > Live URL: https://nghi-hua-backup.github.io/chinese-learning/
   > What was built: [1–2 sentence summary]
   > How to use it: [brief instructions]
   > All acceptance criteria verified."
