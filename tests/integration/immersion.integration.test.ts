/**
 * Integration tests: Immersion routes + DB (list media, recommendations)
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

describe("Immersion integration", () => {
  it("GET /immersion/italian/Beginner/1 returns 200 and array of media", async () => {
    const res = await supertest(app).get(
      "/immersion/italian/Beginner/1"
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((media: { status?: string }) => {
      expect(media.status).not.toBe("Pending");
    });
  });

  it("GET /immersion/recommendations without auth returns 401", async () => {
    const res = await supertest(app).get("/immersion/recommendations");
    expect(res.status).toBe(401);
  });

  it("GET /immersion/recommendations when authenticated returns 200 and array", async () => {
    const res = await authenticated().get("/immersion/recommendations");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /immersion/pending without auth returns 401", async () => {
    const res = await supertest(app).get("/immersion/pending");
    expect(res.status).toBe(401);
  });
});
