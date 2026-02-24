/**
 * Integration tests: User routes + DB (user_decks, complete_lesson)
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

describe("User integration", () => {
  it("GET /user_decks without auth returns 401", async () => {
    const res = await supertest(app).get("/user_decks");
    expect(res.status).toBe(401);
  });

  it("GET /user_decks when authenticated returns 200 and array", async () => {
    const res = await authenticated().get("/user_decks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /complete_lesson/italian without auth returns 401", async () => {
    const res = await supertest(app).put("/complete_lesson/italian");
    expect(res.status).toBe(401);
  });

  it("PUT /complete_lesson/italian when authenticated returns 200", async () => {
    const res = await authenticated().put("/complete_lesson/italian");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Lesson completed");
    expect(res.body).toHaveProperty("newUser");
    expect(res.body.newUser).toHaveProperty("lessonsCompleted");
  });

  it("GET /users without auth returns 401", async () => {
    const res = await supertest(app).get("/users");
    expect(res.status).toBe(401);
  });

  it("GET /users when authenticated returns 200 and array", async () => {
    const res = await authenticated().get("/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
