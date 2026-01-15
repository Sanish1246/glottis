import express from "express";
import Lesson from "../models/lesson.js";

const router = express.Router();

router.get("/pending", async (req, res) => {
  try {
    if (req.session?.user.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }

    const lessons = await Lesson.find({ status: "Pending" });

    res.json(lessons);
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
    const deck = await Lesson.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );
    if (!deck) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json({ message: "Lesson approved!" });
  } catch (err) {
    console.error("Unable to get lesson:", err);
    res.status(500).json({ error: "Server error while fetching lesson" });
  }
});

router.put("/reject/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.session?.user?.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const deck = await Lesson.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    if (!deck) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json({ message: "Lesson rejected!" });
  } catch (err) {
    console.error("Unable to get Lesson:", err);
    res.status(500).json({ error: "Server error while fetching lesson" });
  }
});

router.get("/content/:lang/:no", async (req, res) => {
  try {
    const lesson = await Lesson.findOne({
      lessonNumber: req.params.no,
      language: req.params.lang,
    });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("Unable to get lesson:", err);
    res.status(500).json({ error: "Server error while fetching lesson" });
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

router.post("/submit", async (req, res) => {
  const lesson = req.body;
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const newLesson = {
      ...lesson,
      author: req.session.user.username,
      status: "Pending",
    };

    const created = await Lesson.create(newLesson);
    console.log(newLesson);
    res.json({ message: "Lesson submitted successfully!" });
  } catch (err) {
    console.error("Unable to submit lesson:", err);
    res.status(500).json({ error: "Server error while submitting" });
  }
});

router.get("/customLessons/:level", async (req, res) => {
  try {
    // const lang = req.params.lang;
    const level = req.params.level;
    // const defaultAuthor = "Glottis";
    let lessons = await Lesson.find({
      level: level,
      status: "Approved",
    });
    res.json(lessons);
  } catch (err) {
    console.error("Unable to get flashcard lessons:", err);
    res.status(500).json({ error: "Server while fetching lessons" });
  }
});

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

export default router;
