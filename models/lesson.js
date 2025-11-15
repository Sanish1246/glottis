import mongoose from "mongoose";

const AudioSchema = new mongoose.Schema({
  voice: { type: String },
});

const DialogueSchema = new mongoose.Schema({
  speaker: { type: String, required: true },
  text: { type: String, required: true },
  audio: { type: String },
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
  type: { type: String, required: true }, // es. "table"
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

const FinalQuizSchema = new mongoose.Schema({
  totalQuestions: { type: Number, required: true },
  passScore: { type: Number, required: true },
  sections: [String],
});

const CulturalNoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [String],
  media: {
    video: { type: String },
    images: [String],
  },
});

const SummarySchema = new mongoose.Schema({
  vocabularyCount: Number,
  grammarPoints: [String],
  skills: [String],
});

const LessonSchema = new mongoose.Schema({
  language: { type: String, required: true },
  level: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  estimatedTime: { type: String },

  objectives: [String],

  introduction: {
    scene: { type: String, required: true },
    dialogue: [DialogueSchema],
  },

  vocabulary: [VocabularyCategorySchema],
  grammar: [GrammarSchema],
  fib: [FillInBlankSchema],
  mcq: [McqSchema],

  final_quiz: FinalQuizSchema,

  cultural_note: CulturalNoteSchema,

  summary: SummarySchema,
});

export default mongoose.model("lessons", LessonSchema);
