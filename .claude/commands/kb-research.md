# /kb-research — Chinese Language Research

> **Research Chinese language questions alongside the customer.**
> Distinct from `/research` (which handles app feature feasibility). Triggered from Phase 3 of `/kb-intake` or directly via `/start`.

Use this skill when the customer has a question about:
- Etymology or character history
- Usage comparison (e.g., two similar words)
- Tone or pinyin explanation
- Grammar pattern analysis
- Example sentence search
- Mandarin vs Cantonese divergence
- HSK classification or register

---

## Step 1 — Understand the Research Question

Restate the question clearly in your own words to confirm understanding.

Identify the category:
- `ETYMOLOGY` — character origin, Classical Chinese roots, historical meaning
- `COMPARATIVE` — two similar words/characters, usage differences
- `PRONUNCIATION` — tone marks, pinyin rules, sandhi, exceptions
- `GRAMMAR` — sentence pattern, particle usage, aspect markers
- `EXAMPLE` — looking for example sentences or real-world usage
- `OTHER` — anything that doesn't fit above

State the category explicitly before proceeding.

---

## Step 2 — Scan Existing KB First

Before researching from memory, check what the KB already says.

1. Search `chinese-learning/knowledge-base/chinese-brain.md` for the character(s) or pattern(s) in question
2. Search `chinese-learning/knowledge-base/chinese-practice-bank.md` for example sentences

Report findings:
> "Here is what the KB already says about [topic]: [quote existing entries, or 'nothing found']"

This prevents duplicating knowledge already in the KB and surfaces any potential corrections.

---

## ⚡ Context Health Check — After Step 2, Before Step 3

Evaluate these signals. If **2 or more** apply, pause and offer `/compact`:

- [ ] Both KB files were scanned in Step 2
- [ ] This `/kb-research` was triggered from inside a `/kb-intake` session (context already heavy from intake phases)
- [ ] Prior `/lesson`, `/kb-intake`, or `/intake` session happened earlier in this conversation

If triggering: output this message, then stop:
> ⚡ **Context Health Check:** Both KB files were scanned and this session already has accumulated context. Consider running `/compact` before the research phase. After compaction, reply "continue" and I will resume at Step 3 with the research answer.

If not triggering: proceed directly to Step 3.

---

## Step 3 — Research

Answer the customer's question using available knowledge.

Rules:
- Cite authoritative context when relevant: HSK level, Classical Chinese origin, Mandarin vs Cantonese divergence, formal vs colloquial register, standard vs regional usage
- If uncertain about a linguistic fact, say so explicitly — do not fabricate
- For pronunciation questions, show the full pinyin with tone marks, not just syllables
- For comparative questions, give concrete examples showing the difference in context
- For grammar questions, show the pattern structure and at least two example sentences

---

## Step 4 — Surface KB Implications

After answering, evaluate whether the research reveals an action needed in the KB:

| Finding | Action |
|---------|--------|
| Entry is missing from KB | Flag: "This is not yet in the KB — worth adding" → offer `/kb-intake` |
| Entry exists but has an error | Flag: "KB entry for [X] appears incorrect — this may need a correction" → offer `/kb-intake` with `CORRECTION` type |
| Entry exists and is correct | State: "The KB already captures this correctly — no action needed" |
| Research reveals an additional meaning not in KB | Flag: "The KB has [X] but is missing this additional meaning (KBP-11 case)" → offer `/kb-intake` |

---

## Step 5 — Hand Off

If KB action is needed:
> "Want me to open a `/kb-intake` session to apply this finding to the KB?"

If no KB action needed:
> "No KB changes needed — the existing entries are correct."

If this session was triggered from inside `/kb-intake` Phase 3: return control to the intake flow after the hand-off message, offering to continue from where the intake left off.
