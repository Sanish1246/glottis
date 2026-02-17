import { describe, it, expect } from "vitest";
import { supermemo, type SuperMemoGrade } from "supermemo";

describe("supermemo integration", () => {
  const baseCard = {
    word: "test",
    english: "test",
    interval: 1,
    repetition: 0,
    efactor: 2.5,
    dueDate: "01-01-2025",
  };

  it("returns interval, repetition, efactor for grade 5", () => {
    const result = supermemo(baseCard, 5 as SuperMemoGrade);
    expect(result).toHaveProperty("interval");
    expect(result).toHaveProperty("repetition");
    expect(result).toHaveProperty("efactor");
    expect(typeof result.interval).toBe("number");
    expect(typeof result.repetition).toBe("number");
    expect(typeof result.efactor).toBe("number");
  });

  it("returns higher interval for good grade than bad grade", () => {
    const resultGood = supermemo(baseCard, 5 as SuperMemoGrade);
    const resultBad = supermemo(baseCard, 1 as SuperMemoGrade);
    expect(resultGood.interval).toBeGreaterThanOrEqual(resultBad.interval);
  });

  it("returns efactor in reasonable range", () => {
    const result = supermemo(baseCard, 3 as SuperMemoGrade);
    expect(result.efactor).toBeGreaterThanOrEqual(1.3);
    expect(result.efactor).toBeLessThanOrEqual(2.5);
  });
});
