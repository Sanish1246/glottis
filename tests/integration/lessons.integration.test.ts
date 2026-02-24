/**
 * Integration tests: Lesson routes + DB (list lessons, get content, submit)
 */
import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { connectToDb } from "../../db.js";
import { app } from "../../app.js";

let agent: ReturnType<typeof supertest.agent>;
const TEST_TEACHER = { username: "newTeacher", password: "newPassword" };

beforeAll(async () => {
  await connectToDb();
  agent = supertest.agent(app);
  const loginRes = await agent.post("/login").send(TEST_TEACHER);
  expect(loginRes.status).toBe(200);
});

function authenticated() {
  return agent;
}

describe("Lessons integration", () => {
  it("GET /lessons/italian returns 200 and array of lessons", async () => {
    const res = await supertest(app).get("/lessons/italian");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((lesson: { language?: string }) => {
      expect(lesson.language).toBe("italian");
    });
  });

  it("GET /lessons/content/italian/1 returns 200 and lesson structure", async () => {
    const res = await supertest(app).get("/lessons/content/italian/1");
    if (res.status === 404) return;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("language", "italian");
    expect(res.body).toHaveProperty("lessonNumber");
  });

  it("POST /lessons/submit without auth returns 401", async () => {
    const res = await supertest(app).post("/lessons/submit").send({
      language: "italian",
      level: "Beginner",
      title: "IntTestLesson",
    });
    expect(res.status).toBe(401);
  });

  const submittedLessonTitle = "intTestLesson_" + Date.now();

  it("POST /lessons/submit when authenticated returns 200", async () => {
    const minimalLesson = {
      language: "italian",
      level: "Beginner",
      title: submittedLessonTitle,
      objectives: ["test objective"],
    };
    const res = await authenticated()
      .post("/lessons/submit")
      .send(minimalLesson);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Lesson submitted successfully!");
  });

  it("cleanup: remove test lesson", async () => {
    const res = await supertest(app)
      .post("/lessons/test/cleanup/lesson")
      .send({ title: submittedLessonTitle, language: "italian" });
    expect([200, 404]).toContain(res.status);
  });
});
