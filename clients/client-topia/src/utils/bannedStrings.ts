// types
import { BannedStringsType } from "types";

/* ============================================================================
Ported from the Topia backend: packages/shared-utils/src/lib/moderation/bannedStrings.ts

Kept deliberately identical so a client-side check agrees with the server, which
applies this same matcher and remains the authority. Port fixes in both places.
============================================================================ */

export type BannedStringMatcher = {
  test: (text: string) => boolean;
};

const MIN_NORMALIZED_LETTERS = 3;

const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
const whitespaceRegex = /\s+/u;
const nonLetterRegex = /[^\p{L}]+/gu;

const leetMap: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "+": "t",
  "@": "a",
  $: "s",
};
const leetChars = Object.keys(leetMap)
  .map((char) => char.replace(/[$+]/g, "\\$&"))
  .join("");
const leetRegex = new RegExp(`[${leetChars}]`, "g");
const leetCharRegex = new RegExp(`[${leetChars}]`);
// splits on anything that cannot be part of a word once leet characters are mapped to letters
const tokenBoundaryRegex = new RegExp(`[^\\p{L}${leetChars}]+`, "gu");

export const stripStringEmojis = (input: string): string => input.replace(emojiRegex, "").trim();

// "N1gg3r!!" -> "nigger"; punctuation, digits-as-letters, and emojis all collapse to the bare word
export const normalizeBannedToken = (token: string): string =>
  token
    .toLowerCase()
    .replace(leetRegex, (char) => leetMap[char])
    .replace(nonLetterRegex, "");

// "Go#  AWAY!!" -> "go away"
export const normalizeBannedText = (text: string): string =>
  text
    .toLowerCase()
    .replace(leetRegex, (char) => leetMap[char])
    .replace(nonLetterRegex, " ")
    .trim();

const hasEnoughLetters = (normalized: string): boolean =>
  normalized.replace(whitespaceRegex, "").length >= MIN_NORMALIZED_LETTERS;

const hasLeet = (text: string): boolean => leetCharRegex.test(text);

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// a sentence matches as whole words so "old zag" cannot span "harold zagley"; its last letter may repeat ("zap yourselfff")
const sentenceRegex = (sentence: string): RegExp =>
  new RegExp(`(?:^|[^\\p{L}])${escapeRegex(sentence)}${escapeRegex(sentence.slice(-1))}*(?=[^\\p{L}]|$)`, "u");

type Token = { text: string; leet: boolean };

const rawTokens = (normalizedText: string): string[] =>
  normalizedText.split(whitespaceRegex).map(stripStringEmojis).filter(Boolean);

// "n.i.g.g.e.r" and "n i g g e r" become one extra token so spelling a word out letter by letter still matches
const joinSpelledOutRuns = (tokens: Token[]): Token[] => {
  const joined: Token[] = [];
  let run: Token[] = [];

  const flush = () => {
    if (run.length > 1) {
      joined.push({ text: run.map((token) => token.text).join(""), leet: run.some((token) => token.leet) });
    }
    run = [];
  };

  for (const token of tokens) {
    if (token.text.length === 1) run.push(token);
    else flush();
  }
  flush();

  return joined;
};

const normalizedTokens = (normalizedText: string): Token[] => {
  const tokens = normalizedText
    .split(tokenBoundaryRegex)
    .map((piece) => ({ text: normalizeBannedToken(piece), leet: hasLeet(piece) }))
    .filter((token) => token.text);

  return [...tokens, ...joinSpelledOutRuns(tokens)];
};

const partitionByLeet = (entries: string[]): { plain: string[]; leet: string[] } => ({
  plain: entries.filter((entry) => !hasLeet(entry)),
  leet: entries.filter(hasLeet),
});

export const createBannedStringMatcher = ({
  bannedEmojis = [],
  bannedSentences = [],
  bannedWords = [],
}: Partial<BannedStringsType>): BannedStringMatcher => {
  const rawWords = new Set(bannedWords.map((word) => word.toLowerCase().trim()).filter(Boolean));
  const rawSentences = bannedSentences
    .map((sentence) => sentence.toLowerCase().trim())
    .filter(Boolean)
    .map(sentenceRegex);
  const emojis = bannedEmojis.filter(Boolean);

  // a decoded leet entry can be an ordinary word ("m1l0" -> "milo"), so it only applies to input that is itself leet
  // ascii-art entries like "8===3" or "( . y . )" collapse to one letter and would match almost any text
  const words = partitionByLeet(bannedWords);
  const normalizedWords = new Set(words.plain.map(normalizeBannedToken).filter(hasEnoughLetters));
  const leetWords = new Set(words.leet.map(normalizeBannedToken).filter(hasEnoughLetters));
  const sentences = partitionByLeet(bannedSentences);
  const normalizedSentences = sentences.plain.map(normalizeBannedText).filter(hasEnoughLetters).map(sentenceRegex);
  const leetSentences = sentences.leet.map(normalizeBannedText).filter(hasEnoughLetters).map(sentenceRegex);

  return {
    test: (text) => {
      if (!text) return false;

      const normalizedText = text.toLowerCase().trim();

      if (emojis.some((emoji) => normalizedText.includes(emoji))) return true;
      if (rawSentences.some((sentence) => sentence.test(normalizedText))) return true;
      if (rawTokens(normalizedText).some((token) => rawWords.has(token))) return true;

      const letterText = normalizeBannedText(normalizedText);
      const leet = hasLeet(normalizedText);

      if (normalizedSentences.some((sentence) => sentence.test(letterText))) return true;
      if (leet && leetSentences.some((sentence) => sentence.test(letterText))) return true;

      return normalizedTokens(normalizedText).some(
        (token) => normalizedWords.has(token.text) || (token.leet && leetWords.has(token.text)),
      );
    },
  };
};

export const containsBannedString = (text: string, bannedStrings: Partial<BannedStringsType>): boolean =>
  createBannedStringMatcher(bannedStrings).test(text);
