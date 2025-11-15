import express from "express";
import Lesson from "../models/lesson.js";

const router = express.Router();

router.get("/:lang", async (req, res) => {
  try {
    const lang = req.params.lang;
    let lessons = await Lesson.find({ language: lang });
    lessons = lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
    res.json(lessons);
  } catch (err) {
    console.error("Unable to get lesson:", err);
    res.status(500).json({ error: "Server while fetching lesson" });
  }
});

export default router;
