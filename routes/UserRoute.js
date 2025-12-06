import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
    });

    req.session.user = {
      username: newUser.username,
      email: newUser.email,
    };

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

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      decks: user.decks,
    };

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        decks: user.decks,
      },
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

router.post("/remove_card/:language", async (req, res) => {
  try {
    const card = req.body;
    const language = req.params.language;

    let updatedUser;

    updatedUser = await User.findOneAndUpdate(
      {
        username: req.session.user.username,
        "decks.language": language,
      },
      {
        $pull: {
          "decks.$.items": {
            word: card.word,
            english: card.english,
          },
        },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Card removed successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        decks: updatedUser.decks,
      },
    });
  } catch (err) {
    console.error("Failed to remove card", err);
    res.status(500).json({ error: "Server error during removal" });
  }
});

router.post("/add_card/:language", async (req, res) => {
  try {
    const card = req.body;
    const language = req.params.language;

    let updatedUser;

    const userWithDeck = await User.findOne({
      username: req.session.user.username,
      "decks.language": language,
    });

    if (userWithDeck) {
      updatedUser = await User.findOneAndUpdate(
        {
          username: req.session.user.username,
          "decks.language": language,
        },
        {
          $push: {
            "decks.$.items": card,
          },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findOneAndUpdate(
        { username: req.session.user.username },
        {
          $push: {
            decks: {
              language: language,
              items: [card],
            },
          },
        },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Card added successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        decks: updatedUser.decks,
      },
    });
  } catch (err) {
    console.error("Failed to add card", err);
    res.status(500).json({ error: "Server error during addition" });
  }
});

router.get("/user_decks", async (req, res) => {
  const currentUserName = req.session.user.username;
  console.log(req.session.user.username);
  try {
    const user = await User.findOne({ username: currentUserName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.decks);
  } catch (err) {
    console.error("Failed to fetch user decks", err);
    res.status(500).json({ error: "Server error during fetch" });
  }
});

router.get("/user_decks/:language", async (req, res) => {
  const currentUserName = req.session.user.username;
  const language = req.params.language;

  try {
    const user = await User.findOne({ username: currentUserName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deck = user.decks.find((d) => d.language === language);

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found for this language" });
    }

    res.json(deck);
  } catch (err) {
    console.error("Failed to fetch user deck", err);
    res.status(500).json({ error: "Server error during fetch" });
  }
});

router.put("/user_decks/:language", async (req, res) => {
  const currentUserName = req.session.user.username;
  const card = req.body;
  const language = req.params.language;

  try {
    const user = await User.findOne({ username: currentUserName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deck = user.decks.find((d) => d.language === language);

    if (!deck) {
      return res
        .status(404)
        .json({ error: "Deck not found for this language" });
    }

    const updateCard = await User.findOneAndUpdate(
      {
        username: currentUserName,
        "decks.language": language,
        "decks.$.items": {
          word: card.word,
          english: card.english,
        },
      },
      { $set: card }
    );

    res.status(200).json({
      message: "Card updated successfully",
    });
  } catch (err) {
    console.error("Failed to update card", err);
    res.status(500).json({ error: "Server error during update" });
  }
});

router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.status(200).json({ message: "User logged out successfully" });
  });
});

export default router;
