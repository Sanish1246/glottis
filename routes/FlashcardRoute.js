import express from "express";
import FlashcardDeck from "../models/flashcardDeck.js";
const router = express.Router();

router.get("/:lang/:level", async (req, res) => {
  try {
    const lang = req.params.lang;
    const level = req.params.level;
    let decks = await FlashcardDeck.find({ language: lang, level: level });
    decks = decks.sort((a, b) => a.number - b.number);
    res.json(decks);
  } catch (err) {
    console.error("Unable to get flashcard decks:", err);
    res.status(500).json({ error: "Server while fetching decks" });
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

export default router;
