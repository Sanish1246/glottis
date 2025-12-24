import express from "express";
import Immersion from "../models/immersion.js";
const router = express.Router();

router.get("/:lang/:level", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;
    console.log(lang, +"  " + level);
    let medias;
    if (level == "none") {
      medias = await Immersion.find({ language: lang });
    } else {
      medias = await Immersion.find({ language: lang, level: level });
    }

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

    const { username } = req.session.user;

    medias = await Immersion.find({
      $regex: searchTitle,
      $options: "i",
    });

    res.json(medias);
  } catch (err) {
    console.error("Unable to get users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

export default router;
