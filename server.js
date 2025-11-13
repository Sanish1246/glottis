import dotenv from "dotenv";
import axios from "axios";
import session from "express-session";
import express from "express";
import ngrok from "ngrok";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { connectToDb } from "./db.js";
import whatsappRoutes from "./routes/WhatsappRoute.js";
import chatbotRoutes from "./routes/ChatbotRoute.js";
import userRoutes from "./routes/UserRoute.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 8000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";
const APP_ID = process.env.APP_ID;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files
app.use(express.static(path.join(__dirname)));

app.use("/", userRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/webhook", whatsappRoutes);

app.use(
  session({
    secret: "Sanish12",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// //serving the main html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function startServer() {
  await connectToDb();
  // Starting server + ngrok
  app.listen(PORT, async () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);

    try {
      const url = await ngrok.connect(PORT);
      console.log(`🌍 Ngrok active`);

      // Update ngrok endpoint automatically
      await axios.post(
        `https://graph.facebook.com/v22.0/${APP_ID}/subscriptions`,
        {
          object: "whatsapp_business_account",
          callback_url: `${url}/webhook`,
          verify_token: VERIFY_TOKEN,
          fields: "messages",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.APP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Webhook updated on Meta");
    } catch (err) {
      console.error(
        "❌ Error starting ngrok or updating Meta Webhook:",
        err.response?.data || err
      );
    }
  });
}

startServer();
