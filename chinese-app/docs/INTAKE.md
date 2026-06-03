## [2026-06-03] — Tone-4 Highlighting & Practice Coaching

**Status:** Agreement reached

### Problem
Thanh 4 (4th tone) is difficult to identify and pronounce correctly, especially in compound words and tone combinations. Users need visual cues to recognize tone-4 syllables and pronunciation coaching while practicing.

### Agreed scope
- In practice mode only: light blue background on both Chinese characters and pinyin for any syllable that is tone 4 or neutral tone
- Compound detection: each space-delimited pinyin word is one group — if any syllable in the group is T4 or neutral tone, the entire compound is highlighted as one block
- Separate compounds are highlighted as separate blocks (no merging across word boundaries)
- A coaching panel (top or left of all practice mode screens) permanently shows two Vietnamese rules:
  - "Thanh 4 + Thanh 1/2/3 → Rướn giọng đọc thanh 4"
  - "Thanh 4 + Thanh 4 → Thanh 4 sau đọc nhanh dứt khoát"
- Rules always show — no conditional logic based on card content
- Vietnamese language for all coaching text

### Out of scope (agreed)
- No highlighting outside practice mode (home, vocab browse, etc.)
- No per-card rule-triggering logic (panel is always visible)

### Acceptance criteria (draft)
- AC-1: In practice mode, any syllable with tone 4 mark (à, è, ì, ò, ù, ǜ) has a light blue background on both its Chinese character and pinyin
- AC-2: Neutral tone syllables (no tone mark) are also highlighted in light blue
- AC-3: Tone-4 (or neutral) syllables belonging to the same space-delimited pinyin word are highlighted as one contiguous block; different words are separate blocks
- AC-4: All practice mode screens display a permanent coaching panel (top or left position) with both rules in Vietnamese
- AC-5: The two rules are always visible regardless of what card is currently shown
- AC-6: No highlighting occurs outside of practice mode screens

### Technical notes
- Pinyin is always present and correctly marked in KB files — tone detection is reliable
- Compound grouping = space-delimited pinyin words
- Tone-4 detection: vowels with grave accent (à, è, ì, ò, ù, ǜ)
- Neutral tone detection: syllables with no tone mark

### Design notes
- Highlight color: light blue background
- Coaching panel: top or left of practice screen, styled as an information/inbound message bubble
- Both Chinese characters and their corresponding pinyin are highlighted together

### Open questions
- (none)
