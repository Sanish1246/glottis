import express from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import userRoutes from "./routes/UserRoute.js";
import authRoutes from "./routes/AuthRoute.js";
import lessonRoutes from "./routes/LessonRoute.js";
import flashcardRoutes from "./routes/FlashcardRoute.js";
import immersionRoutes from "./routes/ImmersionRoute.js";
import chatRoutes from "./routes/ChatRoute.js";
import chatbotRoutes from "./routes/ChatbotRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Server
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

//Creatinng session cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Sanish12",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(express.static(path.join(__dirname)));

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/chat", chatRoutes);
app.use("/lessons", lessonRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/immersion", immersionRoutes);

//Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

export { app };
