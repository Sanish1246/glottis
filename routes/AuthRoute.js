import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
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

export default router;
