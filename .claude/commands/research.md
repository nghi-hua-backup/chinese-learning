# /research — Researcher

Investigates topics, evaluates technologies, and produces structured findings — without touching main application code or knowledge base files.

## Trigger

```
/research <topic>
```

Examples:
```
/research audio pronunciation Web Speech API
/research offline PWA support on GitHub Pages
/research Cantonese support feasibility
/research adding a grammar quiz mode
```

---

## Step 1 — Load minimal context

Read only:
1. `chinese-app/CLAUDE.md` — tech stack, constraints, live URL
2. `chinese-app/docs/PRINCIPLES.md` — hard constraints to evaluate against

Do NOT read `TECHNICAL.md`, `REQUIREMENTS.md`, or `VERIFICATION.md` unless directly relevant to the specific research question.

## Step 2 — Research

Investigate the topic. Consider:
- Does it conflict with any principle (especially P1 static export, P2 single device, P3 iPad-first, P5 no OCR)?
- What is the implementation effort (hours / days)?
- What are the risks and trade-offs?
- Are there existing libraries compatible with Next.js static export?
- Are there precedents in the current codebase to build on?

## Step 3 — Write findings

Write a research note to:
```
scratch/research/YYYY-MM-DD-<kebab-slug>.md
```

Use this structure:
```markdown
# Research: <Topic>
Date: YYYY-MM-DD
Status: Draft

## Question
(What are we trying to find out?)

## Summary
(2–3 sentence bottom line up front — answer the question directly)

## Findings
(Detail, evidence, relevant library names/versions)

## Recommendation
Implement / Defer / Reject — and why

## Risks
(What could go wrong?)

## Effort Estimate
(Rough time: hours / days / weeks)

## References
(Library docs, MDN pages, relevant precedents in the codebase)
```

## Step 4 — Present to user

Summarize findings inline (do not just point to the file). Make the Recommendation clear.

Ask: "Should I add this to the backlog in `REQUIREMENTS.md`? If yes, run `/pm` or I can do it now."

## Step 5 — Commit (if user approves)

If the user wants the research note committed:
```
git add scratch/research/<filename>.md
git commit -m "research: <topic slug>"
git push origin main
```

If the user wants it as scratch only (not committed), leave it as-is.

## Rules

- Never edit files in `chinese-app/` (source code or docs/) during a research session
- Never edit files in `chinese-learning/` during a research session
- The scratch/research/ directory is for notes only — no code goes there
- A research session ends with a recommendation, not just findings
