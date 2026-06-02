# Chinese Learning — Knowledge Base

This folder contains the markdown-based knowledge base for the Chinese learning system. Content here is parsed at build time and embedded into the web app at `https://nghi-hua-backup.github.io/chinese-learning/`.

---

## Directory Layout

```
chinese-learning/
├── knowledge-base/
│   ├── chinese-brain.md         ← Vocabulary, grammar, pronunciation rules (source of truth)
│   ├── chinese-practice-bank.md ← Practice sentences and situation dialogues
│   └── chinese-brain-guide.md   ← Format rules and update procedures for the two files above
├── references/                  ← Raw lesson materials (images, scanned pages)
│   ├── Bai-6.md
│   ├── Bai-7.md
│   └── *.jpeg                   ← Lesson scan images (input for /lesson skill)
└── progress/
    ├── milestones.md            ← HSK level goals (manually maintained)
    └── review-log.json          ← Legacy file, not used by current system
```

---

## How Content Gets Into the App

1. Images of lesson materials are saved to `references/`
2. The `/lesson` skill (Claude Code) reads the images and extracts vocabulary, grammar, and practice sentences
3. Claude updates `chinese-brain.md` and `chinese-practice-bank.md` following the rules in `chinese-brain-guide.md`
4. Claude commits and pushes to `main`
5. GitHub Actions rebuilds the Next.js app, which parses the markdown at build time
6. The updated app is live at `https://nghi-hua-backup.github.io/chinese-learning/`

---

## Knowledge Base Files

### `chinese-brain.md` — The Brain

The primary reference for all learned content. Sections:

| Section | Content |
|---|---|
| §1 Phát âm | Pronunciation rules, tone change rules, pinyin system |
| §2 Từ vựng | Vocabulary organized by lesson (`### Bài N`) |
| §3 Số đếm & Thời gian | Numbers, dates, days of the week |
| §4 Lượng từ | Measure words (量词) with usage rules |
| §5 Ngữ pháp | Grammar patterns with structure, explanation, and examples |
| §6 Câu thông dụng | Common phrases: greetings, thanks, farewells |

**Vocabulary table format:** `繁體 | 简体 | Pinyin | Hán Việt | Từ loại | Nghĩa (Tiếng Việt)`

If simplified == traditional, the 简体 column shows `—`.

### `chinese-practice-bank.md` — Practice Content

Practice sentences and dialogues used for the Mẫu câu and Hội thoại practice modes.

| Section | Content |
|---|---|
| `### Bài N` | Practice sentences for lesson N |
| `### Cập nhật sau Bài N` | Multi-lesson dialogue situations added after lesson N |
| `## Luyện tập tổng hợp` | Comprehensive synthetic dialogues combining ≥2 lessons |

### `chinese-brain-guide.md` — Format Rules

Read this before making any manual edits to the knowledge base files. Contains:
- Abbreviation key (DT, ĐT, HDT, PT, S, O, etc.)
- Formatting rules (pinyin tone marks, Hán Việt capitalization, etc.)
- Classification rules (which content goes in which section)
- Pre-update checklist

---

## Adding New Lessons

Use the `/lesson` skill — do not manually edit the knowledge base files unless you've read `chinese-brain-guide.md` first.

```
/lesson IMG_XXXX.jpeg
```

Claude will extract content from the image, apply all format rules, and commit the result.

---

## Current Progress

- Completed: Bài 1–7 (BOYA Sơ Cấp)
- Next: Bài 8+
- Goal: HSK1 (~150 words) → HSK2 (~300 words) → HSK3 (~600 words)
