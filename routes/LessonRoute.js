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
    console.error("Unable to get lessons:", err);
    res.status(500).json({ error: "Server while fetching lessons" });
  }
});

router.get("/content/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(lesson);
  } catch (err) {
    console.error("Unable to get lesson:", err);
    res.status(500).json({ error: "Server error while fetching lesson" });
  }
});

export default router;
