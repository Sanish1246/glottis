//This file will be used to create training data for the model based on the data present in the DB
import { connectToDb } from "../db.js";
import User from "../models/user.js";
import Immersion from "../models/immersion.js";
import { FEATURE_ORDER, buildFeatures } from "../utils/recommendationModel.js";
import fs from "fs/promises";
import path from "path";

const NEGATIVES_PER_POSITIVE = 2; //For every liked item, sample 2 items without like

async function run() {
  await connectToDb();

  //Fetching users that have liked at least on media
  const users = await User.find({ "likes.0": { $exists: true } })
    .select("_id likes")
    .lean();

  if (!users.length) {
    console.log("No users with likes found. Creating empty training data.");
    const outPath = path.join(process.cwd(), "data", "training-data.json");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(
      outPath,
      JSON.stringify({ featureOrder: FEATURE_ORDER, samples: [] }, null, 2),
    );
    process.exit(0);
    return;
  }

  //Getting all medias and storing their features
  const medias = await Immersion.find({
    status: { $nin: ["Rejected", "Pending"] },
  })
    .select("title language level type likes")
    .lean();

  //Indexing by title
  const titleIndex = new Map(medias.map((i) => [i.title, i]));

  const samples = [];

  for (const user of users) {
    const titles = (user.likes || []).map((l) => l.title).filter(Boolean);
    if (!titles.length) continue;

    //Checking if the items liked by a user are actually present in the system
    const likedItems = titles.map((t) => titleIndex.get(t)).filter(Boolean);
    if (!likedItems.length) continue;

    //Building profile for the user
    const profile = {
      languages: [...new Set(likedItems.map((i) => i.language))],
      levels: [...new Set(likedItems.map((i) => i.level))],
      types: [...new Set(likedItems.map((i) => i.type))],
    };

    const seen = new Set(titles); //Avoids sampling negative for items already liked by he user

    const userId = user._id.toString();

    //Pushing each liked item to the samples, providing positive feedback
    for (const item of likedItems) {
      samples.push({
        features: buildFeatures(item, profile),
        label: 1,
        userId,
      });
    }

    //Getting negative samples
    const unseen = medias.filter((i) => !seen.has(i.title));

    const numNeg = Math.min(
      unseen.length,
      likedItems.length * NEGATIVES_PER_POSITIVE,
    );

    //Inserting random negative samples
    for (let i = 0; i < numNeg; i++) {
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
  //Saving the updated samples
  const outPath = path.join(process.cwd(), "data", "training-data.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(
    outPath,
    JSON.stringify({ featureOrder: FEATURE_ORDER, samples }, null, 2),
  );
  console.log(`Exported ${samples.length} samples to ${outPath}`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
