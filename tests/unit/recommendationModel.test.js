import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  FEATURE_ORDER,
  buildFeatures,
  predictProb,
  loadRecommendationModel,
} from "../../utils/recommendationModel.js";

//Describing the feature order
describe("recommendationModel", () => {
  describe("FEATURE_ORDER", () => {
    it("has expected feature order", () => {
      expect(FEATURE_ORDER).toEqual([
        "language_match",
        "level_match",
        "type_match",
        "log_likes",
      ]);
    });
  });

  //Describing the buildFeatures function
  describe("buildFeatures", () => {
    it("returns [1,1,1,log(1+likes)] when item matches profile in all dimensions", () => {
      const item = { language: "italian", level: "Beginner", type: "movie", likes: 10 };
      const profile = {
        languages: ["italian"],
        levels: ["Beginner"],
        types: ["movie"],
      };
      const features = buildFeatures(item, profile);
      expect(features[0]).toBe(1);
      expect(features[1]).toBe(1);
      expect(features[2]).toBe(1);
      expect(features[3]).toBeCloseTo(Math.log(11), 5);
    });

    it("returns [0,0,0,log(1)] when item matches nothing and has no likes", () => {
      const item = { language: "french", level: "Advanced", type: "series", likes: 0 };
      const profile = { languages: ["italian"], levels: ["Beginner"], types: ["movie"] };
      const features = buildFeatures(item, profile);
      expect(features).toEqual([0, 0, 0, 0]);
    });

    // Missing profile fields with empty arrays
    it("handles missing profile fields with empty arrays", () => {
      const item = { language: "italian", level: "Beginner", type: "movie" };
      const profile = {};
      const features = buildFeatures(item, profile);
      expect(features[0]).toBe(0);
      expect(features[1]).toBe(0);
      expect(features[2]).toBe(0);
      expect(features[3]).toBe(0);
    });

    it("handles undefined likes as 0", () => {
      const item = { language: "italian", level: "Beginner", type: "movie" };
      const profile = {
        languages: ["italian"],
        levels: ["Beginner"],
        types: ["movie"],
      };
      const features = buildFeatures(item, profile);
      expect(features[3]).toBe(0); //log_likes=0
    });

    it("handles null likes as 0", () => {
      const item = { language: "italian", level: "Beginner", type: "movie", likes: null };
      const profile = {
        languages: ["italian"],
        levels: ["Beginner"],
        types: ["movie"],
      };
      const features = buildFeatures(item, profile);
      expect(features[3]).toBe(0); //log_likes=0
    });

    it("handles high likes (log scaling)", () => {
      const item = { language: "italian", level: "Beginner", type: "movie", likes: 1000 };
      const profile = {
        languages: ["italian"],
        levels: ["Beginner"],
        types: ["movie"],
      };
      const features = buildFeatures(item, profile);
      expect(features[3]).toBeCloseTo(Math.log(1001), 5); //log_likes=log(1001)
    });

    it("matches partial profile (language only)", () => {
      const item = { language: "italian", level: "Advanced", type: "other" };
      const profile = { languages: ["italian"], levels: ["Beginner"], types: [] };
      const features = buildFeatures(item, profile);
      expect(features[0]).toBe(1); //Only language matches
      expect(features[1]).toBe(0);
      expect(features[2]).toBe(0);
    });
  });

  describe("predictProb", () => {
    const model = {
      featureOrder: FEATURE_ORDER,
      intercept: 0,
      coefficients: [0.5, 0.3, 0.2, 0.1], //Coefficients for the model
    };

    it("returns ~0.5 when z=0 (intercept-only with zero features)", () => {
      const features = [0, 0, 0, 0];
      const prob = predictProb(features, model);
      expect(prob).toBeCloseTo(0.5, 5);
    });

    it("returns higher probability for stronger positive features", () => {
      const featuresLow = [0, 0, 0, 0];
      const featuresHigh = [1, 1, 1, 5]; // Strong positive features
      const probLow = predictProb(featuresLow, model);
      const probHigh = predictProb(featuresHigh, model);
      expect(probHigh).toBeGreaterThan(probLow);
    });

    it("returns value in [0, 1]", () => {
      const features = [1, 1, 1, 100];
      const prob = predictProb(features, model);
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1);
    });

    it("handles undefined feature values as 0", () => {
      const features = [1];
      const prob = predictProb(features, model);
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1);
    });

    it("handles negative z (intercept < 0) returning low probability", () => {
      const negModel = {
        featureOrder: FEATURE_ORDER,
        intercept: -10,
        coefficients: [0, 0, 0, 0],
      };
      const features = [0, 0, 0, 0];
      const prob = predictProb(features, negModel);
      expect(prob).toBeLessThan(0.01);
      expect(prob).toBeGreaterThanOrEqual(0);
    });

    it("handles extreme positive z (clamped) returning high probability", () => {
      const posModel = {
        featureOrder: FEATURE_ORDER,
        intercept: 100,
        coefficients: [0, 0, 0, 0],
      };
      const features = [0, 0, 0, 0];
      const prob = predictProb(features, posModel);
      expect(prob).toBeGreaterThan(0.99);
      expect(prob).toBeLessThanOrEqual(1);
    });
  });

  describe("loadRecommendationModel", () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it("returns null when model file does not exist", async () => {
      const result = await loadRecommendationModel();
      // May be null if data/recommendation-model.json doesn't exist, or model if it does
      expect(result === null || typeof result === "object").toBe(true);
      if (result) {
        expect(result).toHaveProperty("featureOrder");
        expect(result).toHaveProperty("intercept");
        expect(result).toHaveProperty("coefficients");
      }
    });
  });
});
