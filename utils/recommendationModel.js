import fs from "fs/promises";
import path from "path";

/** Feature order must match training data and saved model. */
export const FEATURE_ORDER = [
  "language_match",
  "level_match",
  "type_match",
  "log_likes",
];

/**
 * Build feature vector for one item given user profile (from liked items).
 * @param {Object} item - Media item with language, level, type, likes
 * @param {Object} profile - { languages: string[], levels: string[], types: string[] }
 * @returns {number[]} - Vector in FEATURE_ORDER order
 */
export function buildFeatures(item, profile) {
  const { languages = [], levels = [], types = [] } = profile;
  const language_match = languages.includes(item.language) ? 1 : 0;
  const level_match = levels.includes(item.level) ? 1 : 0;
  const type_match = types.includes(item.type) ? 1 : 0;
  const log_likes = Math.log(1 + (item.likes ?? 0));
  return [language_match, level_match, type_match, log_likes];
}

function sigmoid(z) {
  const x = Math.max(-20, Math.min(20, z));
  return 1 / (1 + Math.exp(-x));
}

/**
 * Predict P(like) for a feature vector using the saved logistic regression model.
 * @param {number[]} features - Vector in model.featureOrder order
 * @param {Object} model - { featureOrder, intercept, coefficients }
 * @returns {number} - Probability in [0, 1]
 */
export function predictProb(features, model) {
  let z = model.intercept;
  for (let i = 0; i < model.coefficients.length; i++) {
    z += model.coefficients[i] * (features[i] ?? 0);
  }
  return sigmoid(z);
}

let cachedModel = null;

/**
 * Load recommendation model from data/recommendation-model.json (cached after first load).
 * @returns {Promise<Object|null>} - Model or null if missing/invalid
 */
export async function loadRecommendationModel() {
  if (cachedModel) return cachedModel;
  const modelPath = path.join(process.cwd(), "data", "recommendation-model.json");
  try {
    const raw = await fs.readFile(modelPath, "utf-8");
    cachedModel = JSON.parse(raw);
    return cachedModel;
  } catch (e) {
    console.warn("Recommendation model not found or invalid:", e.message);
    return null;
  }
}
