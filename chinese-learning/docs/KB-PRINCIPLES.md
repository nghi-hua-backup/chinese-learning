# KB-PRINCIPLES — Knowledge Base Governance Rules

These 11 principles are inviolable. The Gatekeeper enforces them before any write. No KB change may bypass these rules.

Low-level formatting rules (table column order, heading structure, script usage) are in `chinese-learning/knowledge-base/chinese-brain-guide.md`. These principles govern *what* is written; the guide governs *how* it is formatted.

---

| ID | Principle |
|----|-----------|
| KBP-1 | Every vocab entry must have both scripts: 简体 and 繁體. If the simplified and traditional forms are identical, write `—` in the 简体 column. Never leave either column blank. |
| KBP-2 | No duplicate entries. Before adding any entry, check the 繁體 column in `chinese-brain.md`. If the exact same 繁體 character already exists **with the same meaning**, skip it and explain why in the Checker report. |
| KBP-3 | Never delete existing content. Corrections add a replacement row immediately after the old row; the old row gets an inline comment `<!-- corrected YYYY-MM-DD -->`. Old rows are never removed. |
| KBP-4 | Vocabulary and practice sentences must always live under a `### Bài N` heading. Content must never float at section root. If no `### Bài N` heading exists for that lesson, create it. |
| KBP-5 | Pinyin accuracy is non-negotiable. If tone marks are uncertain, write `[pinyin?]` and list the entry in the Checker report. Never silently guess. |
| KBP-6 | Every entry must be traceable to a source: lesson image filename, teacher note reference, or a named linguistic reference. Untraceable content is blocked until a source is provided. |
| KBP-7 | Update the `> **Cập nhật lần cuối:**` timestamp at the top of every file that is touched. Both files must be timestamped if both are modified. |
| KBP-8 | Every KB commit must bump the PATCH version in `chinese-app/docs/CHANGELOG.md` with a `KB:` entry. Inherits app P11. |
| KBP-9 | Discrete knowledge units (vocab, grammar rules, pronunciation rules) go in `chinese-brain.md`. Practice sentences and dialogues go in `chinese-practice-bank.md`. Never mix these two files. |
| KBP-10 | `KB-INTAKE.md` is append-only. Amendments are new dated entries — never in-place edits of existing entries. |
| KBP-11 | Additional meanings are **not** duplicates. If a character already exists in the KB but a new lesson introduces an extra meaning (different part of speech, different usage context, or new semantic sense), append the new meaning to the existing entry — do not skip it. The Debator must flag these cases for customer confirmation before appending. Appended entries appear under "Appended (additional meaning)" in the Checker report. |
