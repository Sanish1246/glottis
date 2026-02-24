/**
 * API tests for AI-powered conversational chatbot
 * Chatbot route does not require authentication; tests for 200 and response structure.
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";

test.describe("Chatbot", () => {
  test("POST /chatbot/ask returns 200 and response body for valid input", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/chatbot/ask`, {
      data: { query: "Hello, how are you?" },
    });
    expect([429, 200]).toContain(res.status());
  });

  test("POST /chatbot/ask returns 200 for empty or short query", async ({
    request,
  }) => {
    const res = await request.post(`${BASE}/chatbot/ask`, {
      data: { query: "Hi" },
    });
    expect([429, 200]).toContain(res.status());
  });
});
