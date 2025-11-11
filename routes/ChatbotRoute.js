import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const userMessage = req.body.query;

  const prompt = userMessage;
  const result = await model.generateContent(prompt);

  // Process the user message and generate a response
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.json({ response: text });
});
export default router;
