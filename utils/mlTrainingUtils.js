/**
 * Pure ML training utilities - extracted for testability.
 * Used by scripts/modelTraining.js
 */

export function sigmoid(z) {
  //Sigmoid function to clamp values for model training
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

// Training a logistic regression model
export function trainModel(samples, featureOrder, options = {}) {
  const { epochs = 500, lr = 0.05 } = options;
  const numFeatures = featureOrder.length;

  // intercept (bias term): the baseline prediction when all features are zero
  // coefficients (weights): how much each feature contributes to the prediction
  let intercept = 0;
  const coefficients = Array(numFeatures).fill(0);

  // Handle edge case: return zero-initialized model if no training data
  if (samples.length === 0) {
    return { intercept, coefficients };
  }

  // Iterate multiple times over the dataset to minimize loss
  for (let epoch = 0; epoch < epochs; epoch++) {
    // Accumulators for gradients (how much we need to adjust parameters)
    let gradIntercept = 0;
    const gradCoef = Array(numFeatures).fill(0);

    // For each training sample, calculate prediction error and accumulate gradients
    for (const { features, label } of samples) {
      // Linear combination: z = bias + w₁x₁ + w₂x₂ + ... + wₙxₙ
      // (features[i] ?? 0) handles missing features safely
      const z =
        intercept +
        coefficients.reduce((s, w, i) => s + w * (features[i] ?? 0), 0);

      // Apply sigmoid to get probability
      const p = sigmoid(z);

      // Positive error means we predicted too high, negative means too low
      const err = p - label;

      // Accumulate gradient for intercept (error * 1, since intercept multiplier is 1)
      gradIntercept += err;

      // Accumulate gradients for each coefficient (error * feature value)
      for (let i = 0; i < numFeatures; i++)
        gradCoef[i] += err * (features[i] ?? 0);
    }

    // Average gradients by sample count (n) and apply learning rate (lr)
    const n = samples.length;

    // Update intercept: move opposite to gradient direction
    intercept -= (lr / n) * gradIntercept;

    // Update each coefficient: move opposite to gradient direction
    for (let i = 0; i < numFeatures; i++)
      coefficients[i] -= (lr / n) * gradCoef[i];
  }

  // Return trained model parameters
  return { intercept, coefficients };
}

// Generating predictions using the created model
export function predictProb(features, model) {
  let z = model.intercept;

  // Loop through each learned coefficient and multiply by corresponding feature value
  for (let i = 0; i < model.coefficients.length; i++)
    // (features[i] ?? 0) safely handles missing/undefined features by treating them as 0
    z += model.coefficients[i] * (features[i] ?? 0);

  // Apply sigmoid activation to convert linear score z into a probability (0 to 1)
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
  // Sort scores in ascending order by probability
  scores = [...scores].sort((a, b) => a.prob - b.prob);

  // Count actual positive and negative samples in the dataset
  const positives = scores.filter((s) => s.label === 1).length;
  const negatives = scores.length - positives;

  // Edge case: if all samples are same class, AUC is undefined/0.5 (no discrimination possible)
  if (positives === 0 || negatives === 0) return 0.5;

  // Mann-Whitney U Statistic Method for AUC
  // AUC = P(score_positive > score_negative) - probability that a random positive ranks higher than a random negative

  // Sum the ranks of all positive samples (1-indexed rank positions after sorting)
  let sum = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].label === 1) sum += i + 1; // +1 because ranks start at 1, not 0
  }

  // Formula: (sum of positive ranks - minimum possible sum) / (max possible - min possible)
  return (sum - (positives * (positives + 1)) / 2) / (positives * negatives);
}

export function computeROC(scores) {
  // Sort DESCENDING by predicted probability (highest confidence first)
  // This simulates lowering the classification threshold from 1.0 down to 0.0
  const sorted = [...scores].sort((a, b) => b.prob - a.prob);

  // Count total actual positives (P) and negatives (N) for normalization
  const P = sorted.filter((s) => s.label === 1).length;
  const N = sorted.filter((s) => s.label === 0).length;

  // Edge case: if only one class exists, return diagonal (no discriminative power)
  if (P === 0 || N === 0)
    return [
      { fpr: 0, tpr: 0 },
      { fpr: 1, tpr: 1 },
    ];

  // Counters for true positives and false positives as we lower the threshold
  let tp = 0,
    fp = 0;

  const rocPoints = [];

  // Iterate through sorted predictions from highest to lowest probability
  // At each step, assume we classify this sample and all above it as "positive"
  for (const { label } of sorted) {
    if (label === 1) tp++;
    else fp++;

    // Record (FPR, TPR) at this threshold
    rocPoints.push({ fpr: fp / N, tpr: tp / P });
  }

  // Add boundary points to complete the curve from (0,0) to (1,1)
  rocPoints.unshift({ fpr: 0, tpr: 0 }); // classify none as positive
  rocPoints.push({ fpr: 1, tpr: 1 }); // classify all as positive

  return rocPoints;
}

// Deterministic random number generator function
export function seededRandom(seed) {
  return function () {
    // Force seed to 32-bit signed integer
    seed |= 0;

    // This creates the next state in the sequence through modular arithmetic
    seed = (seed + 0x6d2b79f5) | 0;

    // XOR seed with right-shifted version, then multiply
    // Math.imul = fast 32-bit integer multiplication (handles overflow correctly)
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

    // Second mixing round: XOR, right-shift, multiply with different constants
    // 61 | t combines with bitwise OR for additional entropy
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    // Final output: XOR with right-shift, force unsigned (>>> 0), normalize to [0, 1)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Shuffling the dataset based on the seed rng
export function shuffle(arr, rng = null) {
  const random = rng ?? (() => Math.random());
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
