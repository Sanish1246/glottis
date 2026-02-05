# Recommendation model (Option A)

Train a small model on user likes to score immersion recommendations.

## 1. Export training data

From the project root (with `MONGODB_URI` in `.env`):

```bash
node scripts/export-recommendation-data.js
```

Writes `data/training-data.json` (users’ likes + sampled negatives, same features as in the route).

## 2. Train the model

```bash
node scripts/train-recommendation-model.js
```

Reads `data/training-data.json`, splits by user into 70% train / 15% validation / 15% test, trains logistic regression on the train set, writes `data/recommendation-model.json` and `data/eval-metrics.json`. Evaluation metrics (Accuracy, Precision, Recall, F1, AUC-ROC) are printed for the test set and saved in `eval-metrics.json`.

## 3. Use in the app

The server loads `data/recommendation-model.json` on first recommendation request. If the file is missing or empty, it falls back to the heuristic scorer. No restart needed after training: replace the JSON and the next request will load the new model (current implementation caches the model for the process lifetime; restart the server to pick up a new file).

## Retraining

Re-run steps 1 and 2 when you have more likes (e.g. weekly). Then restart the server to load the new model.
