import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { computeStreakUpdate } from "../utils/streakUtils.js";

const router = express.Router();

//POST register request
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
        startDate: dayjs(Date.now(), "DD-MM-YYYY").format("DD-MM-YYYY"),
        endDate: dayjs(Date.now(), "DD-MM-YYYY").format("DD-MM-YYYY"),
        currentDuration: 1,
        maxStartDate: dayjs(Date.now(), "DD-MM-YYYY").format("DD-MM-YYYY"),
        maxEndDate: dayjs(Date.now(), "DD-MM-YYYY").format("DD-MM-YYYY"),
        maxDuration: 1,
      },
      revisionData: {
        forgotten: 0,
        difficult: 0,
        medium: 0,
        easy: 0,
        very_easy: 0,
      },
      lessonsCompleted: {
        italian: 0,
        french: 0,
        custom: 0,
      },
    });

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      decks: newUser.decks,
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

//POST login request
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

    const today = dayjs().format("DD-MM-YYYY");
    const streakUpdate = computeStreakUpdate(newUser.streakData, today);
    if (streakUpdate) {
      newUser.streakData.currentDuration = streakUpdate.currentDuration;
      newUser.streakData.startDate = streakUpdate.startDate;
      newUser.streakData.endDate = streakUpdate.endDate;
      if (streakUpdate.maxDuration != null) {
        newUser.streakData.maxDuration = streakUpdate.maxDuration;
        newUser.streakData.maxStartDate = streakUpdate.maxStartDate;
        newUser.streakData.maxEndDate = streakUpdate.maxEndDate;
      }
    }
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      decks: newUser.decks,
      role: newUser.role,
    };

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

//Cleanup endpoint to remove credentials created during tests
router.post("/test/cleanup/user", async (req, res) => {
  // allowed when NODE_ENV === 'test' OR caller provides TEST_API_KEY via x-test-key
  if (
    process.env.NODE_ENV !== "test" &&
    req.headers["x-test-key"] !== process.env.TEST_API_KEY
  ) {
    return res.status(404).json({ error: "Not available" });
  }

  try {
    //Searching for th created user credentials
    const { username, email } = req.body || {};
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;

    const result = await User.deleteMany(filter);
    return res.json({ deletedCount: result.deletedCount || 0 });
  } catch (err) {
    console.error("Test user cleanup failed:", err);
    return res.status(500).json({ error: "Server error during test cleanup" });
  }
});

export default router;
