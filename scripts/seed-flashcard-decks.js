import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

import FlashcardDeck from "../models/flashcardDeck.js";
import "../db.js";

function parseArgs(argv) {
  const args = {
    file: "lessons/A1FrenchVocab.json",
    upsert: false,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === "--file" && argv[i + 1]) {
      args.file = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--upsert") {
      args.upsert = true;
      continue;
    }

    if (token === "--dry-run") {
      args.dryRun = true;
      continue;
    }
  }

  return args;
}

async function readDecks(jsonPath) {
  const absolute = path.isAbsolute(jsonPath)
    ? jsonPath
    : path.resolve(process.cwd(), jsonPath);
  const raw = await fs.readFile(absolute, "utf8");
  const parsed = JSON.parse(raw);

  if (!parsed || !Array.isArray(parsed.cards)) {
    throw new Error(
      `Expected JSON shape { "cards": [...] } in ${absolute}, got: ${typeof parsed}`
    );
  }

  return { absolutePath: absolute, decks: parsed.cards };
}

function deckKey(deck) {
  return {
    level: deck.level,
    category: deck.category,
    language: deck.language,
    number: deck.number,
  };
}

async function main() {
  const { file, upsert, dryRun } = parseArgs(process.argv);
  const { absolutePath, decks } = await readDecks(file);

  console.log(
    `Seeding ${decks.length} flashcard decks from ${absolutePath} (upsert=${upsert}, dryRun=${dryRun})`
  );

  await mongoose.connection.asPromise();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (let idx = 0; idx < decks.length; idx += 1) {
    const deck = decks[idx];
    const key = deckKey(deck);
    const label = `${deck.level ?? "?"} / ${deck.language ?? "?"} / ${deck.category ?? "?"} #${deck.number ?? "?"}`;

    try {
      if (dryRun) {
        console.log(`[${idx + 1}/${decks.length}] DRY RUN: would seed ${label}`);
        skipped += 1;
        continue;
      }

      if (upsert) {
        const result = await FlashcardDeck.updateOne(
          key,
          { $set: deck },
          { upsert: true }
        );

        if (result.upsertedCount === 1) {
          created += 1;
          console.log(`[${idx + 1}/${decks.length}] created ${label}`);
        } else if (result.modifiedCount === 1) {
          updated += 1;
          console.log(`[${idx + 1}/${decks.length}] updated ${label}`);
        } else {
          skipped += 1;
          console.log(`[${idx + 1}/${decks.length}] unchanged ${label}`);
        }
      } else {
        await FlashcardDeck.create(deck);
        created += 1;
        console.log(`[${idx + 1}/${decks.length}] created ${label}`);
      }
    } catch (err) {
      console.error(
        `[${idx + 1}/${decks.length}] failed ${label}`,
        err?.message ?? err
      );
      throw err;
    }
  }

  console.log(
    `Done. created=${created}, updated=${updated}, skipped=${skipped}`
  );
}

main()
  .catch((err) => {
    console.error("Seeder failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // ignore disconnect errors
    }
  });

