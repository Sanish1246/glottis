import express from "express";
import User from "../models/user.js";
import Immersion from "../models/immersion.js";
import { gradeToRevisionField } from "../utils/flashcardUtils.js";

const router = express.Router();

router.post("/remove_card/:language", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
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
      { new: true },
    );

    const updatedDeck = updatedUser.decks.find((d) => d.language === language);

    res.status(201).json({
      message: "Card removed successfully",
      user: updatedUser,
      newDeck: updatedDeck,
    });
  } catch (err) {
    console.error("Failed to remove card", err);
    res.status(500).json({ error: "Server error during removal" });
  }
});

router.post("/add_card/:language", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
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
        { new: true },
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
        { new: true },
      );
    }

    console.log(updatedUser);

    res.status(201).json({
      message: "Card added successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Failed to add card", err);
    res.status(500).json({ error: "Server error during addition" });
  }
});

router.get("/user_decks", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const currentUserName = req.session.user.username;
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
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const language = req.params.language;

  try {
    const currentUserName = req.session.user.username;
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
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const card = req.body.updatedCard;
  const grade = req.body.grade;
  const language = req.params.language;
  const targetGrade = gradeToRevisionField(grade);
  const incField = `revisionData.${targetGrade}`;
  const update = {
    $set: { "decks.$[deck].items.$[item]": card },
    $inc: { [incField]: 1 },
  };

  try {
    const { username } = req.session.user;
    const user = await User.findOneAndUpdate(
      {
        username,
        "decks.language": language,
        "decks.items.word": card.word,
        "decks.items.english": card.english,
      },
      update,
      {
        arrayFilters: [
          { "deck.language": language },
          { "item.word": card.word, "item.english": card.english },
        ],
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({ error: "Card not found" });
    }
    res.json({ message: "Card updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { username } = req.session.user;

    const users = await User.find({
      username: { $ne: username },
    });

    res.json(users);
  } catch (err) {
    console.error("Unable to get users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

router.get("/users/:role", async (req, res) => {
  const role = req.params.role;
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { username } = req.session.user;

    const users = await User.find({
      username: { $ne: username },
      role,
    });

    res.json(users);
  } catch (err) {
    console.error("Unable to get users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

router.get("/userSearch", async (req, res) => {
  const searchName = req.query.u;
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { username } = req.session.user;

    const users = await User.find({
      username: { $ne: username, $regex: searchName, $options: "i" },
    });

    res.json(users);
  } catch (err) {
    console.error("Unable to get users:", err);
    res.status(500).json({ error: "Server error while fetching users" });
  }
});

router.put("/like", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const newMedia = req.body;

  try {
    const { username } = req.session.user;
    const user = await User.findOneAndUpdate(
      {
        username,
      },
      { $push: { likes: newMedia } },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedMedia = await Immersion.findOneAndUpdate(
      { title: newMedia.title },
      { $inc: { likes: 1 } },
      { new: true },
    );

    if (!updatedMedia) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json({ message: "Item liked", newUser: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/removeLike", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const newMedia = req.body;

  try {
    const { username } = req.session.user;
    const user = await User.findOneAndUpdate(
      {
        username,
      },
      {
        $pull: {
          likes: {
            title: newMedia.title,
            description: newMedia.description,
            language: newMedia.language,
            genres: newMedia.genres,
            level: newMedia.level,
            img_path: newMedia.img_path,
          },
        },
      },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedMedia = await Immersion.findOneAndUpdate(
      { title: newMedia.title },
      { $inc: { likes: -1 } },
      { new: true },
    );

    if (!updatedMedia) {
      return res.status(404).json({ error: "Media not found" });
    }
    res.json({ message: "Like removed", newUser: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/complete_lesson/:lang", async (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const lang = req.params.lang;

  try {
    const { username } = req.session.user;
    const user = await User.findOneAndUpdate(
      {
        username,
      },
      { $inc: { [`lessonsCompleted.${lang}`]: 1 } },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Lesson completed", newUser: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
