# /qa — QA Tester

Verifies the quality of the deployed app. Runs the checklist, documents findings, and updates the test log.

## Step 1 — Load context

Read in this order:
1. `chinese-app/CLAUDE.md` — live URL and orientation
2. `chinese-app/docs/VERIFICATION.md` — the checklist
3. `chinese-app/docs/CHANGELOG.md` — confirm the latest entry matches the change being tested

Do NOT read `TECHNICAL.md` or `REQUIREMENTS.md`.
Read `PRINCIPLES.md` only if you suspect a principle is being violated by a behavior you observe.

## Step 2 — Pre-flight

1. Check GitHub Actions status — confirm the latest commit deployed successfully (green check).
2. Confirm the live URL responds: `https://nghi-hua-backup.github.io/chinese-learning/`

## Step 3 — Run the checklist

Work through `VERIFICATION.md` systematically:
- **Pre-flight** checks first (P1–P3)
- **BLOCKER flows** next (items 1–19) — stop immediately if any crash or wrong behavior is found
- **Edge cases** last (E1–E5)

If the user specified a scope (e.g., `/qa script mode`), focus on the relevant items but still run the full BLOCKER list.

## Step 4 — Document findings

For each failure, record:
- Checklist item number
- Actual behavior vs expected behavior
- Steps to reproduce
- Severity: **BLOCKER** | **MAJOR** | **MINOR**

## Step 5 — Verify doc-sync (P11 gate)

Before updating VERIFICATION.md, confirm:

1. **CHANGELOG.md** has an entry for the change being tested. If missing: flag it as a blocker and do not proceed until Dev adds it.
2. **REQUIREMENTS.md** reflects the current behavior — confirm no FR-N descriptions are stale relative to what the live app does. If stale: flag it for Dev to fix before signing off.
3. **TECHNICAL.md** — if the change involved new components or implementation details, confirm they are documented. If not: flag for Dev.

## Step 6 — Update VERIFICATION.md

1. Append an entry to the Test Scenario Log:
   ```
   | YYYY-MM-DD | QA | Items N–M checked | Issues: [description or "none"] |
   ```
2. If a new feature was just deployed and has no checklist coverage yet: add test scenarios for it under the appropriate section.
3. If the change fixed a bug that exposed a checklist gap: add a new item to prevent the regression from going undetected in future runs.

## Step 7 — Commit and report

```
git add chinese-app/docs/VERIFICATION.md
git commit -m "docs(qa): test log YYYY-MM-DD"
git push origin main
```

Report summary: "X/Y items passed. Issues: [list]."
For each BLOCKER or MAJOR: "Run `/fix <description>` to address."

## Rules

- Always test the **live URL**, not localhost, unless explicitly testing a pre-deploy build
- Never edit source code files — report issues, do not fix them
- One log entry per QA session (not per item)
