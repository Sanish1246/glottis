import { describe, it, expect } from "vitest";
import { gradeToRevisionField } from "../../utils/flashcardUtils.js";

describe("gradeToRevisionField", () => {
  it("maps grade 1 to forgotten", () => {
    expect(gradeToRevisionField(1)).toBe("forgotten");
  });

  it("maps grade 2 to hard", () => {
    expect(gradeToRevisionField(2)).toBe("hard");
  });

  it("maps grade 3 to medium", () => {
    expect(gradeToRevisionField(3)).toBe("medium");
  });

  it("maps grade 4 to easy", () => {
    expect(gradeToRevisionField(4)).toBe("easy");
  });

  it("maps grade 5 to very_easy", () => {
    expect(gradeToRevisionField(5)).toBe("very_easy");
  });

  it("defaults unknown grade to very_easy", () => {
    expect(gradeToRevisionField(0)).toBe("very_easy");
    expect(gradeToRevisionField(6)).toBe("very_easy");
    expect(gradeToRevisionField(99)).toBe("very_easy");
  });
});
