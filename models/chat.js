import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String },
  sender: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  timestamp: { type: String },
});

const chatSchema = new mongoose.Schema({
  room: { type: String, required: true, unique: true },
  messages: [messageSchema],
});

export default mongoose.model("chats", chatSchema);
