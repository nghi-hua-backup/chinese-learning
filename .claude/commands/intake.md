# /intake — Customer Discovery & Agreement Log

Conducts a structured multi-role discovery session with the customer. Always reads existing agreements first to detect duplicates or conflicts before any new discussion begins. Maintains `INTAKE.md` as a living, append-only agreement log across all sessions.

## Trigger

```
/intake <topic or description>
```

Example: `/intake I want a quiz feature where I test myself on vocabulary`

---

## Step 1 — Check existing agreements (always first)

Read `chinese-app/docs/INTAKE.md` if it exists.

Scan every previous section for:
1. **Duplicates** — Has this topic or a closely related feature already been discussed and agreed upon?
2. **Conflicts** — Does this new request contradict a previous decision, scope boundary, or constraint the customer agreed to?

If any findings, stop and tell the customer before proceeding:

> "I reviewed our previous agreements in INTAKE.md and found a relevant entry:
> **[Quote the specific section]**
> This new request [duplicates / conflicts with] that agreement. Would you like to [revisit the previous agreement / adjust the scope of this request / proceed anyway with a formal amendment]?"

Wait for the customer's response and act on it before continuing.

If no `INTAKE.md` exists yet: skip this step and proceed to Step 2.

---

## Step 2 — Multi-role discovery session

Each role asks its questions in turn. Only move to the next role when the current role has no remaining concerns. If a later role surfaces new ambiguity, loop back to the affected earlier role(s).

---

### PM (Product Manager)
- What problem are you solving? Why does it matter to you?
- Who will use this, and in what context or flow?
- What does success look like — how will you know this is working?
- Are there any hard constraints (scope, performance, compatibility)?

### BA (Business Analyst)
- What are the current pain points in the existing flow this addresses?
- Which screens or data are affected?
- Are there edge cases or exceptional scenarios we need to handle?
- Any data that needs to be created, read, updated, or deleted?

### UI/UX Designer
- Which device and screen is this for? (Default: iPad)
- Are there existing UI patterns in the app this should follow?
- Any layout, font, or color constraints?
- How should errors or empty states look?

### Dev Lead
- Any technical constraints from `PRINCIPLES.md` that apply here?
- Are there dependencies on existing components or data structures?
- Any performance, compatibility, or static-export concerns?

### Tester Lead
- How will we confirm the feature works correctly? (Draft acceptance criteria together.)
- What are the most important user scenarios to verify?
- Are there known edge cases or past bugs that are relevant?

---

## ⚡ Context Health Check — After Discovery Session

The multi-role discovery in Step 2 can involve many exchanges. Before writing the agreement and handing off to `/feature`, estimate the session load:

**Check each signal:**
- Did Step 1 require reading a long existing INTAKE.md?
- Did the Step 2 discovery session involve many back-and-forth rounds across multiple roles?
- Did `/start` run earlier in this same conversation before `/intake`?
- Is this the second or third intake session in this conversation (multiple topics discussed)?

**If 2 or more signals apply** — pause and tell the customer:

> "⚠️ **Context check — before I log the agreement**
>
> This discovery session has generated substantial conversation context. Before I write to INTAKE.md and hand off to `/feature`, it is a good time to compact.
>
> **Recommended: type `/compact` now.** Your agreement is summarized above — nothing is lost. After compacting, reply **continue** and I will write the agreement to INTAKE.md and hand off to `/feature`."

Wait for the customer's reply.

**If fewer than 2 signals apply** — proceed directly to Step 3.

---

## Step 3 — Summarize and confirm

After the session, produce a summary for the customer to review before anything is written:

```
Discovery Summary — [Topic]

Problem: ...
Goals: ...
Agreed scope: ...
Out of scope (agreed): ...
Draft acceptance criteria:
  - AC-1: ...
  - AC-2: ...
Technical notes: ...
Design notes: ...
Open questions (if any): ...
```

Ask: "Does this accurately capture our agreement? Any corrections before I log it?"

Wait for confirmation. Revise if needed. Do not proceed to Step 4 until the customer confirms.

---

## Step 4 — Append to INTAKE.md (never overwrite)

Append a new dated section to `chinese-app/docs/INTAKE.md`. Never edit or delete any previous section — the file is an immutable agreement history.

**Standard agreement entry format:**

```markdown
## [YYYY-MM-DD] — <Topic>

**Status:** Agreement reached

### Problem
...

### Agreed scope
- ...

### Out of scope (agreed)
- ...

### Acceptance criteria (draft)
- AC-1: ...
- AC-2: ...

### Technical notes
...

### Design notes
...

### Open questions
- (none) or list any unresolved items
```

**If this session amends a previous agreement**, add an amendment entry instead of editing the original:

```markdown
## [YYYY-MM-DD] — Amendment: <original topic>

**Amends:** Section "[original date] — [original topic]"
**Specific change:** [Quote the original agreement text being revised]
**New agreement:** ...
**Reason for change:** ...
```

---

## Step 5 — Commit

```
git add chinese-app/docs/INTAKE.md
git commit -m "docs(intake): record agreement — <topic>"
git push origin main
```

---

## Step 6 — Hand off

Tell the customer what happens next:

> "Our agreement has been logged in INTAKE.md. Run `/feature <description>` to begin the full implementation cycle, or `/pm` to refine the requirements further before development starts."

---

## Rules

- INTAKE.md is **append-only** — never edit or remove a previous entry under any circumstance
- **Always complete Step 1** (conflict check) before any discussion begins, even if the new topic seems unrelated to past sessions
- Amendments are new dated entries, not in-place edits to previous sections
- Do not write code or edit any other docs/ file
- Do NOT update `CHANGELOG.md` — INTAKE.md records planning agreements, not shipped changes; CHANGELOG is updated by Dev when code is committed
- If the customer declines to resolve a detected conflict, document their override decision in the new entry before proceeding
