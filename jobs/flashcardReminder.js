import dayjs from "dayjs";
import User from "../models/user.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendFlashcardReminders() {
  const today = dayjs().startOf("day");
  const users = await User.find({
    "decks.items.dueDate": { $exists: true },
  }).lean();
  for (const user of users) {
    let dueCount = 0;
    for (const deck of user.decks || []) {
      for (const card of deck.items || []) {
        console.log(card);
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
