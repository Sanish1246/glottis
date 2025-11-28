import mongoose from "mongoose";

const VocabularyItemSchema = new mongoose.Schema({
  word: { type: String, required: true },
  english: { type: String, required: true },
  audio: { type: String },
});

const flashcardDeckSchema = new mongoose.Schema({
  level: { type: String, required: true },
  category: { type: String, required: true },
  language: { type: String, required: true },
  number: { type: Number },
  noOfCards: { type: Number },
  author: { type: String },
  likes: { type: Number },

  items: [VocabularyItemSchema],
});

export default mongoose.model("flashcards", flashcardDeckSchema);
