import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import Immersion from "../models/immersion.js";
import User from "../models/user.js";

const router = express.Router();

async function recommend(userId, limit = 5) {
  //Getting the user's likes
  const user = await User.findById(userId).lean();
  console.log(user);
  if (!user || !user.likes || !user.likes.length) return []; // cold start

  // 2. build profile
  const titles = user.likes.map((i) => i.title);
  const profile = await Immersion.find({ title: { $in: titles } })
    .select("language level genres")
    .lean();

  const languages = [...new Set(profile.map((p) => p.language))];
  const levels = [...new Set(profile.map((p) => p.level))];
  const genres = [...new Set(profile.map((p) => p.genres).flat())];

  // 3. unseen items that match at least one genre OR same (lang + level)
  const query = {
    title: { $nin: titles }, // unseen
    $or: [
      { genres: { $in: genres } },
      { $and: [{ language: { $in: languages } }, { level: { $in: levels } }] },
    ],
  };

  return Immersion.find(query).select("-__v").limit(limit).lean();
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
    if (!req.session?.user.role == "admin") {
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
      { new: true }
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
      { new: true }
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
  console.log(req.session.user.id);
  try {
    const list = await recommend(req.session.user.id, 5);
    console.log(list);
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
