# /kb-intake — KB Service Provider Workflow

> **For interactive KB updates with the full Gatekeeper → Debator → Writer → Checker pipeline.**
> Triggered by `/start` for corrections, additions, teacher notes, or mixed KB updates.

---

## Phase 0 — Gatekeeper: Context Load

Read in this exact order. Do NOT skip any step:

1. `chinese-learning/docs/KB-PRINCIPLES.md` — 11 inviolable rules
2. `chinese-learning/knowledge-base/chinese-brain-guide.md` — formatting reference
3. `chinese-learning/docs/KB-INTAKE.md` — scan for previous decisions on the same topic (if file exists)
4. Targeted scan of `chinese-learning/knowledge-base/chinese-brain.md` — grep for every character/word mentioned in the customer input
5. Targeted scan of `chinese-learning/knowledge-base/chinese-practice-bank.md` — grep for duplicate practice sentences

Record which characters were found and which were not found. This scan result feeds directly into Phase 2.

---

## Phase 1 — Gatekeeper: Input Analysis

Classify the customer input into one or more types:

| Type | Description |
|------|-------------|
| `NEW_LESSON` | Lesson images or extracted lesson content (Bài N) |
| `CORRECTION` | Fixing existing entry (wrong pinyin, wrong meaning, wrong 繁體) |
| `ADDITION` | Non-lesson content (teacher note, cultural note, grammar clarification) |
| `REORGANIZATION` | Structural change (merge sections, reorder, rename headings) |
| `MIXED` | Combination of the above |

Map every item in the input to one of these types. List them explicitly before Phase 2.

---

## Phase 2 — Debator: Full Internal Debate

Output the complete debate log to the customer. Do not summarize or hide any part of it.

```
⚔️ Debator debate log:

Item 1: <character or item name>
  PROPOSAL: [what Gatekeeper plans to do — add / correct / append / skip]
  DEBATOR: [Objection with evidence from Phase 0 scan, or "No objection"]
  RESPONSE: [Counter-argument or "need customer input"]
  VERDICT: Proceed / Proceed with customer confirmation / Block

Item 2: ...

Overall verdict: Proceed with questions / Block pending resolution
```

Challenge every item against these criteria:
- Is this item already in the KB? (check Phase 0 scan results — if found, is it a true duplicate or additional meaning per KBP-11?)
- Does the pinyin look correct? (flag unusual tones or combinations)
- Does the 繁體 form look right? (flag if it matches simplified, which would mean `—` not a copy)
- Does the meaning conflict with an existing entry?
- Is the source traceable? (KBP-6)
- Which Bài does this belong to? (KBP-4)
- Does this item belong in `chinese-brain.md` or `chinese-practice-bank.md`? (KBP-9)
- **If the source has a "Câu thông dụng" section (social phrases: chào hỏi, tạm biệt, xin lỗi, cảm ơn, xã giao):** these must go to § 6 of `chinese-brain.md`, not only to the practice bank — flag if this dual routing is missing (KBP-9 exception)
- If the item exists but has a new meaning → flag as KBP-11 case, require customer confirmation before appending

---

## ⚡ Context Health Check #1 — After Phase 2, Before Phase 3

Evaluate these signals. If **2 or more** apply, pause and offer `/compact` before continuing:

- [ ] `chinese-brain.md` was read/scanned in Phase 0
- [ ] Prior `/start`, `/lesson`, `/kb-intake`, or `/intake` session happened earlier in this conversation
- [ ] Debator debate was long (5+ items challenged or flagged)
- [ ] Input has 20+ vocabulary items

If triggering: output this message, then stop:
> ⚡ **Context Health Check:** This session has accumulated significant context (KB files read + [matching signals]). Before we move to customer questions, consider running `/compact` to compress history. After compaction, reply "continue" and I will resume at Phase 3.

If not triggering: proceed directly to Phase 3.

---

## Phase 3 — Customer Discovery: Clarification

