/**
 * API tests for - Real-time peer-to-peer chat
 * Chat routes do not check session in current implementation; tests validate 200 and structure.
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";
const ROOM = "api-test-room-" + Date.now();

test.describe("Real-time chat", () => {
  test("POST /chat/:room creates room and returns 200", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/chat/${ROOM}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("room", ROOM);
    expect(body).toHaveProperty("messages");
    expect(Array.isArray(body.messages)).toBe(true);
  });

  test("POST /chat/:room returns 409 when room already exists", async ({
    request,
  }) => {
    const room = "api-dup-room-" + Date.now();
    await request.post(`${BASE}/chat/${room}`);
    const res = await request.post(`${BASE}/chat/${room}`);
    expect(res.status()).toBe(409);
  });

  test("GET /chat/:room returns 200 and chat structure", async ({
    request,
  }) => {
    const room = "api-get-room-" + Date.now();
    await request.post(`${BASE}/chat/${room}`);
    const res = await request.get(`${BASE}/chat/${room}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("room");
    expect(body).toHaveProperty("messages");
    expect(Array.isArray(body.messages)).toBe(true);
  });

  test("POST /chat/message returns 200 and updates chat", async ({
    request,
  }) => {
    const room = "api-msg-room-" + Date.now();
    const createRes = await request.post(`${BASE}/chat/${room}`);
    expect(createRes.status()).toBe(200);
    const message = {
      room,
      sender: "user1",
      text: "Hello",
      timestamp: new Date().toISOString(),
    };
    const res = await request.post(`${BASE}/chat/message`, {
      data: message,
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("messages");
    expect(body.messages.length).toBeGreaterThanOrEqual(1);
  });

  test("POST /chat/message returns 409 when room not found", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/chat/message`, {
      data: {
        room: "nonexistent-room-xyz",
        sender: "user1",
        text: "Hi",
        timestamp: new Date().toISOString(),
      },
    });
    expect(res.status()).toBe(409);
  });
});
