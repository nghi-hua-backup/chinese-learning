// Matches one pinyin syllable: optional initial + optional medial + vowel nucleus + optional final
const SYLLABLE_RE = /(zh|ch|sh|[bpmfdtnlgkhjqxzcsr])?[ywiu]?[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng?|r)?/gi;

const TONE4_RE = /[àèìòùǜ]/;
const TONED_VOWEL_RE = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const ANY_VOWEL_RE = /[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const PUNCT_RE = /[\p{P}\p{S}\s]/u;

// Standalone 'er' syllable (二, 而, 耳…): no initial, nucleus = e (toned or plain), final = r
const STANDALONE_ER_RE = /^[ēéěèe]r$/i;
// Erhua vowel+r pattern
const ERHUA_RE = /[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]r$/i;

function syllableHasTone4(s: string): boolean {
  return TONE4_RE.test(s);
}

function syllableIsNeutral(s: string): boolean {
  return ANY_VOWEL_RE.test(s) && !TONED_VOWEL_RE.test(s);
}

function compoundShouldHighlight(compound: string): boolean {
  const syllables = compound.match(SYLLABLE_RE) ?? [];
  return syllables.some((s) => syllableHasTone4(s));
}

// Returns the number of Chinese characters a pinyin compound spans.
// Accounts for erhua (兒化) where a vowel+r suffix adds one extra character (兒/儿).
function countCharsForCompound(compound: string): number {
  const syllables = compound.match(SYLLABLE_RE) ?? [];
  const count = syllables.length;
  // Erhua: last syllable ends with vowel+r and is NOT the standalone 'er' syllable
  const last = syllables[syllables.length - 1] ?? "";
  const isErhua = ERHUA_RE.test(last) && !STANDALONE_ER_RE.test(last);
  return count + (isErhua ? 1 : 0);
}

export interface Segment {
  chars: string;
  pinyin: string;
  highlight: boolean;
}

export function analyzeText(chars: string, pinyin: string): Segment[] {
  const compounds = pinyin.trim().split(/\s+/).filter(Boolean);
  if (compounds.length === 0) return [];

  // Build array of non-punctuation chars for positional mapping
  const cleanChars = Array.from(chars).filter((c) => !PUNCT_RE.test(c));

  let offset = 0;
  return compounds.map((compound) => {
    const count = countCharsForCompound(compound);
    const slice = cleanChars.slice(offset, offset + count).join("");
    offset += count;
    return { chars: slice, pinyin: compound, highlight: compoundShouldHighlight(compound) };
  });
}
