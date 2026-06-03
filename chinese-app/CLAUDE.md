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
| **Dispatcher** (`/start`) | Root `README.md` + this file + `docs/INTAKE.md` (if exists) |
| **Intake** (`/intake`) | `docs/INTAKE.md` (if exists — conflict check first) |
| **Product Manager** (`/pm`, `/feature` Phase 1) | `docs/INTAKE.md` → `docs/PRINCIPLES.md` → `docs/REQUIREMENTS.md` |
| **Tech Lead** (`/feature` Phase 2) | `docs/PRINCIPLES.md` → `docs/TECHNICAL.md` → `docs/REQUIREMENTS.md` |
| **Developer** (`/dev`, `/feature` Phase 3, `/fix`) | `docs/PRINCIPLES.md` → `docs/TECHNICAL.md` → `docs/REQUIREMENTS.md` → `docs/CHANGELOG.md` |
| **QA Tester** (`/qa`, `/feature` Phase 4, `/fix`) | `docs/VERIFICATION.md` → `docs/CHANGELOG.md` |
| **PM Sign-off / UAT** (`/feature` Phase 4) | `docs/REQUIREMENTS.md` → `docs/INTAKE.md` (scope check) |
| **Researcher** (`/research`) | `docs/PRINCIPLES.md` only |
| **KB Manager** (`/lesson`, `/kb-update`) | `chinese-learning/knowledge-base/chinese-brain-guide.md` → `docs/CHANGELOG.md` |

**Versioning (P11):** Every shipped commit must update `docs/CHANGELOG.md`. Format: `MAJOR.MINOR.PATCH` — MINOR for new features, PATCH for fixes/content/docs. Current baseline: `1.0.0` (2026-06-02).

**INTAKE.md:** Living agreement log — append-only, updated by `/intake` skill. Read by `/start`, `/pm`, and `/feature` Phase 1 & 4 to detect conflicts with previous customer agreements. Never overwrite previous entries.

---

## Available Skills

| Command | What it does |
|---|---|
| `/start` | Don't know which skill? Start here — Claude routes you |
| `/intake` | New idea or project? Start here — multi-role discovery, logs agreements to INTAKE.md |
| `/feature` | Full feature cycle: PM → Tech Lead → Dev → QA + UAT in one session |
| `/fix` | Bug fix cycle: Dev → QA in one session |
| `/lesson` | Add a new lesson from image files |
| `/dev` | Developer role only |
| `/pm` | Product Manager role only |
| `/qa` | QA Tester role only |
| `/research` | Investigate a topic without touching main code |
| `/kb-update` | Same as `/lesson` (alternate name) |
