import { describe, it, expect } from "vitest";
import {
  sigmoid,
  trainModel,
  predictProb,
  evaluateModel,
  computeAUC,
  seededRandom,
  shuffle,
} from "../../utils/mlTrainingUtils.js";

describe("mlTrainingUtils", () => {
  describe("sigmoid", () => {
    it("returns ~0.5 when z=0", () => {
      expect(sigmoid(0)).toBeCloseTo(0.5, 10);
    });

    it("returns ~1 when z is large positive", () => {
      expect(sigmoid(20)).toBeCloseTo(1, 5);
      expect(sigmoid(100)).toBeCloseTo(1, 5);
    });

    it("returns ~0 when z is large negative", () => {
      expect(sigmoid(-20)).toBeCloseTo(0, 5);
      expect(sigmoid(-100)).toBeCloseTo(0, 5);
    });

    it("clamps extreme values to avoid overflow", () => {
      expect(sigmoid(1000)).toBeGreaterThan(0.99);
      expect(sigmoid(1000)).toBeLessThanOrEqual(1);
      expect(sigmoid(-1000)).toBeLessThan(0.01);
      expect(sigmoid(-1000)).toBeGreaterThanOrEqual(0);
    });

    it("returns monotonically increasing values", () => {
      expect(sigmoid(-5)).toBeLessThan(sigmoid(-1));
      expect(sigmoid(-1)).toBeLessThan(sigmoid(0));
      expect(sigmoid(0)).toBeLessThan(sigmoid(1));
      expect(sigmoid(1)).toBeLessThan(sigmoid(5));
    });
  });

  describe("trainModel", () => {
    const featureOrder = ["f1", "f2"];
    const samples = [
      { features: [1, 0], label: 1 },
      { features: [0, 1], label: 1 },
      { features: [0, 0], label: 0 },
      { features: [1, 1], label: 0 },
    ];

    it("returns intercept and coefficients with correct length", () => {
      const result = trainModel(samples, featureOrder);
      expect(result).toHaveProperty("intercept");
      expect(result).toHaveProperty("coefficients");
      expect(result.coefficients).toHaveLength(2);
    });

    it("handles empty samples (no crash)", () => {
      const result = trainModel([], featureOrder);
      expect(result.intercept).toBe(0);
      expect(result.coefficients).toEqual([0, 0]);
    });

    it("respects custom epochs and lr", () => {
      // Use imbalanced data so gradient is non-zero
      const imbalancedSamples = [
        { features: [1, 0], label: 1 },
        { features: [1, 0], label: 1 },
        { features: [0, 1], label: 0 },
      ];
      const resultZeroEpochs = trainModel(imbalancedSamples, featureOrder, {
        epochs: 0,
        lr: 0.1,
      });
      const resultOneEpoch = trainModel(imbalancedSamples, featureOrder, {
        epochs: 1,
        lr: 0.1,
      });
      expect(resultZeroEpochs.intercept).toBe(0);
      expect(resultZeroEpochs.coefficients).toEqual([0, 0]);
      expect(resultOneEpoch.intercept).not.toBe(resultZeroEpochs.intercept);
    });

    it("handles samples with undefined feature values", () => {
      const samplesWithUndefined = [
        { features: [1], label: 1 },
        { features: [0, 0], label: 0 },
      ];
      const result = trainModel(samplesWithUndefined, featureOrder, {
        epochs: 10,
      });
      expect(result).toHaveProperty("intercept");
      expect(result.coefficients).toHaveLength(2);
    });
  });

  describe("predictProb", () => {
    const model = {
      intercept: 0,
      coefficients: [0.5, 0.5],
    };

    it("returns probability in [0, 1]", () => {
      const prob = predictProb([1, 1], model);
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1);
    });

    it("handles short feature array (missing values as 0)", () => {
      const prob = predictProb([1], model);
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1);
    });

    it("handles empty feature array", () => {
      const prob = predictProb([], model);
      expect(sigmoid(model.intercept)).toBeCloseTo(prob, 10);
    });
  });

  describe("evaluateModel", () => {
    const model = {
      intercept: 0,
      coefficients: [1, 0],
    };

    it("returns AUC in [0, 1]", () => {
      const samples = [
        { features: [1, 0], label: 1 },
        { features: [0, 0], label: 0 },
      ];
      const { auc } = evaluateModel(samples, model);
      expect(auc).toBeGreaterThanOrEqual(0);
      expect(auc).toBeLessThanOrEqual(1);
    });

    it("handles empty samples", () => {
      const { auc } = evaluateModel([], model);
      expect(auc).toBe(0.5);
    });

    it("returns higher AUC for better-separated predictions", () => {
      const perfectSamples = [
        { features: [1, 0], label: 1 },
        { features: [0, 0], label: 0 },
      ];
      const randomModel = { intercept: 0, coefficients: [0, 0] };
      const goodModel = { intercept: 0, coefficients: [5, 0] };
      const { auc: aucRandom } = evaluateModel(perfectSamples, randomModel);
      const { auc: aucGood } = evaluateModel(perfectSamples, goodModel);
      expect(aucGood).toBeGreaterThanOrEqual(aucRandom);
    });
  });

  describe("computeAUC", () => {
    it("returns 0.5 for all positives (no negatives)", () => {
      const scores = [
        { prob: 0.9, label: 1 },
        { prob: 0.8, label: 1 },
      ];
      expect(computeAUC(scores)).toBe(0.5);
    });

    it("returns 0.5 for all negatives (no positives)", () => {
      const scores = [
        { prob: 0.1, label: 0 },
        { prob: 0.2, label: 0 },
      ];
      expect(computeAUC(scores)).toBe(0.5);
    });

    it("returns 0.5 for empty scores", () => {
      expect(computeAUC([])).toBe(0.5);
    });

    it("returns 1.0 when all positives rank above all negatives", () => {
      const scores = [
        { prob: 0.9, label: 1 },
        { prob: 0.8, label: 1 },
        { prob: 0.2, label: 0 },
        { prob: 0.1, label: 0 },
      ];
      expect(computeAUC(scores)).toBe(1);
    });

    it("returns 0 when all positives rank below all negatives", () => {
      const scores = [
        { prob: 0.9, label: 0 },
        { prob: 0.8, label: 0 },
        { prob: 0.2, label: 1 },
        { prob: 0.1, label: 1 },
      ];
      expect(computeAUC(scores)).toBe(0);
    });

    it("returns value in [0, 1] for random ordering", () => {
      const scores = [
        { prob: 0.5, label: 1 },
        { prob: 0.6, label: 0 },
        { prob: 0.4, label: 1 },
        { prob: 0.3, label: 0 },
      ];
      const auc = computeAUC(scores);
      expect(auc).toBeGreaterThanOrEqual(0);
      expect(auc).toBeLessThanOrEqual(1);
    });

    it("does not mutate input array", () => {
      const scores = [
        { prob: 0.9, label: 1 },
        { prob: 0.1, label: 0 },
      ];
      const copy = scores.map((s) => ({ ...s }));
      computeAUC(scores);
      expect(scores).toEqual(copy);
    });
  });

  describe("seededRandom", () => {
    it("returns values in [0, 1)", () => {
      const rng = seededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const v = rng();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });

    it("is deterministic for same seed", () => {
      const rng1 = seededRandom(42);
      const rng2 = seededRandom(42);
      for (let i = 0; i < 10; i++) {
        expect(rng1()).toBe(rng2());
      }
    });

    it("produces different sequence for different seeds", () => {
      const rng1 = seededRandom(1);
      const rng2 = seededRandom(2);
      const vals1 = [rng1(), rng1(), rng1()];
      const vals2 = [rng2(), rng2(), rng2()];
      expect(vals1).not.toEqual(vals2);
    });
  });

  describe("shuffle", () => {
    it("returns array of same length", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(arr.length);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("does not mutate original array", () => {
      const arr = [1, 2, 3];
      const original = [...arr];
      shuffle(arr);
      expect(arr).toEqual(original);
    });

    it("with seeded RNG produces deterministic result", () => {
      const arr = [1, 2, 3, 4, 5];
      const rng = seededRandom(999);
      const result1 = shuffle(arr, rng);
      const rng2 = seededRandom(999);
      const result2 = shuffle(arr, rng2);
      expect(result1).toEqual(result2);
    });

    it("handles empty array", () => {
      expect(shuffle([])).toEqual([]);
    });

    it("handles single-element array", () => {
      expect(shuffle([1])).toEqual([1]);
    });
  });
});