**Always conduct customer discovery — even when the Debator has no concerns.**

Start by stating your understanding of the input clearly. Then ask clarifying questions.

Structure:
1. "Here is my understanding of your input: [summary]"
2. Confirm source: which lesson / which teacher note / which reference?
3. Ask about scope: "Are there related items not mentioned here? (e.g., more meanings for this word, a related grammar pattern, etc.)"
4. For each Debator concern (KBP-11 cases, uncertain pinyin, unclear Bài assignment): ask the specific question
5. Group questions by item to keep it scannable

**Research question handling:** If the customer asks a question that is etymological, grammatical, comparative, or requires linguistic research — pause and offer:
> "This looks like a research question — shall I run `/kb-research` on this alongside you before we continue with the intake?"

Wait for customer answers before moving to Phase 4.

---

## Phase 4 — Agreement + KB-INTAKE.md Entry

Summarize the agreed scope based on the customer's answers. Then append a new entry to `KB-INTAKE.md`:

```markdown
## [YYYY-MM-DD] — <Topic>

**Status:** Agreement reached
**Source:** <lesson image filename / teacher note / correction / other>

### Input summary
<one paragraph describing what the customer provided>

### Agreed scope
<bulleted list of every item agreed to write>

### Out of scope (agreed)
<items explicitly set aside, with reason>

### Debator concerns resolved
<how each flagged item was resolved — include KBP-11 cases>

### Open questions resolved
<answers the customer gave to Phase 3 questions>
```

Commit the intake entry:
```
git add chinese-learning/docs/KB-INTAKE.md
git commit -m "docs(kb-intake): record agreement — <topic>"
```

---

## ⚡ Context Health Check #2 — After Phase 4, Before Phase 5

Evaluate these signals. If **2 or more** apply, pause and offer `/compact`:

- [ ] Phase 3 was long (multiple Q&A exchanges, or a `/kb-research` tangent was run)
- [ ] A prior CHC was already offered earlier in this session
- [ ] Input has 15+ items to write
- [ ] Both `chinese-brain.md` and `chinese-practice-bank.md` were read in Phase 0

If triggering: output this message, then stop:
> ⚡ **Context Health Check:** Writing phase is about to begin on a large input. Consider running `/compact` first. After compaction, reply "continue" and I will resume at Phase 5.

If not triggering: proceed directly to Phase 5.

---

## Phase 5 — Writer

Execute all agreed changes strictly per KB-PRINCIPLES.md:

| Content type | Target file | Section |
|---|---|---|
| New vocab | `chinese-brain.md` | Under `### Bài N` in **Từ vựng** |
| Grammar patterns | `chinese-brain.md` | **Ngữ pháp** |
| Pronunciation rules | `chinese-brain.md` | **Phát âm** |
| Corrections | `chinese-brain.md` | Add corrected row; comment old row `<!-- corrected YYYY-MM-DD -->` |
| Additional meanings (KBP-11) | `chinese-brain.md` | Append to existing entry row |
| **Câu thông dụng** — social phrases (chào hỏi, tạm biệt, xin lỗi, cảm ơn, xã giao) | `chinese-brain.md` | **§ 6 Câu thông dụng** — under the appropriate sub-group; add to existing group or create new group if none fits (KBP-9 exception) |
| Practice sentences / dialogues | `chinese-practice-bank.md` | Under `### Bài N` |
| Synthesis block (NEW_LESSON) | `chinese-practice-bank.md` | Under `## Luyện tập tổng hợp` |

Always:
- Update `> **Cập nhật lần cuối:**` in every file touched (KBP-7)
- Never delete old rows (KBP-3)
- Never add an entry that was agreed to be out of scope

After writing, commit to git (enables Checker to re-read from disk after any `/compact`):
```
git add chinese-learning/knowledge-base/chinese-brain.md
git add chinese-learning/knowledge-base/chinese-practice-bank.md
git commit -m "kb(draft): write phase — <topic>"
```

