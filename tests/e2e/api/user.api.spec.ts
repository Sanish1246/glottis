/**
 * API tests for User progress, Role-based access
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";

test.describe("User progress", () => {
  test("GET /user_decks returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/user_decks`);
    expect(res.status()).toBe(401);
  });

  test("GET /user_decks returns 200 and array when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/user_decks`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("PUT /complete_lesson/:lang returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.put(`${BASE}/complete_lesson/italian`);
    expect(res.status()).toBe(401);
  });

  test("PUT /complete_lesson/:lang returns 200 when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.put(`${BASE}/complete_lesson/italian`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message", "Lesson completed");
  });

  test("PUT /like returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.put(`${BASE}/like`, {
      data: {
        title: "Some Media",
        description: "desc",
        language: "italian",
        level: "Beginner",
        img_path: "/img.jpg",
        genres: [],
      },
    });
    expect(res.status()).toBe(401);
  });

  test("PUT /removeLike returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.put(`${BASE}/removeLike`, {
      data: {
        title: "Some Media",
        description: "desc",
        language: "italian",
        level: "Beginner",
        img_path: "/img.jpg",
        genres: [],
      },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("Role-based access", () => {
  test("GET /users returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/users`);
    expect(res.status()).toBe(401);
  });

  test("GET /users returns 200 and array when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/users`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /users/:role returns 200 when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/users/student`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});
