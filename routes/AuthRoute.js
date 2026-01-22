import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if username exists
    const usernameExisting = await User.findOne({ username });
    if (usernameExisting) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const emailExisting = await User.findOne({ email });
    if (emailExisting) {
      return res.status(409).json({ error: "Email already taken" });
    }

    // Hashing the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      streakData: {
        startDate: dayjs(Date.now(), "DD-MM-YYYY").startOf("day"),
        endDate: dayjs(Date.now(), "DD-MM-YYYY").startOf("day"),
        currentDuration: 1,
        maxStartDate: dayjs(Date.now(), "DD-MM-YYYY").startOf("day"),
        maxEndDate: dayjs(Date.now(), "DD-MM-YYYY").startOf("day"),
        maxDuration: 1,
      },
      revisionData: {
        forgotten: 0,
        difficult: 0,
        medium: 0,
        easy: 0,
        very_easy: 0,
      },
    });

    req.session.user = {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const newUser = await User.findOne({ username });
    if (!newUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // compare password with hash stored in the database
    const isMatch = await bcrypt.compare(password, newUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    //If logging in on the following day, increase streak
    if (
      newUser.streakData.endDate ==
      dayjs(Date.now(), "DD-MM-YYYY").subtract(1, "day").format("DD-MM-YYYY")
    ) {
      newUser.streakData.currentDuration++;
      newUser.streakData.endDate == dayjs(Date.now(), "DD-MM-YYYY");
    } else {
      newUser.streakData.currentDuration = 1;
      newUser.streakData.startDate == dayjs(Date.now(), "DD-MM-YYYY");
      newUser.streakData.endDate == dayjs(Date.now(), "DD-MM-YYYY");
    }

    if (newUser.streakData.currentDuration > newUser.streakData.maxDuration) {
      newUser.streakData.maxEndDate == dayjs(Date.now(), "DD-MM-YYYY");
      newUser.streakData.maxStartDate == newUser.streakData.startDate;
      newUser.streakData.maxDuration = newUser.streakData.currentDuration;
    }
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      decks: newUser.decks,
      role: newUser.role,
    };

    await newUser.save();

    res.json({
      message: "Login successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.status(200).json({ message: "User logged out successfully" });
  });
});

export default router;
