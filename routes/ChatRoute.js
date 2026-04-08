import express from "express";
import Chat from "../models/chat.js";
const router = express.Router();

//POST request to send a message in the chat
router.post("/message", async (req, res) => {
  const message = req.body;
  try {
    const chat = await Chat.findOneAndUpdate(
      { room: message.room },
      { $push: { messages: message } },
      { new: true },
    );

    if (!chat) {
      return res.status(409).json({ error: "Chat room not found!" });
    }
    res.json(chat);
  } catch (err) {
    console.error("Unable to get chat:", err);
    res.status(500).json({ error: "Server while fetching chat" });
  }
});

//GET request to find an existing chatroom
router.get("/:room", async (req, res) => {
  const room = req.params.room;
  try {
    const chat = await Chat.findOne({ room: room });
    res.json(chat);
  } catch (err) {
    console.error("Unable to get chat:", err);
    res.status(500).json({ error: "Server while fetching chat" });
  }
});

//POST request to create a new chatroom
router.post("/:room", async (req, res) => {
  const room = req.params.room;
  try {
    const chat = await Chat.findOne({ room: room });
    if (chat) {
      return res.status(409).json({ error: "Chat room already existing" });
    }
    const newChat = await Chat.create({ room: room, messages: [] });
    res.json(newChat);
  } catch (err) {
    console.error("Unable to get chat:", err);
    res.status(500).json({ error: "Server while fetching chat" });
  }
});

export default router;
