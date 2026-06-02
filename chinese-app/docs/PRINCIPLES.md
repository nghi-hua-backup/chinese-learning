# Design Principles

These are inviolable constraints. Every Claude role must check this file before making any architectural decision. Any change to a principle requires explicit user approval.

---

## P1 — Static Export Only

GitHub Pages does not support a Node.js server runtime. The app must always be built with `output: "export"` in `next.config.ts`. No server actions, no API routes, no runtime `fetch()` for content.

## P2 — Single User, Single Device

This is a personal app for one person on one iPad. `localStorage` is the correct and sufficient persistence layer. Never add a backend, database, or auth system unless this principle is explicitly removed by the user.

## P3 — iPad-First, Touch-First

All interactive elements must be thumb-reachable on iPad. The bottom `NavBar` is intentional. Font sizes during practice: `text-7xl font-bold` for textarea input, `text-8xl` for answer reveal. No hover-only interactions.

## P4 — Vietnamese UI

All labels, buttons, messages, and status text are in Vietnamese. Chinese is the language being *learned*, not the UI language. English is only acceptable in developer-facing code comments.

## P5 — No OCR — Use iOS Native Handwriting

The iOS handwriting keyboard (手写) is accurate and free. Never add a handwriting recognition library. The `<textarea lang="zh-Hans">` approach is intentional.

## P6 — Both Scripts Always Stored

Every card carries both `simplified` and `traditional` fields. `ScriptMode` controls *display only* — it is never used to filter which cards exist. `getDisplayChar(card, scriptMode)` in `lib/utils.ts` is the single access point. Never render both forms simultaneously during a practice session.

## P7 — Build-Time Data Only

Markdown files are parsed in Next.js server components at build time. The app has no `fetch()` calls for content at runtime. New content requires editing the markdown files and pushing to `main` to trigger a rebuild.

## P8 — React Rules of Hooks — No Exceptions

Never place a hook call (`useMemo`, `useState`, `useEffect`, etc.) after an early `return` inside a component. This crashes Safari silently when a state transition first hits the early return. All hooks must be declared before any conditional logic.

## P9 — basePath Is Automatic

`basePath: '/chinese-learning'` is set in `next.config.ts`. Next.js `<Link>` prepends it automatically. Never manually prefix route hrefs. Never use `<a href>` for internal navigation.

## P10 — Public Repo

GitHub Pages free tier requires a public repo (`nghi-hua-backup/chinese-learning`). Never commit sensitive data, API keys, or private content to this repo. Private content lives in the separate private `personal-development` repo.

## P11 — Every Shipped Change Must Be Versioned and Docs Must Be Current

Any commit that changes code, content, or configuration must update **all** of the following that apply:

- **`docs/CHANGELOG.md`** — always; bump MAJOR/MINOR/PATCH and prepend a dated entry
- **`docs/REQUIREMENTS.md`** — always; must reflect what the app currently does and intentionally does not do (FR-N entries, Known Non-Bugs, NFRs)
- **`docs/TECHNICAL.md`** — whenever implementation details change: new components, data types, pitfalls, parsing rules, or any detail that would mislead a future developer if left stale
- **`docs/VERIFICATION.md`** — whenever observable behavior changes: update or add checklist items to match new expected behavior; append a test log entry after QA verifies
- **Knowledge-base timestamps** (`> **Cập nhật lần cuối:**`) — whenever KB content is added or edited

"No applicable changes" is not an acceptable reason to skip a doc — if a doc needs no update, that must be a conscious decision, not an oversight. No commit is complete without this review. All roles — Dev, PM, QA, KB Manager — are bound by this principle.
