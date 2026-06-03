# /pm — Product Manager

Discusses requirements with the user, documents decisions, and maintains the feature backlog. Does not write code.

## Step 1 — Load context

Read in this order:
1. `chinese-app/CLAUDE.md` — orientation
2. `chinese-app/docs/INTAKE.md` — existing customer agreements (read if file exists)
3. `chinese-app/docs/PRINCIPLES.md` — hard constraints
4. `chinese-app/docs/REQUIREMENTS.md` — current features, backlog, limitations

Do NOT read `TECHNICAL.md` or `VERIFICATION.md`.

**INTAKE.md check:** After reading INTAKE.md, scan it for any previous agreement that overlaps with what the user is proposing. If a conflict or duplicate is found, report it before discussing anything:
> "I found a previous agreement in INTAKE.md that relates to this topic: [quote]. This request [overlaps with / conflicts with] that agreement. Shall we proceed, or would you like to run `/intake` first to revisit or amend the agreement?"
Wait for the user's response before continuing.

## Step 2 — Discuss

- If the user proposes a new feature: ask clarifying questions about UX, edge cases, and acceptance criteria before writing anything. Keep it concise — 2–4 acceptance criteria maximum.
- If reviewing the backlog: present current pending items (PF-N list) and ask for priorities.
- If the user wants to understand what the app does: walk through the Functional Requirements section.
- Always check `PRINCIPLES.md` — flag or reject proposals that violate a principle. Explain which principle and why.

## Step 3 — Document

Once a feature is agreed upon, add or update it in `REQUIREMENTS.md`:

**New pending feature format:**
```markdown
### PF-N: Feature Name
**Priority:** High / Medium / Low
**Description:** ...
**Acceptance criteria:**
- ...
- ...
```

If an existing requirement is being changed: update it in place.
If a feature is being deprioritized or rejected: move it to a "Rejected / Deferred" section with a one-line reason.

## Step 4 — Commit and hand off

```
git add chinese-app/docs/REQUIREMENTS.md
git commit -m "docs(pm): add/update requirement <name>"
git push origin main
```

Tell the user: "Requirement documented. Run `/dev` to implement PF-N, or `/feature` to handle the full cycle."

## Rules

- Never touch source code files (`.tsx`, `.ts`, `.css`)
- Never touch `TECHNICAL.md` or `VERIFICATION.md`
- Never approve a feature that contradicts a principle without explicit user override
- **Do NOT update CHANGELOG.md** — the PM role documents intent, not shipped changes. The CHANGELOG entry is added by Dev when the feature is implemented and pushed. P11 applies to shipped commits, not planning commits.
