# Chinese Learning App — Project Brain

A personal Chinese learning web app for Nghi Hua, optimized for iPad + Apple Pencil handwriting. Built with Next.js (static export), deployed automatically to GitHub Pages on every push to `main`.

**Live URL:** `https://nghi-hua-backup.github.io/chinese-learning/`
**Build:** `cd chinese-app && npm install && npm run build`
**Dev:** `cd chinese-app && npm run dev` → `http://localhost:3000/chinese-learning`

---

## Repo Layout

```
chinese-learning-1/
├── chinese-app/          ← this Next.js app
│   ├── docs/             ← role-specific documentation (see below)
│   ├── app/              ← Next.js App Router pages
│   ├── components/       ← React UI components
│   └── lib/              ← core logic (parser, SRS, store, utils)
├── chinese-learning/
│   └── knowledge-base/   ← markdown content (vocab, grammar, practice)
└── .claude/commands/     ← Claude skills
```

---

## Role Routing — Read the Right Doc for Your Task

| Role | Files to read |
|---|---|
| **Developer** (`/dev`, `/feature`, `/fix`) | `docs/PRINCIPLES.md` → `docs/TECHNICAL.md` |
| **Product Manager** (`/pm`, `/feature`) | `docs/PRINCIPLES.md` → `docs/REQUIREMENTS.md` |
| **QA Tester** (`/qa`, `/feature`, `/fix`) | `docs/VERIFICATION.md` |
| **Researcher** (`/research`) | `docs/PRINCIPLES.md` only |
| **KB Manager** (`/lesson`, `/kb-update`) | `chinese-learning/knowledge-base/chinese-brain-guide.md` |
| **Dispatcher** (`/start`) | Root `README.md` + this file |

---

## Available Skills

| Command | What it does |
|---|---|
| `/start` | Don't know which skill? Start here — Claude routes you |
| `/feature` | Full feature cycle: PM → Dev → QA in one session |
| `/fix` | Bug fix cycle: Dev → QA in one session |
| `/lesson` | Add a new lesson from image files |
| `/dev` | Developer role only |
| `/pm` | Product Manager role only |
| `/qa` | QA Tester role only |
| `/research` | Investigate a topic without touching main code |
| `/kb-update` | Same as `/lesson` (alternate name) |
