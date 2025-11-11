import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ask", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  const userMessage = req.body.query;
  const prePrompt =
    " You are a, italian learning expert chatbot. Your tasks are: 1. Read the user's message. 2. Check for any grammatical, spelling, or usage errors. 3. If there are errors, point them out briefly and clearly, with a short explanation in english. 4. If there are no errors, confirm that the message is correct. 5. Then answer the user's question fully and naturally in the same language, keeping your tone friendly and supportive. In your answer, you can start directly from the correction of the error, if any";

  const prompt = userMessage;
  const result = await model.generateContent(
    prePrompt + " The user's message is: " + prompt
  );

  // Process the user message and generate a response
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.json({ response: text });
});
export default router;
