/**
 * Export training data for the recommendation model (Option A).
 * Run from project root: node scripts/export-recommendation-data.js
 * Requires MONGODB_URI in .env. Writes data/training-data.json.
 */
import { connectToDb } from "../db.js";
import User from "../models/user.js";
import Immersion from "../models/immersion.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FEATURE_ORDER = ["language_match", "level_match", "genre_overlap", "log_likes"];
const NEGATIVES_PER_POSITIVE = 2;

function buildFeatures(item, profile) {
  const { languages, levels, genres } = profile;
  const language_match = languages.includes(item.language) ? 1 : 0;
  const level_match = levels.includes(item.level) ? 1 : 0;
  const genre_overlap = (item.genres || []).filter((g) => genres.includes(g)).length;
  const log_likes = Math.log(1 + (item.likes ?? 0));
  return [language_match, level_match, genre_overlap, log_likes];
}

async function run() {
  await connectToDb();

  const users = await User.find({ "likes.0": { $exists: true } })
    .select("_id likes")
    .lean();
  if (!users.length) {
    console.log("No users with likes found. Writing empty training data.");
    const outPath = path.join(process.cwd(), "data", "training-data.json");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(
      outPath,
      JSON.stringify({ featureOrder: FEATURE_ORDER, samples: [] }, null, 2)
    );
    process.exit(0);
    return;
  }

  const allItems = await Immersion.find({
    status: { $nin: ["Rejected", "Pending"] },
  })
    .select("title language level genres likes")
    .lean();
  const itemsByTitle = new Map(allItems.map((i) => [i.title, i]));

  const samples = [];

  for (const user of users) {
    const titles = (user.likes || []).map((l) => l.title).filter(Boolean);
    if (!titles.length) continue;

    const likedItems = titles
      .map((t) => itemsByTitle.get(t))
      .filter(Boolean);
    if (!likedItems.length) continue;

    const profile = {
      languages: [...new Set(likedItems.map((i) => i.language))],
      levels: [...new Set(likedItems.map((i) => i.level))],
      genres: [...new Set(likedItems.flatMap((i) => i.genres || []))],
    };

    const seen = new Set(titles);

    const userId = user._id.toString();
    for (const item of likedItems) {
      samples.push({
        features: buildFeatures(item, profile),
        label: 1,
        userId,
      });
    }

    const unseen = allItems.filter((i) => !seen.has(i.title));
    const nNeg = Math.min(
      unseen.length,
      likedItems.length * NEGATIVES_PER_POSITIVE
    );
    for (let i = 0; i < nNeg; i++) {
      const idx = Math.floor(Math.random() * unseen.length);
      const item = unseen[idx];
      unseen.splice(idx, 1);
      samples.push({
        features: buildFeatures(item, profile),
        label: 0,
        userId,
      });
    }
  }

  const outPath = path.join(process.cwd(), "data", "training-data.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(
    outPath,
    JSON.stringify({ featureOrder: FEATURE_ORDER, samples }, null, 2)
  );
  console.log(`Exported ${samples.length} samples to ${outPath}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
