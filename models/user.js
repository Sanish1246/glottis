import mongoose from "mongoose";

const immersionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  language: { type: String, required: true },
  likes: { type: Number, default: 0, required: true },
  uploader: { type: String, required: true },
  genres: [String],
  level: { type: String, required: true },
  img_path: { type: String, required: true },
});

const VocabularyItemSchema = new mongoose.Schema({
  word: { type: String, required: true },
  english: { type: String, required: true },
  audio: { type: String },
  interval: { type: Number },
  repetition: { type: Number },
  efactor: { type: Number },
  dueDate: { type: String },
});

const flashcardDeckSchema = new mongoose.Schema({
  language: { type: String, required: true },
  items: [VocabularyItemSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, default: 0, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  decks: { type: [flashcardDeckSchema], default: [] },
  likes: { type: [immersionSchema], default: [] },
});

export default mongoose.model("users", userSchema);
