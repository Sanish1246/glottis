import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

import express from "express";

import QRCode from "qrcode";

const router = express.Router();

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

router.get("/qr", async (req, res) => {
  try {
    const waNumber = process.env.WHATSAPP_NUM; //Phone number of the chatbot
    const chatLink = `https://wa.me/${waNumber}`;
    const qr = await QRCode.toDataURL(chatLink); //Generate QR code
    res.json({ qr });
  } catch (err) {
    console.error("❌ Error while generating QR:", err);
    res.status(500).json({ error: err });
  }
});

// Function to send messages on whatsapp
async function sendWhatsAppMessage(to, text) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    console.error("❌ Error sending to  WhatsApp:", err.response?.data || err);
  }
}

//Verify Meta Webhook
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

//POST request to send messages
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;
      const userMessage = msg.text?.body;

      if (!userMessage) {
        await sendWhatsAppMessage(
          from,
          "Sorry, I can only process text messages for now.",
        );
        return;
      }

      if (userMessage) {
        const prePrompt =
          " You are a language learning expert chatbot called Athena, for the website Glottis. Your tasks are: 1. Identify the language of the user's message. 2. Check for any grammatical, spelling, or usage errors. 3. If there are errors, point them out briefly and clearly, with a short explanation in english. 4. If there are no errors, confirm that the message is correct. 5. Then answer the user's question fully and naturally in the same language, keeping your tone friendly and supportive. In your answer, you can start directly from the correction of the error, if any";
        // Gemini Api call
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(
          prePrompt + " The user's message is: " + userMessage,
        );
        const responseText = (await result.response).text();

        await sendWhatsAppMessage(from, responseText);
      }
    }
  } catch (err) {
    console.error("❌ Error in handling the message:", err);
  }

  res.sendStatus(200);
});

export default router;
