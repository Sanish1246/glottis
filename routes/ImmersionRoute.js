import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import Immersion from "../models/immersion.js";
const router = express.Router();

router.get("/:lang/:level", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;

    let medias;
    if (level == "none") {
      medias = await Immersion.find({
        language: lang,
        status: { $ne: "Pending" },
      });
    } else {
      medias = await Immersion.find({
        language: lang,
        level: level,
        status: { $ne: "Pending" },
      });
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

router.get("/searchMedia", async (req, res) => {
  const searchTitle = req.query.m;
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const medias = await Immersion.find({
      title: {
        $regex: searchTitle,
        $options: "i",
      },
    });

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

export default router;
