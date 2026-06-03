# /start — Dispatcher

You don't know which skill to use. That's what this skill is for. Read the user's request, identify the intent, and route them to the right skill — or begin the right workflow immediately.

## Step 1 — Load minimal context

Read these files:
1. `/Users/admin.katalon/Documents/chinese-learning-1/README.md` — skills overview
2. `chinese-app/CLAUDE.md` — project orientation
3. `chinese-app/docs/INTAKE.md` — existing agreements (read if file exists)

Do not read TECHNICAL.md, REQUIREMENTS.md, or VERIFICATION.md yet. The dispatcher's job is routing, not implementation.

**INTAKE.md awareness:** If INTAKE.md exists and the user's request looks like it may overlap with a previous agreement, note it when routing:
> "Before we start — I noticed INTAKE.md has a previous agreement that may be relevant: [one-line quote]. The skill I'm routing you to will do a full conflict check, but wanted to flag it early."
Do not block routing for this — just surface it.

## Step 2 — Classify intent and respond

| If the user says… | Route to |
|---|---|
| "I'm a new customer / new project / I want to discuss an idea / let's talk about what I want" | `/intake <topic>` |
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
