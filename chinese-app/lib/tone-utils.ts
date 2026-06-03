// Matches one pinyin syllable: optional initial + optional medial + vowel nucleus + optional final
const SYLLABLE_RE = /(zh|ch|sh|[bpmfdtnlgkhjqxzcsr])?[ywiu]?[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng?|r)?/gi;

const TONE4_RE = /[àèìòùǜ]/;
const TONED_VOWEL_RE = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const ANY_VOWEL_RE = /[aeiouüāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const PUNCT_RE = /[\p{P}\p{S}\s]/u;

function syllableHasTone4(s: string): boolean {
  return TONE4_RE.test(s);
}

function syllableIsNeutral(s: string): boolean {
  return ANY_VOWEL_RE.test(s) && !TONED_VOWEL_RE.test(s);
}

function countSyllables(compound: string): number {
  const matches = compound.match(SYLLABLE_RE);
  return matches ? matches.length : 1;
}

function compoundShouldHighlight(compound: string): boolean {
  const syllables = compound.match(SYLLABLE_RE) ?? [];
  return syllables.some((s) => syllableHasTone4(s) || syllableIsNeutral(s));
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
    const count = countSyllables(compound);
    const slice = cleanChars.slice(offset, offset + count).join("");
    offset += count;
    return { chars: slice, pinyin: compound, highlight: compoundShouldHighlight(compound) };
  });
}
