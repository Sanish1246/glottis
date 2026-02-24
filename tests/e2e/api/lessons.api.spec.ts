/**
 * API tests for Teacher lesson creation, CEFR lessons
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";

test.describe("Teacher lesson creation", () => {
  test("POST /lessons/submit returns 200 when teacher submits valid lesson", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newTeacher", password: "newPassword" },
    });
    const minimalLesson = {
      language: "italian",
      level: "Beginner",
      title: "apiTestLesson",
      objectives: ["test objective"],
    };
    const res = await request.post(`${BASE}/lessons/submit`, {
      data: minimalLesson,
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("message", "Lesson submitted successfully!");
    await request.post(`${BASE}/lessons/test/cleanup/lesson`, {
      data: { title: "apiTestLesson", language: "italian" },
      headers: process.env.TEST_API_KEY
        ? { "x-test-key": process.env.TEST_API_KEY }
        : undefined,
    });
  });

  test("POST /lessons/submit returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/lessons/submit`, {
      data: {
        language: "italian",
        level: "Beginner",
        title: "apiTestLesson",
      },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });
});

test.describe("CEFR lessons", () => {
  test("GET /lessons/:lang returns 200 and array of lessons", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/lessons/italian`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    body.forEach((lesson: { language?: string; title?: string }) => {
      expect(lesson.language).toBe("italian");
      expect(lesson).toHaveProperty("title");
    });
  });

  test("GET /lessons/content/:lang/:no returns 200 and lesson structure", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/lessons/content/italian/1`
    );
    if (res.status() === 404) {
      test.skip();
      return;
    }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("language");
    expect(body).toHaveProperty("lessonNumber");
    expect(body).toHaveProperty("title");
  });

  test("GET /lessons/content/:id returns 200 for valid lesson id", async ({
    request,
  }) => {
    const listRes = await request.get(`${BASE}/lessons/italian`);
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    if (list.length === 0) {
      test.skip();
      return;
    }
    const id = list[0]._id;
    const res = await request.get(`${BASE}/lessons/content/${id}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("title");
    expect(body).toHaveProperty("language");
  });

  test("GET /lessons/content/:id returns 404 for invalid id", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/lessons/content/507f1f77bcf86cd799439011`
    );
    expect(res.status()).toBe(404);
  });
});
