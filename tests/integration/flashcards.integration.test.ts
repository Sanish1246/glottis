/**
 * Integration tests: Flashcard routes + DB (submit deck, list, admin pending)
 */
import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { connectToDb } from "../../db.js";
import { app } from "../../app.js";

let agent: ReturnType<typeof supertest.agent>;
const TEST_USER = { username: "newUser", password: "newPassword" };

beforeAll(async () => {
  await connectToDb();
  agent = supertest.agent(app);
  const loginRes = await agent.post("/login").send(TEST_USER);
  expect(loginRes.status).toBe(200);
});

function authenticated() {
  return agent;
}

describe("Flashcards integration", () => {
  const deckPayload = {
    category: "intTestDeck_" + Date.now(),
    language: "italian",
    level: "Beginner",
    items: [{ word: "ciao", english: "hello" }],
    noOfCards: 1,
    likes: 0,
  };

  it("POST /flashcards/submit without auth returns 401", async () => {
    const res = await supertest(app).post("/flashcards/submit").send(deckPayload);
    expect(res.status).toBe(401);
  });

  it("POST /flashcards/submit when authenticated returns 200 and creates Pending deck", async () => {
    const res = await authenticated()
      .post("/flashcards/submit")
      .send(deckPayload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Deck submitted successfully!");
    expect(res.body).toHaveProperty("created");
    expect(res.body.created).toHaveProperty("status", "Pending");
    expect(res.body.created).toHaveProperty("author", TEST_USER.username);
    expect(res.body.created.category).toBe(deckPayload.category);
  });

  it("GET /flashcards/italian/Beginner returns 200 and array (excludes Pending)", async () => {
    const res = await supertest(app).get("/flashcards/italian/Beginner");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((deck: { status?: string }) => {
      expect(deck.status).not.toBe("Pending");
    });
  });

  it("GET /flashcards/pending without auth returns 401", async () => {
    const res = await supertest(app).get("/flashcards/pending");
    expect(res.status).toBe(401);
  });

  it("cleanup: remove test deck", async () => {
    const res = await supertest(app)
      .post("/flashcards/test/cleanup/deck")
      .send({ category: deckPayload.category });
    expect(res.status).toBe(200);
  });
});
