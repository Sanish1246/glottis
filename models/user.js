import mongoose from "mongoose";

const VocabularyItemSchema = new mongoose.Schema({
  word: { type: String, required: true },
  english: { type: String, required: true },
  audio: { type: String },
});

const flashcardDeckSchema = new mongoose.Schema({
  language: { type: String, required: true },
  items: [VocabularyItemSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, default: 0, required: true, unique: true },
  password: { type: String, required: true },
  decks: [flashcardDeckSchema],
});

export default mongoose.model("users", userSchema);
