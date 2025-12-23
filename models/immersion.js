import mongoose from "mongoose";

const immersionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    likes: { type: Number, default: 0, required: true },
    uploader: { type: String, required: true },
    genres: [String],
    level: { type: String, required: true },
    img_path: { type: String, required: true },
  },
  { collection: "immersion" }
);

export default mongoose.model("immersion", immersionSchema);
