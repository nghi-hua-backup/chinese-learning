# /lesson — Add New Lesson

Friendly alias for `/kb-update`. Use this whenever you have new lesson images ready to process.

## Trigger

```
/lesson <image filename(s)>
```

Examples:
```
/lesson IMG_8030.jpeg
/lesson IMG_8030.jpeg IMG_8031.jpeg IMG_8032.jpeg
```

If no filename is provided, ask the user which file(s) to process.

---

## ⚡ Context Health Check — Before Processing

Processing a lesson image reads several large files in sequence: the guide, the image(s), `chinese-brain.md` (which grows with every lesson), and then re-reads `chinese-brain.md` again in full to generate practice blocks. Before starting, estimate the session load:

**Check each signal:**
- Did `/start`, `/intake`, `/feature`, or any other skill run earlier in this same conversation?
- Are 3 or more images being processed in this call?
- Has `chinese-brain.md` already been read or referenced in this conversation?
- Is the lesson number high (Bài 6 or later), meaning `chinese-brain.md` is already large?

**If 2 or more signals apply** — pause and tell the user:

> "⚠️ **Context check — before processing images**
>
> This session already has substantial context, and lesson processing will read several large files. Starting fresh will give better results.
>
> **Recommended: type `/compact` now.** No work has been started yet — nothing will be lost. After compacting, re-run `/lesson <filename(s)>` and I will process the images immediately."

Wait for the user's reply.

**If fewer than 2 signals apply** — proceed directly to the `/kb-update` workflow.

---

This skill runs the full Knowledge Base Manager workflow defined in `/kb-update`. All rules, steps, and formatting from that skill apply here — including the mandatory CHANGELOG.md update in Bước 7 (P11).

Please follow the `/kb-update` skill instructions exactly.
