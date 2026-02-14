/**
 * Pure ML training utilities - extracted for testability.
 * Used by scripts/modelTraining.js
 */

export function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

export function trainModel(samples, featureOrder, options = {}) {
  const { epochs = 500, lr = 0.05 } = options;
  const numFeatures = featureOrder.length;

  let intercept = 0;
  const coefficients = Array(numFeatures).fill(0);

  if (samples.length === 0) {
    return { intercept, coefficients };
  }

  for (let epoch = 0; epoch < epochs; epoch++) {
    let gradIntercept = 0;
    const gradCoef = Array(numFeatures).fill(0);

    for (const { features, label } of samples) {
      const z =
        intercept + coefficients.reduce((s, w, i) => s + w * (features[i] ?? 0), 0);
      const p = sigmoid(z);
      const err = p - label;
      gradIntercept += err;
      for (let i = 0; i < numFeatures; i++) gradCoef[i] += err * (features[i] ?? 0);
    }

    const n = samples.length;
    intercept -= (lr / n) * gradIntercept;
    for (let i = 0; i < numFeatures; i++)
      coefficients[i] -= (lr / n) * gradCoef[i];
  }

  return { intercept, coefficients };
}

export function predictProb(features, model) {
  let z = model.intercept;
  for (let i = 0; i < model.coefficients.length; i++)
    z += model.coefficients[i] * (features[i] ?? 0);
  return sigmoid(z);
}

export function evaluateModel(samples, model) {
  const scores = [];
  for (const { features, label } of samples) {
    const prob = predictProb(features, model);
    scores.push({ prob, label });
  }
  const auc = Math.max(0, Math.min(1, computeAUC(scores)));
  return auc;
}

export function computeAUC(scores) {
  scores = [...scores].sort((a, b) => a.prob - b.prob);
  const positives = scores.filter((s) => s.label === 1).length;
  const negatives = scores.length - positives;
  if (positives === 0 || negatives === 0) return 0.5;
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].label === 1) sum += i + 1;
  }
  return (sum - (positives * (positives + 1)) / 2) / (positives * negatives);
}

export function seededRandom(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rng = null) {
  const random = rng ?? (() => Math.random());
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
