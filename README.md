# Chinese Learning System

A personal Chinese (Mandarin) learning system for Nghi Hua, built around spaced repetition and iPad handwriting practice. The system has two parts: a knowledge base of lesson content and a web app that turns that content into flashcard practice sessions.

**Live app:** `https://nghi-hua-backup.github.io/chinese-learning/`
**Current progress:** Bài 1–7 (BOYA Sơ Cấp), targeting HSK1+

---

## Repository Layout

```
chinese-learning-1/
├── README.md                              ← you are here
├── chinese-app/                           ← Next.js web app (iPad-optimized)
│   ├── CLAUDE.md                          ← Project orientation (Claude entry point)
│   ├── docs/
│   │   ├── PRINCIPLES.md                  ← Inviolable design constraints
│   │   ├── TECHNICAL.md                   ← Tech stack, data flow, component notes
│   │   ├── REQUIREMENTS.md                ← Feature backlog and requirements
│   │   └── VERIFICATION.md                ← QA checklist and test log
│   ├── app/                               ← Next.js App Router pages
│   ├── components/                        ← React UI components
│   └── lib/                               ← Core logic (parser, SRS, store, utils)
├── chinese-learning/
│   ├── README.md                          ← Knowledge base overview
│   └── knowledge-base/
│       ├── chinese-brain.md               ← Vocabulary, grammar, pronunciation rules
│       ├── chinese-practice-bank.md       ← Practice sentences and dialogues
│       └── chinese-brain-guide.md         ← Format rules for KB files
├── scratch/research/                      ← Ephemeral research notes (uncommitted by default)
├── .claude/commands/                      ← Claude Code skills (slash commands)
└── .github/workflows/deploy.yml          ← GitHub Actions CI/CD (auto-deploy on push)
```

---

## Quick Start (Developers)

```bash
cd chinese-app
npm install
npm run dev     # dev server → http://localhost:3000/chinese-learning
npm run build   # static export → out/ (same as what deploys to GitHub Pages)
```

Push to `main` → GitHub Actions builds and deploys automatically. No manual deploy step.

---

## Skills (Claude Code Slash Commands)

Start a new conversation with Claude Code and use these commands. When in doubt, use `/start`.

### Entry Points

| Command | When to use |
|---|---|
| `/start <anything>` | Don't know which skill to use — Claude routes you |

### Orchestration (Multi-Role, End-to-End)

| Command | Roles | When to use |
|---|---|---|
| `/feature <description>` | PM → Dev → QA | Add a new feature, fully handled in one session |
| `/fix <description>` | Dev → QA | Fix a bug and verify the fix |
| `/lesson <filename(s)>` | KB Manager | Add new lesson content from image files |

### Single-Role (Targeted Tasks)

| Command | Role | When to use |
|---|---|---|
| `/dev` | Developer | Implement a specific thing; update technical docs |
| `/pm` | Product Manager | Discuss features, review backlog, document requirements |
| `/qa` | QA Tester | Verify the live app against the checklist |
| `/research <topic>` | Researcher | Investigate tech feasibility without touching code |
| `/kb-update <filename(s)>` | KB Manager | Same as `/lesson` (alternate name) |

---

## Documentation Map

| File | Purpose | Maintained by |
|---|---|---|
| `chinese-app/CLAUDE.md` | Project orientation, role routing table | `/dev` |
| `chinese-app/docs/PRINCIPLES.md` | 10 inviolable design constraints | `/pm` (user approval required) |
| `chinese-app/docs/TECHNICAL.md` | Tech stack, data flow, components, pitfalls | `/dev` |
| `chinese-app/docs/REQUIREMENTS.md` | Feature backlog, FR/NFR, limitations | `/pm` |
| `chinese-app/docs/VERIFICATION.md` | QA checklist (19 items) + test log | `/qa` |
| `chinese-learning/knowledge-base/chinese-brain-guide.md` | KB format rules | `/kb-update` |

---

## Workflows

### Add a New Feature

```
1. /feature "I want to add [feature description]"
   → Claude plays PM: documents PF-N in REQUIREMENTS.md, commits
   → Claude plays Dev: implements, runs build, updates docs, commits + pushes
   → Claude plays QA: runs checklist on live URL, updates VERIFICATION.md, commits
```

### Fix a Bug

```
1. /fix "Description of what's broken"
   → Claude plays Dev: diagnoses root cause, fixes, runs build, commits + pushes
   → Claude plays QA: verifies fix on live URL, appends to test log
```

### Add a New Lesson (most common)

```
1. Save lesson image to chinese-learning/references/
2. /lesson IMG_XXXX.jpeg
   → Claude reads the image, extracts vocab/grammar/practice sentences
   → Claude updates chinese-brain.md and chinese-practice-bank.md
   → Claude creates synthetic dialogue scenarios (luyện tập tổng hợp)
   → Claude commits and pushes → GitHub Actions redeploys
```

### Research a Technology or Approach

```
1. /research "Can we do [X]?"
   → Claude reads CLAUDE.md + PRINCIPLES.md only
   → Claude investigates and writes scratch/research/YYYY-MM-DD-topic.md
   → Claude presents findings + recommendation inline
   → User decides: add to backlog (/pm), implement now (/feature), or reject
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 + localStorage |
| SRS Algorithm | ts-fsrs 5 (FSRS, more accurate than SM-2) |
| Markdown parsing | unified 11 + remark-parse + remark-gfm |
| Runtime | React 19 |
| Hosting | GitHub Pages (free, public repo) |
| CI/CD | GitHub Actions (auto-deploy on push to main) |

---

## Important Notes

- **Git is the source of truth.** All approved changes must be committed and pushed. The app auto-redeploys on every push to `main`.
- **Content changes don't require code changes.** Edit the markdown files in `chinese-learning/knowledge-base/`, push, and the app rebuilds automatically.
- **Single user, single device.** Progress is stored in iPad localStorage. No backend, no sync.
- **Always test on the live URL** (`https://nghi-hua-backup.github.io/chinese-learning/`) not just localhost, because the `basePath` behavior differs.
