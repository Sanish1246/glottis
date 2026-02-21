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
        intercept +
        coefficients.reduce((s, w, i) => s + w * (features[i] ?? 0), 0);
      const p = sigmoid(z);
      const err = p - label;
      gradIntercept += err;
      for (let i = 0; i < numFeatures; i++)
        gradCoef[i] += err * (features[i] ?? 0);
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
  const scores = samples.map(({ features, label }) => ({
    prob: predictProb(features, model),
    label,
  }));

  const rocCurve = computeROC(scores);
  const auc = computeAUC(scores);

  return { auc, rocCurve };
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

export function computeROC(scores) {
  // Sort descending by predicted probability
  const sorted = [...scores].sort((a, b) => b.prob - a.prob);

  const P = sorted.filter((s) => s.label === 1).length;
  const N = sorted.filter((s) => s.label === 0).length;

  if (P === 0 || N === 0)
    return [
      { fpr: 0, tpr: 0 },
      { fpr: 1, tpr: 1 },
    ];

  let tp = 0,
    fp = 0;
  const rocPoints = [];

  for (const { label } of sorted) {
    if (label === 1) tp++;
    else fp++;
    rocPoints.push({ fpr: fp / N, tpr: tp / P });
  }

  // Add start and end points for a full curve
  rocPoints.unshift({ fpr: 0, tpr: 0 });
  rocPoints.push({ fpr: 1, tpr: 1 });

  return rocPoints;
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
