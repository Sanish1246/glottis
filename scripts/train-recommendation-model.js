/**
 * Train logistic regression on exported recommendation data and save model JSON.
 * Uses 70/15/15 train/validation/test split by user; evaluates on test set.
 * Run from project root: node scripts/train-recommendation-model.js
 * Reads data/training-data.json, writes data/recommendation-model.json and data/eval-metrics.json.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRAIN_RATIO = 0.7;
const VAL_RATIO = 0.15;
const TEST_RATIO = 0.15;

function sigmoid(z) {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

function train(samples, featureOrder, options = {}) {
  const { epochs = 500, lr = 0.1 } = options;
  const nFeatures = featureOrder.length;
  let intercept = 0;
  const coefficients = Array(nFeatures).fill(0);

  for (let epoch = 0; epoch < epochs; epoch++) {
    let gradIntercept = 0;
    const gradCoef = Array(nFeatures).fill(0);

    for (const { features, label } of samples) {
      const z = intercept + coefficients.reduce((s, w, i) => s + w * features[i], 0);
      const p = sigmoid(z);
      const err = p - label;
      gradIntercept += err;
      for (let i = 0; i < nFeatures; i++) gradCoef[i] += err * features[i];
    }

    const n = samples.length;
    intercept -= (lr / n) * gradIntercept;
    for (let i = 0; i < nFeatures; i++)
      coefficients[i] -= (lr / n) * gradCoef[i];
  }

  return { intercept, coefficients };
}

function predictProba(features, model) {
  let z = model.intercept;
  for (let i = 0; i < model.coefficients.length; i++)
    z += model.coefficients[i] * (features[i] ?? 0);
  return sigmoid(z);
}

function evaluate(samples, model, threshold = 0.5) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  const scores = [];
  for (const { features, label } of samples) {
    const prob = predictProba(features, model);
    scores.push({ prob, label });
    const pred = prob >= threshold ? 1 : 0;
    if (label === 1 && pred === 1) tp++;
    else if (label === 0 && pred === 1) fp++;
    else if (label === 0 && pred === 0) tn++;
    else fn++;
  }
  const n = samples.length;
  const accuracy = n === 0 ? 0 : (tp + tn) / n;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  const auc = Math.max(0, Math.min(1, computeAUC(scores)));
  return { accuracy, precision, recall, f1, auc, tp, fp, tn, fn, n };
}

function computeAUC(scores) {
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

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function run() {
  const dataPath = path.join(process.cwd(), "data", "training-data.json");
  let raw;
  try {
    raw = await fs.readFile(dataPath, "utf-8");
  } catch (e) {
    console.error("Run export-recommendation-data.js first to create", dataPath);
    process.exit(1);
  }

  const { featureOrder, samples } = JSON.parse(raw);
  if (!samples.length) {
    console.warn("No samples in training data. Writing a fallback model (zero weights).");
    const outPath = path.join(process.cwd(), "data", "recommendation-model.json");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(
      outPath,
      JSON.stringify(
        {
          featureOrder,
          intercept: 0,
          coefficients: featureOrder.map(() => 0),
        },
        null,
        2
      )
    );
    console.log("Wrote", outPath);
    process.exit(0);
    return;
  }

  const byUser = new Map();
  for (const s of samples) {
    const uid = s.userId ?? "unknown";
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid).push({ features: s.features, label: s.label });
  }
  const userIds = shuffle([...byUser.keys()]);
  const nUsers = userIds.length;
  const nTrain = Math.max(0, Math.floor(TRAIN_RATIO * nUsers));
  const nVal = Math.max(0, Math.floor(VAL_RATIO * nUsers));
  const nTest = nUsers - nTrain - nVal;

  let trainSamples = [];
  const valSamples = [];
  const testSamples = [];
  for (let i = 0; i < nUsers; i++) {
    const list = byUser.get(userIds[i]);
    if (i < nTrain) trainSamples.push(...list);
    else if (i < nTrain + nVal) valSamples.push(...list);
    else testSamples.push(...list);
  }

  let skipEval = false;
  if (trainSamples.length === 0) {
    console.warn("Train set empty (too few users). Training on all samples; skipping evaluation.");
    trainSamples = [...samples.map((s) => ({ features: s.features, label: s.label }))];
    skipEval = true;
  }

  const { intercept, coefficients } = train(trainSamples, featureOrder);
  const model = { featureOrder, intercept, coefficients };

  const outPath = path.join(process.cwd(), "data", "recommendation-model.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(model, null, 2));
  console.log("Model saved to", outPath);

  const metrics = { train: {}, val: {}, test: {} };
  if (!skipEval) {
    if (trainSamples.length) metrics.train = evaluate(trainSamples, model);
    if (valSamples.length) metrics.val = evaluate(valSamples, model);
    if (testSamples.length) metrics.test = evaluate(testSamples, model);
  }

  const hasEval = !skipEval && (valSamples.length > 0 || testSamples.length > 0);
  if (hasEval) {
    console.log("\n--- Evaluation (70/15/15 split by user) ---");
    console.log(`Train: ${trainSamples.length} samples (${nTrain} users)`);
    if (valSamples.length) console.log(`Val:   ${valSamples.length} samples (${nVal} users)`);
    if (testSamples.length) {
      console.log(`Test:  ${testSamples.length} samples (${nTest} users)`);
      console.log("\nTest set metrics:");
      console.log("  Accuracy: ", metrics.test.accuracy.toFixed(4));
      console.log("  Precision:", metrics.test.precision.toFixed(4));
      console.log("  Recall:   ", metrics.test.recall.toFixed(4));
      console.log("  F1:       ", metrics.test.f1.toFixed(4));
      console.log("  AUC-ROC:  ", metrics.test.auc.toFixed(4));
    }
    const metricsPath = path.join(process.cwd(), "data", "eval-metrics.json");
    await fs.writeFile(metricsPath, JSON.stringify(metrics, null, 2));
    console.log("\nMetrics written to", metricsPath);
  } else if (skipEval) {
    await fs.writeFile(
      path.join(process.cwd(), "data", "eval-metrics.json"),
      JSON.stringify({ note: "Skipped (train set was empty; trained on all data)." }, null, 2)
    );
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
