import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//70/15/15 ratio for test, train and validation
const TRAIN = 0.7;
const VAL = 0.15;

//Applying a sigmoid function to return a number between 0 and 1
function sigmoid(z) {
  //z is clamped between -20 and 20 to make the output more stable
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

function trainModel(samples, featureOrder, options = {}) {
  const { epochs = 500, lr = 0.05 } = options; //600 epochs and learning rate 0.1
  const numFeatures = featureOrder.length;

  //Initizlizing with 0 weights
  let intercept = 0;
  const coefficients = Array(numFeatures).fill(0);

  //Training loop for gradient descent
  for (let epoch = 0; epoch < epochs; epoch++) {
    //Gradient accumulation
    let gradIntercept = 0;
    const gradCoef = Array(numFeatures).fill(0);

    //Forward pass and error computation
    for (const { features, label } of samples) {
      const z =
        intercept + coefficients.reduce((s, w, i) => s + w * features[i], 0);
      const p = sigmoid(z);
      const err = p - label;
      gradIntercept += err;
      for (let i = 0; i < numFeatures; i++) gradCoef[i] += err * features[i];
    }

    const n = samples.length;
    intercept -= (lr / n) * gradIntercept;
    for (let i = 0; i < numFeatures; i++)
      coefficients[i] -= (lr / n) * gradCoef[i];
  }

  return { intercept, coefficients };
}

function predictProb(features, model) {
  let z = model.intercept;
  for (let i = 0; i < model.coefficients.length; i++)
    z += model.coefficients[i] * (features[i] ?? 0);
  return sigmoid(z);
}

//Using AUC ROC as the primary evaluation metric
function evaluateModel(samples, model) {
  const scores = [];
  for (const { features, label } of samples) {
    const prob = predictProb(features, model);
    scores.push({ prob, label });
  }
  const auc = Math.max(0, Math.min(1, computeAUC(scores)));
  return auc;
}

//Function to calucluate AUC ROC
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

//Shuffling users to ensure a truly random order when testing
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function run() {
  const dataPath = path.join(process.cwd(), "data", "training-data.json"); //Loading training data created from the other script
  let raw;
  try {
    raw = await fs.readFile(dataPath, "utf-8");
  } catch (e) {
    console.error("Run exportRecommendationData.js first to create", dataPath);
    process.exit(1);
  }

  const { featureOrder, samples } = JSON.parse(raw);

  //Empty dataset
  if (!samples.length) {
    console.warn(
      "No samples in training data. Writing a fallback model (zero weights).",
    );
    const outPath = path.join(
      process.cwd(),
      "data",
      "recommendation-model.json",
    );
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
        2,
      ),
    );
    console.log("Wrote", outPath);
    process.exit(0);
    return;
  }

  //Grouping the samples for each user
  const byUser = new Map();
  for (const s of samples) {
    const uid = s.userId ?? "unknown";
    if (!byUser.has(uid)) byUser.set(uid, []);
    byUser.get(uid).push({ features: s.features, label: s.label });
  }

  //Splitting dataset
  const userIds = shuffle([...byUser.keys()]);
  const nUsers = userIds.length;
  const trainSet = Math.max(0, Math.floor(TRAIN * nUsers));
  const valSet = Math.max(0, Math.floor(VAL * nUsers));
  const testSet = nUsers - trainSet - valSet;

  let trainSamples = [];
  const valSamples = [];
  const testSamples = [];
  for (let i = 0; i < nUsers; i++) {
    const list = byUser.get(userIds[i]);
    if (i < trainSet) trainSamples.push(...list);
    else if (i < trainSet + valSet) valSamples.push(...list);
    else testSamples.push(...list);
  }

  let skipEval = false;
  if (trainSamples.length === 0) {
    console.warn(
      "Train set empty (too few users). Training on all samples; skipping evaluation.",
    );
    trainSamples = [
      ...samples.map((s) => ({ features: s.features, label: s.label })),
    ];
    skipEval = true;
  }

  //Model training
  const { intercept, coefficients } = trainModel(trainSamples, featureOrder);
  const model = { featureOrder, intercept, coefficients };

  const outPath = path.join(process.cwd(), "data", "recommendation-model.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(model, null, 2));
  console.log("Model saved to", outPath);

  const metrics = { train: {}, val: {}, test: {} };
  if (!skipEval) {
    if (trainSamples.length)
      metrics.train = { auc: evaluateModel(trainSamples, model) };
    if (valSamples.length)
      metrics.val = { auc: evaluateModel(trainSamples, model) };
    if (testSamples.length)
      metrics.test = { auc: evaluateModel(trainSamples, model) };
  }

  const hasEval =
    !skipEval && (valSamples.length > 0 || testSamples.length > 0);
  if (hasEval) {
    console.log("\n--- Evaluation (70/15/15 split by user) ---");
    console.log(`Train: ${trainSamples.length} samples (${trainSet} users)`);
    if (valSamples.length)
      console.log(`Val:   ${valSamples.length} samples (${valSet} users)`);
    if (testSamples.length) {
      console.log(`Test:  ${testSamples.length} samples (${testSet} users)`);
      console.log("\nTest set metrics:");
      console.log("  AUC-ROC:  ", metrics.test.auc.toFixed(4));
    }
    const metricsPath = path.join(process.cwd(), "data", "eval-metrics.json");
    await fs.writeFile(metricsPath, JSON.stringify(metrics, null, 2));
    console.log("\nMetrics written to", metricsPath);
  } else if (skipEval) {
    await fs.writeFile(
      path.join(process.cwd(), "data", "eval-metrics.json"),
      JSON.stringify(
        { note: "Skipped (train set was empty; trained on all data)." },
        null,
        2,
      ),
    );
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