---

## ⚡ Context Health Check #3 — After Phase 5, Before Phase 6 (MOST CRITICAL)

Phase 5 fully reads and writes both large KB files (52KB + 80KB). The context accumulation here is the highest in the entire workflow.

Evaluate these signals. If **1 or more** apply, strongly recommend `/compact`:

- [ ] Both `chinese-brain.md` and `chinese-practice-bank.md` were fully written in Phase 5
- [ ] 20+ entries were written in Phase 5
- [ ] Any prior CHC was offered in this session

If triggering (very likely after any non-trivial write): output this message, then stop:
> ⚡ **Context Health Check (Critical):** Both KB files were just fully written. This is the heaviest context point in the workflow. Strongly recommend running `/compact` before the Checker audit. The Phase 5 commit is already saved to git — after compaction, the Checker will re-read from disk and no work will be lost. Reply "continue" after compaction to resume at Phase 6.

If not triggering (rare — only for tiny single-item writes): proceed directly to Phase 6.

---

## Phase 6 — Checker

Re-read the committed files from disk. Cross-check every written entry against the original customer input and the agreed scope from Phase 4.

Audit checklist:
- [ ] Did every agreed item get written? (count items agreed vs. items written)
- [ ] KBP-1: Both scripts present on all new entries?
- [ ] KBP-2: No unintended duplicates introduced?
- [ ] KBP-3: Old rows preserved (corrections only added rows, did not delete)?
- [ ] KBP-4: All entries under correct `### Bài N` heading?
- [ ] KBP-5: Pinyin marks present? Any `[pinyin?]` flags needed?
- [ ] KBP-6: Source traceable for all entries?
- [ ] KBP-7: Timestamps updated on all touched files?
- [ ] KBP-9: Nothing landed in the wrong file (brain vs practice bank)?
- [ ] KBP-9 exception: If source had a "Câu thông dụng" section — were those social phrases written to § 6 of `chinese-brain.md`?
- [ ] KBP-11: Additional meaning entries appended (not skipped), confirmed by customer?

Output the report:
```
✅ Checker report:
- Added: X vocab entries, Y grammar patterns, Z practice sentences
- Corrected: N entries (old rows preserved with comment)
- Skipped (true duplicate, no new meaning): M entries — [list them]
- Appended (additional meaning on existing entry, KBP-11): P entries — [list them]
- KBP violations: [list any] or none
- Pinyin flagged [pinyin?]: [list] or none
- Timestamps updated: [list files] or none
```

If any KBP violation is found: fix it before proceeding to Phase 7.

---

## Phase 7 — Commit

Update CHANGELOG.md (KBP-8), then commit and push everything together:

1. Read the current top entry in `chinese-app/docs/CHANGELOG.md` to get the current version.
2. Bump PATCH version (e.g., 1.5.0 → 1.5.1).
3. Prepend a new entry:
   ```
   ## [x.y.z] - YYYY-MM-DD
   ### Changed
   - KB: <topic> — X vocab entries, Y corrections, Z practice sentences
   ```

Then commit:
```
# If the Phase 0 source is a file under chinese-learning/references/ (e.g. Bai-9.md), add it:
git add chinese-learning/references/<source-file-if-applicable>
git add chinese-learning/knowledge-base/chinese-brain.md
git add chinese-learning/knowledge-base/chinese-practice-bank.md
git add chinese-learning/docs/KB-INTAKE.md
git add chinese-app/docs/CHANGELOG.md
git commit -m "kb: <summary of changes>"
git push origin main
```

> **Reference file rule:** If the input source is a `.md` file in `chinese-learning/references/` (e.g. `Bai-9.md`), always include it in the final `git add` so the lesson reference is committed together with the KB update. Skip this step only if the source is an image file or an external note with no corresponding reference file.

Notify the customer:
> "KB updated. [Summary from Checker report]. CHANGELOG bumped to x.y.z."
