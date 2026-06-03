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

**Rule: Any new feature idea or project discussion must go through `/intake` first.** The team needs to clarify the customer's requirements before any implementation begins — initial descriptions are almost always incomplete. `/intake` hands off to `/feature` automatically once the discovery is done.

| If the user says… | Route to |
|---|---|
| "I'm a new customer / new project / I want to discuss an idea / I want a new feature / let's talk about what I want" | `/intake <topic>` → then `/feature` |
| "I have new lesson images / photos / ảnh bài học" | `/lesson <filename>` |
| "Something is broken / not working / bị lỗi" | `/fix <description>` |
| "Is X possible? / Can we do Y? / Feasible?" | `/research <topic>` → if approved, `/intake` → `/feature` |
| "What features does the app have?" | `/pm` |
| "Check if everything works / verify" | `/qa` |
| "Implement / code / fix this specific thing" (explicit task, already agreed) | `/dev <task>` |
| Unclear or mixed intent | Ask **one** clarifying question |

**When to skip `/intake`:** Only skip it when the request is an operational task (fixing a known bug, uploading lesson images, verifying the app, implementing an already-documented PF-N). If there is any doubt about whether the customer's intent is fully understood, route to `/intake`.

## Step 3 — Offer to begin

After identifying the route, respond with:
- Which skill(s) apply and in what order
- One-line reason why
- Offer: "Should I start as /[skill] now, or would you like to adjust the scope first?"

For new feature/idea requests, always explain the two-step flow:
> "I'll start with `/intake` so the team can clarify your requirements, then hand off to `/feature` for implementation. This ensures we build exactly what you need."

## Rules

- Never read TECHNICAL.md, REQUIREMENTS.md, or VERIFICATION.md in this role — those are for the roles you are routing to
- Never write code or edit docs in this role
- One question maximum if intent is unclear — do not ask multiple questions before routing
