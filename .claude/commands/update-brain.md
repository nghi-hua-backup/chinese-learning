Update the CLAUDE.md in `chinese-app/CLAUDE.md` to reflect the current state of the website.

Steps:
1. Run `git log --oneline -10` in `/Users/admin.katalon/Documents/chinese-learning` to see recent commits.
2. Run `git diff HEAD~1 -- chinese-app/` to see what changed in the last commit (or use `git diff HEAD~N` if the user mentioned multiple recent changes).
3. Read the current `chinese-app/CLAUDE.md`.
4. Read any source files that were changed and are relevant to the documentation (components, pages, lib files).
5. Update `chinese-app/CLAUDE.md` to accurately reflect the current state — add new features, update changed behavior, remove outdated descriptions. Do NOT rewrite the whole file; make targeted edits to only the sections that are affected by the changes.
6. Commit the updated CLAUDE.md with message: `docs: update CLAUDE.md to reflect recent changes`.

Rules for updating CLAUDE.md:
- Keep it accurate and concise — this is a living reference, not a changelog.
- Update the relevant section (Components, Practice Modes, Data Types, Constraints, etc.) rather than adding a history entry.
- If a new feature was added, document it in the appropriate section and remove it from "Pending / Future Enhancements" if it was listed there.
- If a feature was removed or changed, update or remove its entry.
- Do not add dates, commit hashes, or "as of" notes — the file describes the current state only.
