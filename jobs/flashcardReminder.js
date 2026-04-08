import dayjs from "dayjs";
import mongoose from "mongoose";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import { connectToDb } from "../db.js";

//Create transporter to send the mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendFlashcardReminders() {
  await connectToDb();

  const today = dayjs().startOf("day");
  const users = await User.find({
    "decks.items.dueDate": { $exists: true },
  }).lean();

  for (const user of users) {
    let dueCount = 0;
    for (const deck of user.decks || []) {
      for (const card of deck.items || []) {
        if (!card.dueDate) continue;

        const due = dayjs(card.dueDate);

        if (
          due.isValid() &&
          (due.isBefore(today, "day") || due.isSame(today, "day"))
        ) {
          dueCount++;
        }
      }
    }
    if (dueCount > 0) await sendReminderEmail(user.email, dueCount);
  }

  mongoose.connection.close();
}

async function sendReminderEmail(email, dueCount) {
  console.log("Sending email");
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You have flashcards to review today!",
    text: `You have ${dueCount} flashcards due today!`,
  });
}

sendFlashcardReminders()
  .then(() => {
    console.log("Reminder job completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Reminder job failed:", err);
    process.exit(1);
  });
