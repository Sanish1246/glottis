import mongoose from "mongoose";

const immersionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true,unique:true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    likes: { type: Number, default: 0, required: true },
    uploader: { type: String, required: true },
    author: { type: String },
    genres: [String],
    type: { type: String, required: true },
    level: { type: String, required: true },
    img_path: { type: String, required: true },
    link: { type: String },
    status: { type: String },
  },
  { collection: "immersion" },
);

export default mongoose.model("immersion", immersionSchema);
