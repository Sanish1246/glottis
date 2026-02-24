
 //Auth routes + DB (register, login, logout)

import { beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { connectToDb } from "../../db.js";
import { app } from "../../app.js";

beforeAll(async () => {
  await connectToDb();
});

describe("Auth integration", () => {
  const testUser = {
    username: "intTestUser_" + Date.now(),
    email: "inttest_" + Date.now() + "@test.com",
    password: "password123",
    role: "student",
  };

  it("POST /register creates user in DB and returns 201", async () => {
    const res = await supertest(app).post("/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.username).toBe(testUser.username);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.role).toBe(testUser.role);
  });

  it("POST /login with created user returns 200 and sets session", async () => {
    const res = await supertest(app)
      .post("/login")
      .send({ username: testUser.username, password: testUser.password });
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(Array.isArray(cookies) ? cookies.length : 0).toBeGreaterThan(0);
  });

  it("POST /login with wrong password returns 401", async () => {
    const res = await supertest(app)
      .post("/login")
      .send({ username: testUser.username, password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid password");
  });

  it("DELETE /logout returns 200 when session exists", async () => {
    const agent = supertest.agent(app);
    const loginRes = await agent
      .post("/login")
      .send({ username: testUser.username, password: testUser.password });
    expect(loginRes.status).toBe(200);
    const res = await agent.delete("/logout");
    expect(res.status).toBe(200);
  });

  it("cleanup: remove test user", async () => {
    const res = await supertest(app)
      .post("/test/cleanup/user")
      .send({ username: testUser.username, email: testUser.email });
    expect([200, 404]).toContain(res.status);
  });
});
