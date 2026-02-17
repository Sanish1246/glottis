import { describe, it, expect } from "vitest";
import { computeStreakUpdate } from "../../utils/streakUtils.js";

describe("computeStreakUpdate", () => {
  it("continues streak when logging in day after last login", () => {
    const today = "14-02-2025";
    const streakData = {
      endDate: "13-02-2025",
      currentDuration: 3,
      startDate: "11-02-2025",
      maxDuration: 5,
    };
    const result = computeStreakUpdate(streakData, today);
    expect(result.currentDuration).toBe(4);
    expect(result.startDate).toBe("11-02-2025");
    expect(result.endDate).toBe("14-02-2025");
  });

  it("resets streak when logging in more than a day after last login", () => {
    const today = "15-02-2025";
    const streakData = {
      endDate: "13-02-2025",
      currentDuration: 3,
      startDate: "11-02-2025",
    };
    const result = computeStreakUpdate(streakData, today);
    expect(result.currentDuration).toBe(1);
    expect(result.startDate).toBe("15-02-2025");
    expect(result.endDate).toBe("15-02-2025");
  });

  it("updates max when current exceeds max", () => {
    const today = "14-02-2025";
    const streakData = {
      endDate: "13-02-2025",
      currentDuration: 10,
      startDate: "04-02-2025",
      maxDuration: 9,
    };
    const result = computeStreakUpdate(streakData, today);
    expect(result.currentDuration).toBe(11);
    expect(result.maxDuration).toBe(11);
    expect(result.maxStartDate).toBe("04-02-2025");
    expect(result.maxEndDate).toBe("14-02-2025");
  });

  it("handles first login (no streakData)", () => {
    const today = "14-02-2025";
    const result = computeStreakUpdate(null, today);
    expect(result.currentDuration).toBe(1);
    expect(result.startDate).toBe("14-02-2025");
    expect(result.endDate).toBe("14-02-2025");
  });

  it("returns null for invalid date format", () => {
    expect(computeStreakUpdate({}, "invalid")).toBeNull();
  });
});
