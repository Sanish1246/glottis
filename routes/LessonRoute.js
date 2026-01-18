import express from "express";
import Lesson from "../models/lesson.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

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

router.get("/existing/:title/:language", async (req, res) => {
  const checkTitle = req.params.title;
  const checkLang = req.params.language;

  try {
    if (req.session?.user.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }

    const lessons = await Lesson.find({
      language: checkLang,
      title: checkTitle,
      status: { $in: ["Approved", "Pending"] },
    });

    res.json(lessons);
  } catch (err) {
    console.error("Unable to get lessons:", err);
    res.status(500).json({ error: "Server while fetching lessons" });
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

// router.post("/submit", async (req, res) => {
//   const lesson = req.body;
//   try {
//     if (!req.session?.user) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     const newLesson = {
//       ...lesson,
//       author: req.session.user.username,
//       status: "Pending",
//     };

//     const created = await Lesson.create(newLesson);
//     console.log(newLesson);
//     res.json({ message: "Lesson submitted successfully!" });
//   } catch (err) {
//     console.error("Unable to submit lesson:", err);
//     res.status(500).json({ error: "Server error while submitting" });
//   }
// });

router.post("/submit", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const lessonField = req.body?.lesson;
    const lesson = lessonField
      ? typeof lessonField === "string"
        ? JSON.parse(lessonField)
        : lessonField
      : req.body;

    const files = req.files?.dialogueImages
      ? Array.isArray(req.files.dialogueImages)
        ? req.files.dialogueImages
        : [req.files.dialogueImages]
      : [];

    console.log("Files received:", files.length);
    console.log("Dialogues:", lesson.introduction?.dialogues.length);

    const uploadDir = path.join(process.cwd(), "public", "customLessons");
    await fs.mkdir(uploadDir, { recursive: true });

    // Process dialogue images - match files to dialogues that have media
    if (lesson.introduction?.dialogues) {
      let fileIndex = 0;
      for (let i = 0; i < lesson.introduction.dialogues.length; i++) {
        const dialogue = lesson.introduction.dialogues[i];

        // If dialogue has media placeholder (filename from upload) and we have files
        if (
          dialogue.media &&
          dialogue.media !== "" &&
          fileIndex < files.length
        ) {
          const file = files[fileIndex];
          const fileName = `${Date.now()}-${i}-${file.name}`;
          const dest = path.join(uploadDir, fileName);

          console.log(`Saving file ${fileIndex} to ${dest}`);
          await fs.writeFile(dest, file.data);

          lesson.introduction.dialogues[i].media = `/customLessons/${fileName}`;
          fileIndex++;
        }
      }
    }

    const newLesson = {
      ...lesson,
      author: req.session.user.username,
      status: "Pending",
    };

    await Lesson.create(newLesson);
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
    console.error("Unable to get lessons:", err);
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
