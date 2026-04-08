import dotenv from "dotenv";
import axios from "axios";
import ngrok from "ngrok";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { connectToDb } from "./db.js";
import whatsappRoutes from "./routes/WhatsappRoute.js";
import { app } from "./app.js";

dotenv.config();

app.use("/webhook", whatsappRoutes);

const server = http.createServer(app);

//Creating a Socket.io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 8000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";
const APP_ID = process.env.APP_ID;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Socket.io configuration
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", (data) => {
    // Emit to everyone in the room (including sender)
    io.to(data.room).emit("receive_message", data);
    console.log(
      `Message from ${data.sender} in room ${data.room}:`,
      data.content,
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

async function startServer() {
  await connectToDb();
  // Starting server + ngrok for the whatsapp cloud api
  // ngrok is needed to expose the localhost server to create a webhook
  server.listen(PORT, async () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);

    try {
      const url = await ngrok.connect(PORT);
      console.log(`🌍 Ngrok active`);

      // Update ngrok endpoint automatically to allow access to the Whatsapp cloud API
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
        },
      );

      console.log("✅ Webhook updated on Meta");
    } catch (err) {
      console.error(
        "❌ Error starting ngrok or updating Meta Webhook:",
        err.response?.data || err,
      );
    }
  });
}

startServer();
