import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import Immersion from "../models/immersion.js";
import User from "../models/user.js";
import {
  loadRecommendationModel,
  buildFeatures,
  predictProb,
} from "../utils/recommendationModel.js";

const router = express.Router();

async function recommend(userId, limit = 3) {
  const user = await User.findById(userId).lean();
  if (!user || !user.likes || !user.likes.length) return [];

  const titles = user.likes.map((i) => i.title);
  const likedItems = await Immersion.find({ title: { $in: titles } })
    .select("language level type genres")
    .lean();

  const languages = [...new Set(likedItems.map((p) => p.language))];
  const levels = [...new Set(likedItems.map((p) => p.level))];
  const types = [...new Set(likedItems.map((p) => p.type).filter(Boolean))];
  const genres = [...new Set(likedItems.map((p) => p.genres).flat())];

  const profile = { languages, levels, types };

  const query = {
    title: { $nin: titles },
    status: { $nin: ["Rejected", "Pending"] },
    $or: [
      { genres: { $in: genres } },
      { language: { $in: languages } },
      { level: { $in: levels } },
      { type: { $in: types } },
    ],
  };

  const candidateLimit = 50;
  const candidates = await Immersion.find(query)
    .select("-__v")
    .limit(candidateLimit)
    .lean();

  const model = await loadRecommendationModel();

  if (model) {
    for (const item of candidates) {
      const features = buildFeatures(item, profile);
      item._score = predictProb(features, model);
    }
  } else {
    for (const item of candidates) {
      let score = 0;
      if (languages.includes(item.language)) score += 3;
      if (levels.includes(item.level)) score += 2;
      const genreMatches = (item.genres || []).filter((g) =>
        genres.includes(g),
      ).length;
      score += 2 * genreMatches;
      score += Math.log(1 + (item.likes ?? 0));
      item._score = score;
    }
  }

  candidates.sort((a, b) => (b._score ?? 0) - (a._score ?? 0));
  const top = candidates.slice(0, limit);
  top.forEach((item) => delete item._score);
  return top;
}

router.get("/:lang/:level/:page", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;
    const page = req.params.page;
    const limit = 9;

    const skipAmount = (parseInt(page) - 1) * parseInt(limit);

    let medias;
    if (level == "none") {
      medias = await Immersion.find({
        language: lang,
        status: { $nin: ["Rejected", "Pending"] },
      })
        .skip(skipAmount)
        .limit(parseInt(limit));
    } else {
      medias = await Immersion.find({
        language: lang,
        level: level,
        status: { $nin: ["Rejected", "Pending"] },
      })
        .skip(skipAmount)
        .limit(parseInt(limit));
    }

    res.json(medias);
  } catch (err) {
    console.error("Unable to get medias:", err);
    res.status(500).json({ error: "Server while fetching medias" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    if (req.session?.user.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }

    const medias = await Immersion.find({ status: "Pending" });

    res.json(medias);
  } catch (err) {
    console.error("Unable to get medias:", err);
    res.status(500).json({ error: "Server while fetching medias" });
  }
});

router.put("/approve/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.session?.user?.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const media = await Immersion.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true },
    );
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json({ message: "Media approved!" });
  } catch (err) {
    console.error("Unable to get media:", err);
    res.status(500).json({ error: "Server error while fetching media" });
  }
});

router.put("/reject/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.session?.user?.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const media = await Immersion.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true },
    );
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json({ message: "Media rejected!" });
  } catch (err) {
    console.error("Unable to get media:", err);
    res.status(500).json({ error: "Server error while fetching media" });
  }
});

router.get("/searchMedia/:page", async (req, res) => {
  const searchTitle = req.query.m;
  const page = req.params.page;
  const limit = 9;

  const skipAmount = (parseInt(page) - 1) * parseInt(limit);
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const medias = await Immersion.find({
      title: {
        $regex: searchTitle,
        $options: "i",
      },
    })
      .skip(skipAmount)
      .limit(parseInt(limit));

    res.json(medias);
  } catch (err) {
    console.error("Unable to get users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

const __filename = fileURLToPath(import.meta.url);

router.post("/submitMedia", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const mediaField = req.body?.media;
    const media = mediaField
      ? typeof mediaField === "string"
        ? JSON.parse(mediaField)
        : mediaField
      : {};

    const files = req.files?.coverImage
      ? Array.isArray(req.files.coverImage)
        ? req.files.coverImage
        : [req.files.coverImage]
      : [];

    const uploadDir = path.join(process.cwd(), "public", "immersion");
    await fs.mkdir(uploadDir, { recursive: true });

    const savedFiles = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const dest = path.join(uploadDir, fileName);
      await fs.writeFile(dest, file.data);
      savedFiles.push({ name: fileName, path: `/immersion/${fileName}` });
    }

    const newMedia = {
      ...media,
      uploader: req.session.user.username,
      img_path: savedFiles.length
        ? savedFiles[0].path
        : "/immersion/no-image.jpg",
      status: "Pending",
    };

    const created = await Immersion.create(newMedia);
    res.json({ message: "Media submitted successfully!", created });
  } catch (err) {
    console.error("Unable to submit media:", err);
    res.status(500).json({ error: "Server error while submitting" });
  }
});

router.get("/recommendations", async (req, res) => {
  if (!req.session?.user)
    return res.status(401).json({ error: "Not authenticated" });
  try {
    const list = await recommend(req.session.user.id, 3);
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
