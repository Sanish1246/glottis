import dayjs from "dayjs";
import User from "../models/user";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendFlashcardReminders() {
  const todayStr = dayjs().format("DD-MM-YYYY");

  const users = await User.find({
    "decks.flashcards.dueDate": { $lte: todayStr },
  });

  for (const user of users) {
    let dueCount = 0;

    user.decks.forEach((deck) => {
      deck.flashcards.forEach((card) => {
        if (card.dueDate <= today) {
          dueCount++;
        }
      });
    });

    if (dueCount > 0) {
      await sendReminderEmail(user.email, dueCount);
    }
  }
}

async function sendReminderEmail(email, dueCount) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You have flashcards to review today!",
    text: `You have ${dueCount} flashcards due today. Keep your streak alive!`,
  });
}
