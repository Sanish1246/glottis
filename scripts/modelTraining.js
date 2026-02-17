import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  trainModel,
  evaluateModel,
  seededRandom,
  shuffle,
} from "../utils/mlTrainingUtils.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//70/15/15 ratio for test, train and validation
const TRAIN = 0.7;
const VAL = 0.15;

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

  //Splitting dataset in test-validation-train
  // TRAIN_RANDOM_STATE used for reproducible splits
  const randomState =
    process.env.TRAIN_RANDOM_STATE != null
      ? parseInt(process.env.TRAIN_RANDOM_STATE, 10)
      : null;
  const userIds = shuffle(
    [...byUser.keys()],
    randomState != null ? seededRandom(randomState) : null,
  );

  //Splitting 70-15-15
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
