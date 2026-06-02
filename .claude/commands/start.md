# /start — Dispatcher

You don't know which skill to use. That's what this skill is for. Read the user's request, identify the intent, and route them to the right skill — or begin the right workflow immediately.

## Step 1 — Load minimal context

Read only these two files:
1. `/Users/admin.katalon/Documents/chinese-learning-1/README.md` — skills overview
2. `chinese-app/CLAUDE.md` — project orientation

Do not read any docs/ files yet. The dispatcher's job is routing, not implementation.

## Step 2 — Classify intent and respond

| If the user says… | Route to |
|---|---|
| "I have new lesson images / photos / ảnh bài học" | `/lesson <filename>` |
| "I want to add / build a new feature" | `/feature <description>` |
| "Something is broken / not working / bị lỗi" | `/fix <description>` |
| "Is X possible? / Can we do Y? / Feasible?" | `/research <topic>`, then possibly `/feature` |
| "What features does the app have?" | `/pm` |
| "Check if everything works / verify" | `/qa` |
| "Implement / code / fix this specific thing" | `/dev <task>` |
| Unclear or mixed intent | Ask **one** clarifying question |

## Step 3 — Offer to begin

After identifying the route, respond with:
- Which skill(s) apply and in what order
- One-line reason why
- Offer: "Should I start as /[skill] now, or would you like to adjust the scope first?"

If the user's intent clearly maps to an orchestration skill (`/feature`, `/fix`, `/lesson`), offer to begin immediately without asking — these are self-contained workflows.

## Rules

- Never read TECHNICAL.md, REQUIREMENTS.md, or VERIFICATION.md in this role — those are for the roles you are routing to
- Never write code or edit docs in this role
- One question maximum if intent is unclear — do not ask multiple questions before routing
