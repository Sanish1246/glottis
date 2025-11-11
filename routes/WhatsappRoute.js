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
    const waNumber = "15551710457"; //Phone number of the chatbot
    const chatLink = `https://wa.me/${waNumber}`;
    const qr = await QRCode.toDataURL(chatLink);
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
      }
    );
  } catch (err) {
    console.error("❌ Error sending to  WhatsApp:", err.response?.data || err);
  }
}

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

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const msg = body.entry[0].changes[0].value.messages[0];
      const from = msg.from;
      const userMessage = msg.text?.body;

      if (userMessage) {
        // Gemini Api call
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(userMessage);
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
