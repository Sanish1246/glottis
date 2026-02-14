import { describe, it, expect } from "vitest";
import { computeFallbackScore } from "../../utils/recommendationModel.js";

describe("computeFallbackScore", () => {
  it("adds 3 for language match", () => {
    const item = { language: "italian", level: "Beginner", type: "movie", likes: 0 };
    const profile = { languages: ["italian"], levels: [], types: [] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBeGreaterThanOrEqual(3);
  });

  it("adds 2 for level match", () => {
    const item = { language: "french", level: "Intermediate", type: "book", likes: 0 };
    const profile = { languages: [], levels: ["Intermediate"], types: [] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBeGreaterThanOrEqual(2);
  });

  it("adds 2 for type match", () => {
    const item = { language: "french", level: "Advanced", type: "Movie", likes: 0 };
    const profile = { languages: [], levels: [], types: ["Movie"] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBeGreaterThanOrEqual(2);
  });

  it("adds log(1+likes) for likes", () => {
    const item = { language: "x", level: "y", type: "z", likes: 10 };
    const profile = { languages: [], levels: [], types: [] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBeCloseTo(Math.log(11), 5);
  });

  it("returns 0 when nothing matches and no likes", () => {
    const item = { language: "x", level: "y", type: "z", likes: 0 };
    const profile = { languages: ["a"], levels: ["b"], types: ["c"] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBe(0);
  });

  it("handles undefined likes", () => {
    const item = { language: "x", level: "y", type: "z" };
    const profile = { languages: [], levels: [], types: [] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBe(0);
  });

  it("adds genre matches when profile has genres", () => {
    const item = { language: "x", level: "y", type: "z", likes: 0, genres: ["Comedy", "Drama"] };
    const profile = { languages: [], levels: [], types: [], genres: ["Comedy"] };
    const score = computeFallbackScore(item, profile);
    expect(score).toBe(2);
  });
});
