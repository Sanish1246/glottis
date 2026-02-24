
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";

test.describe("Flashcard deck creation", () => {
  test("POST /flashcards/submit returns 200 and creates deck when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.post(`${BASE}/flashcards/submit`, {
      data: {
        category: "apiTestDeck",
        language: "italian",
        level: "Beginner",
        items: [{ word: "test", english: "test" }],
        noOfCards: 1,
        likes: 0,
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message", "Deck submitted successfully!");
    expect(body).toHaveProperty("created");
    expect(body.created).toHaveProperty("status", "Pending");
    // cleanup
    await request.post(`${BASE}/flashcards/test/cleanup/deck`, {
      data: { category: "apiTestDeck" },
      headers: process.env.TEST_API_KEY
        ? { "x-test-key": process.env.TEST_API_KEY }
        : undefined,
    });
  });

  test("POST /flashcards/submit returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/flashcards/submit`, {
      data: {
        category: "apiTestDeck",
        language: "italian",
        level: "Beginner",
        items: [{ word: "test", english: "test" }],
        noOfCards: 1,
        likes: 0,
      },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  test("POST /flashcards/submit returns 400 or 500 for invalid body", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.post(`${BASE}/flashcards/submit`, {
      data: { category: "x", language: "italian" },
      // missing required level, items, etc. - server may 200 or 500 depending on validation
    });
    expect([400, 500]).toContain(res.status());
  });
});

test.describe("Flashcard review data", () => {
  test("GET /flashcards/:lang/:level returns 200 and array (pending excluded)", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/flashcards/italian/Beginner`
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    body.forEach((deck: { status?: string }) => {
      expect(deck.status).not.toBe("Pending");
    });
  });

  test("GET /flashcards/customDecks/:lang/:level returns 200 and array", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/flashcards/customDecks/italian/Beginner`
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /flashcards/:id returns 200 and deck structure for valid id", async ({
    request,
  }) => {
    const listRes = await request.get(
      `${BASE}/flashcards/italian/A1`
    );
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    if (list.length === 0) {
      test.skip();
      return;
    }
    const id = list[0]._id;
    const res = await request.get(`${BASE}/flashcards/${id}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("language");
    expect(body).toHaveProperty("level");
  });

  test("GET /flashcards/:id returns 404 for invalid id", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/flashcards/507f1f77bcf86cd799439011`
    );
    expect(res.status()).toBe(404);
  });
});

test.describe("Admin content moderation (flashcards)", () => {
  test("GET /flashcards/pending returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/flashcards/pending`);
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  test("GET /flashcards/pending returns 401 when authenticated as non-admin", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/flashcards/pending`);
    expect(res.status()).toBe(401);
  });

  test("GET /flashcards/pending returns 200 and list when admin", async ({
    request,
  }) => {
    const adminUser = process.env.ADMIN_USERNAME || "San";
    const adminPass = process.env.ADMIN_PASSWORD || "Sanish2003";
    const loginRes = await request.post(`${BASE}/login`, {
      data: { username: adminUser, password: adminPass },
    });
    if (loginRes.status() !== 200) {
      test.skip();
      return;
    }
    const res = await request.get(`${BASE}/flashcards/pending`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("PUT /flashcards/approve/:id and reject/:id return 401 for non-admin", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const approveRes = await request.put(
      `${BASE}/flashcards/approve/507f1f77bcf86cd799439011`
    );
    expect(approveRes.status()).toBe(401);
    const rejectRes = await request.put(
      `${BASE}/flashcards/reject/507f1f77bcf86cd799439011`
    );
    expect(rejectRes.status()).toBe(401);
  });
});
