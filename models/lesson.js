import mongoose from "mongoose";

const DialogueLineSchema = new mongoose.Schema({
  speaker: { type: String, required: true },
  text: { type: String, required: true },
  english: { type: String },
  audio: { type: String },
});

const DialogueBlockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  scene: { type: String, required: true },
  type: { type: String, required: true },
  media: { type: String },
  lines: [DialogueLineSchema],
});

const VocabularyItemSchema = new mongoose.Schema({
  word: { type: String, required: true },
  english: { type: String, required: true },
  audio: { type: String },
});

const VocabularyCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [VocabularyItemSchema],
});

const GrammarContentSchema = new mongoose.Schema({
  point: { type: String, required: true },
  english: { type: String, required: true },
  example: { type: String },
  audio: { type: String },
});

const GrammarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String },
  content: [GrammarContentSchema],
  notes: [String],
});

const FillInBlankSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
});

const McqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
});

const CulturalNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [String],
});

const AdditionalResourceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const SummarySchema = new mongoose.Schema({
  grammarPoints: [String],
  skills: [String],
});

const LessonSchema = new mongoose.Schema({
  language: { type: String, required: true },

  voice_language: { type: String },

  level: { type: String, required: true },
  lessonNumber: { type: Number },
  lessonNumber_level: { type: Number },
  title: { type: String, required: true },

  objectives: [String],

  introduction: {
    dialogues: [DialogueBlockSchema],
  },

  vocabulary: [VocabularyCategorySchema],
  grammar: [GrammarSchema],
  fib: [FillInBlankSchema],
  mcq: [McqSchema],

  cultural_note: CulturalNoteSchema,

  additional_resources: [AdditionalResourceSchema],

  summary: SummarySchema,
  author: { type: String },
  status: { type: String },
});

export default mongoose.model("lessons", LessonSchema);
