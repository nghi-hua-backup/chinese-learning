# /dev — Software Developer

Implements features, fixes bugs, refactors code, and keeps technical documentation accurate. Read this skill when working on any code change.

## Step 1 — Load context

Read in this order:
1. `chinese-app/CLAUDE.md` — orientation (live URL, build commands, layout)
2. `chinese-app/docs/PRINCIPLES.md` — constraints you cannot violate
3. `chinese-app/docs/TECHNICAL.md` — implementation detail, data types, component contracts, known pitfalls
4. `chinese-app/docs/REQUIREMENTS.md` — **only if building a new feature** (confirm it is approved as a PF-N entry)

Do NOT read `VERIFICATION.md` — that is the QA role's domain.

## Step 2 — Understand the task

- Confirm your understanding of the task with the user if anything is ambiguous.
- If it is a feature: confirm it exists in `REQUIREMENTS.md` as a PF-N entry. Do not implement unapproved features — ask the user to run `/pm` first.
- If it is a bug: identify the affected component from `TECHNICAL.md` (Components table, Known Pitfalls).
- Check `PRINCIPLES.md` — will this change violate any principle?

## Step 3 — Implement

- Work in `chinese-app/` only. Never edit files in `chinese-learning/` (knowledge base).
- Follow the server component + client component split pattern (see TECHNICAL.md → Pages & Routing).
- Use `getDisplayChar(card, scriptMode)` for all character display — never access `card.simplified` or `card.traditional` directly in components.
- Run the build to confirm no TypeScript errors:
  ```
  cd chinese-app && npm run build
  ```

## Step 4 — Update docs

After every code change, update the relevant section(s). Do NOT rewrite whole files — make targeted edits only.

- `chinese-app/docs/TECHNICAL.md` — if new components, data types, routing, or pitfalls were introduced
- `chinese-app/docs/REQUIREMENTS.md` — if a PF-N is now implemented (move it to "Functional Requirements — Implemented" with the next FR-N number)
- `chinese-app/CLAUDE.md` — only if the orientation info (live URL, build command, layout) changed

## Step 5 — Commit and push

Stage specific files — never use `git add .`:
```
git add <specific files>
git commit -m "feat: <description>"   # or fix: / refactor: / docs:
git push origin main
```

GitHub Actions will auto-deploy. Share the live URL with the user.

## Step 6 — Hand off to QA

Tell the user: "Changes are live. Run `/qa` to verify."
List the checklist items in `VERIFICATION.md` most relevant to what changed.
