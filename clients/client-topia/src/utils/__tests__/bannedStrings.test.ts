import {
  containsBannedString,
  createBannedStringMatcher,
  normalizeBannedToken,
  stripStringEmojis,
} from "../bannedStrings";

const bannedStrings = {
  bannedEmojis: ["💩"],
  bannedSentences: ["go away"],
  bannedWords: ["darn", "wtf!", "a$$"],
};

describe("normalizeBannedToken", () => {
  it("lowercases, maps leet characters to letters and drops everything that is not a letter", () => {
    expect(normalizeBannedToken("DARN")).toBe("darn");
    expect(normalizeBannedToken("d4rn!!")).toBe("darn");
    expect(normalizeBannedToken("d.a.r.n")).toBe("darn");
    expect(normalizeBannedToken("a$$")).toBe("ass");
    expect(normalizeBannedToken("d@rn💩")).toBe("darn");
  });
});

describe("stripStringEmojis", () => {
  it("removes emojis and trims", () => {
    expect(stripStringEmojis(" darn💩 ")).toBe("darn");
  });
});

describe("createBannedStringMatcher", () => {
  const matcher = createBannedStringMatcher(bannedStrings);

  it("allows clean text and empty input", () => {
    expect(matcher.test("nice day")).toBe(false);
    expect(matcher.test("")).toBe(false);
    expect(matcher.test("a dog")).toBe(false);
  });

  it("matches the existing exact-token, sentence and emoji cases", () => {
    expect(matcher.test("DARN it")).toBe(true);
    expect(matcher.test("please go away now")).toBe(true);
    expect(matcher.test("💩")).toBe(true);
    expect(matcher.test("darn💩")).toBe(true);
    expect(matcher.test("wtf!")).toBe(true);
    expect(matcher.test("a$$")).toBe(true);
  });

  it("catches a banned word with punctuation attached", () => {
    expect(matcher.test("darn#")).toBe(true);
    expect(matcher.test("darn# is bad")).toBe(true);
    expect(matcher.test("Darn# Darn#")).toBe(true);
    expect(matcher.test("darn.")).toBe(true);
    expect(matcher.test("darn!!!")).toBe(true);
    expect(matcher.test("you darn,")).toBe(true);
    expect(matcher.test("(darn)")).toBe(true);
    expect(matcher.test('"darn"')).toBe(true);
  });

  it("catches banned words joined by punctuation instead of spaces", () => {
    expect(matcher.test("darn#darn#darn#")).toBe(true);
    expect(matcher.test("darn.darn")).toBe(true);
    expect(matcher.test("hi-darn-hi")).toBe(true);
  });

  it("catches banned words separated by newlines, tabs or repeated spaces", () => {
    expect(matcher.test("hello\ndarn")).toBe(true);
    expect(matcher.test("hello\tdarn")).toBe(true);
    expect(matcher.test("hello   darn")).toBe(true);
  });

  it("catches leet substitutions and symbol masking", () => {
    expect(matcher.test("d4rn")).toBe(true);
    expect(matcher.test("d@rn")).toBe(true);
    expect(matcher.test("D4RN#")).toBe(true);
    expect(matcher.test("a55")).toBe(true);
    expect(matcher.test("wtf")).toBe(true);
  });

  it("catches a banned word spelled out letter by letter", () => {
    expect(matcher.test("d a r n")).toBe(true);
    expect(matcher.test("d.a.r.n")).toBe(true);
    expect(matcher.test("hey d-a-r-n you")).toBe(true);
    expect(matcher.test("a b c")).toBe(false);
  });

  it("catches sentences with punctuation inside them", () => {
    expect(matcher.test("go# away")).toBe(true);
    expect(matcher.test("GO...AWAY")).toBe(true);
    expect(matcher.test("go  away")).toBe(true);
  });

  it("does not match a banned word embedded inside a longer word", () => {
    expect(matcher.test("darnit")).toBe(false);
    expect(matcher.test("classy")).toBe(false);
    expect(matcher.test("assume")).toBe(false);
  });

  it("does not treat a short entry as a substring of innocent words", () => {
    expect(matcher.test("a dog")).toBe(false);
    expect(matcher.test("as if")).toBe(false);
  });

  it("only matches an entry that normalizes to under three letters when it is typed literally", () => {
    const asciiArt = createBannedStringMatcher({
      bannedWords: ["8===3", "8==d", "(.y.)", "ho"],
      bannedSentences: ["( . y . )", "( o )( o )"],
    });
    expect(asciiArt.test("8===3")).toBe(true);
    expect(asciiArt.test("8==D")).toBe(true);
    expect(asciiArt.test("ho")).toBe(true);
    expect(asciiArt.test("look ( . y . ) here")).toBe(true);
    expect(asciiArt.test("indls-3-5")).toBe(false);
    expect(asciiArt.test("zone-k-3")).toBe(false);
    expect(asciiArt.test("room-d")).toBe(false);
    expect(asciiArt.test("history")).toBe(false);
    expect(asciiArt.test("demo-of-zoo")).toBe(false);
  });

  it("only decodes a leet entry against input that is itself leet", () => {
    const leetOnly = createBannedStringMatcher({
      bannedWords: ["m1l0", "fl!4nk", "gl0rp3r"],
      bannedSentences: ["$ump my gl0b"],
    });
    expect(leetOnly.test("m1l0")).toBe(true);
    expect(leetOnly.test("M1LO")).toBe(true);
    expect(leetOnly.test("gl0rper")).toBe(true);
    expect(leetOnly.test("g.l.0.r.p.e.r")).toBe(true);
    expect(leetOnly.test("5ump my glob")).toBe(true);
    expect(leetOnly.test("Milo")).toBe(false);
    expect(leetOnly.test("Vexley, Milo Quinn")).toBe(false);
    expect(leetOnly.test("flank steak")).toBe(false);
    expect(leetOnly.test("sump my glob")).toBe(false);
    expect(leetOnly.test("glorper")).toBe(false);
  });

  it("matches a sentence as whole words, allowing the last letter to be stretched", () => {
    const sentences = createBannedStringMatcher({ bannedSentences: ["old zag", "d zip", "hard zon", "zap yourself"] });
    expect(sentences.test("you old zag!")).toBe(true);
    expect(sentences.test("ZAP YOURSELF!!!")).toBe(true);
    expect(sentences.test("zap yourselfff")).toBe(true);
    expect(sentences.test("go zap-yourself now")).toBe(true);
    expect(sentences.test("Harold Zagley")).toBe(false);
    expect(sentences.test("David Zipper")).toBe(false);
    expect(sentences.test("I need zipties for the lab")).toBe(false);
    expect(sentences.test("Richard Zone")).toBe(false);
    expect(sentences.test("hard zone")).toBe(false);
  });

  it("reads + as t so an entry like glo+ does not block the name Glo", () => {
    const plus = createBannedStringMatcher({ bannedWords: ["glo+", "flu+er", "glot"] });
    expect(plus.test("glo+")).toBe(true);
    expect(plus.test("gl0+")).toBe(true);
    expect(plus.test("flu+3r")).toBe(true);
    expect(plus.test("Glo")).toBe(false);
    expect(plus.test("Fluer")).toBe(false);
  });

  it("ignores blank and undefined list entries", () => {
    const sparse = createBannedStringMatcher({
      bannedWords: ["", " ", "darn"],
      bannedSentences: [""],
      bannedEmojis: [""],
    });
    expect(sparse.test("hello")).toBe(false);
    expect(sparse.test("darn")).toBe(true);
    expect(createBannedStringMatcher({}).test("anything")).toBe(false);
  });
});

describe("containsBannedString", () => {
  it("is a one-shot wrapper over the matcher", () => {
    expect(containsBannedString("darn#", bannedStrings)).toBe(true);
    expect(containsBannedString("hello", bannedStrings)).toBe(false);
  });
});
