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
      console.log("Level is none");
    } else {
      medias = await Immersion.find({ language: lang, level: level });
      console.log("Level is not none");
    }

    console.log(medias);
    res.json(medias);
  } catch (err) {
    console.error("Unable to get medias:", err);
    res.status(500).json({ error: "Server while fetching medias" });
  }
});

export default router;
