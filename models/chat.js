import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: string },
});

const chatSchema = new mongoose.Schema({
  room: { type: String, required: true, unique: true },
  participants: [{ type: String, required: true }],
  messages: [messageSchema],
});

export default mongoose.model("chats", chatSchema);
