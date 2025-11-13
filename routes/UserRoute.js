import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if username exists
    const usernameExisting = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const emailExisting = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already taken" });
    }

    // Hashing the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // compare password with hash stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, score: user.score },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
