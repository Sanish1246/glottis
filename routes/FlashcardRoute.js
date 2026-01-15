import express from "express";
import FlashcardDeck from "../models/flashcardDeck.js";
const router = express.Router();

router.get("/:lang/:level", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;
    let decks = await FlashcardDeck.find({
      language: lang,
      level: level,
      status: { $ne: "Pending" },
    });
    decks = decks.sort((a, b) => a.number - b.number);
    res.json(decks);
  } catch (err) {
    console.error("Unable to get flashcard decks:", err);
    res.status(500).json({ error: "Server while fetching decks" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    if (req.session?.user.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const targetStatus = "Pending";
    let decks = await FlashcardDeck.find({
      status: targetStatus,
    });
    res.json(decks);
  } catch (err) {
    console.error("Unable to get flashcard decks:", err);
    res.status(500).json({ error: "Server while fetching decks" });
  }
});

router.put("/approve/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.session?.user?.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const deck = await FlashcardDeck.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json({ message: "Deck approved!" });
  } catch (err) {
    console.error("Unable to get deck:", err);
    res.status(500).json({ error: "Server error while fetching deck" });
  }
});

router.put("/reject/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.session?.user?.role !== "admin") {
      return res.status(401).json({ error: "You don't have permissions!" });
    }
    const deck = await FlashcardDeck.findByIdAndUpdate(
      id,
      { status: "Rejected" },
      { new: true }
    );
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json({ message: "Deck rejected!" });
  } catch (err) {
    console.error("Unable to get deck:", err);
    res.status(500).json({ error: "Server error while fetching deck" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const deck = await FlashcardDeck.findById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }
    res.json(deck);
  } catch (err) {
    console.error("Unable to get deck:", err);
    res.status(500).json({ error: "Server error while fetching deck" });
  }
});

router.post("/submit", async (req, res) => {
  const deck = req.body;
  console.log(req.body);
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const newDeck = {
      ...deck,
      author: req.session.user.username,
      status: "Pending",
    };

    const created = await FlashcardDeck.create(newDeck);
    res.json({ message: "Deck submitted successfully!", created });
  } catch (err) {
    console.error("Unable to submit deck:", err);
    res.status(500).json({ error: "Server error while submitting" });
  }
});

router.get("/customDecks/:lang/:level", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;
    const defaultAuthor = "Glottis";
    let decks = await FlashcardDeck.find({
      language: lang,
      level: level,
      author: { $ne: defaultAuthor },
      status: "Approved",
    });
    res.json(decks);
  } catch (err) {
    console.error("Unable to get flashcard decks:", err);
    res.status(500).json({ error: "Server while fetching decks" });
  }
});

export default router;
