import { describe, it, expect } from "vitest";
import { isValidDeckEntry } from "../../src/lib/deckUtils";

describe("isValidDeckEntry", () => {
  it("returns true when word and english are non-empty", () => {
    expect(isValidDeckEntry({ word: "hello", english: "hola" })).toBe(true);
  });

  it("returns false when word is empty", () => {
    expect(isValidDeckEntry({ word: "", english: "hola" })).toBe(false);
  });

  it("returns false when english is empty", () => {
    expect(isValidDeckEntry({ word: "hello", english: "" })).toBe(false);
  });

  it("returns false when both are empty", () => {
    expect(isValidDeckEntry({ word: "", english: "" })).toBe(false);
  });

  it("returns false when word is only whitespace", () => {
    expect(isValidDeckEntry({ word: "   ", english: "hola" })).toBe(false);
  });

  it("returns false when english is only whitespace", () => {
    expect(isValidDeckEntry({ word: "hello", english: "   " })).toBe(false);
  });

  it("handles undefined as empty", () => {
    expect(isValidDeckEntry({ word: undefined, english: "hola" })).toBe(false);
    expect(isValidDeckEntry({ word: "hello", english: undefined })).toBe(false);
  });
});
