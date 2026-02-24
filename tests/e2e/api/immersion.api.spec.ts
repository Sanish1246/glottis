/**
 * API tests for Immersion media, Recommendations, Media admin moderation 
 */
import { test, expect } from "@playwright/test";

const BASE = "http://localhost:8000";

test.describe("Immersion media", () => {
  test("GET /immersion/:lang/:level/:page returns 200 and list (approved only)", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/immersion/italian/Beginner/1`
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    body.forEach((media: { status?: string }) => {
      expect(media.status).not.toBe("Pending");
      expect(media.status).not.toBe("Rejected");
    });
  });

  test("GET /immersion/:lang/none/:page returns 200 for level none", async ({
    request,
  }) => {
    const res = await request.get(
      `${BASE}/immersion/italian/none/1`
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

test.describe("Recommendations", () => {
  test("GET /immersion/recommendations returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/immersion/recommendations`);
    expect(res.status()).toBe(401);
  });

  test("GET /immersion/recommendations returns 200 and array when authenticated", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/immersion/recommendations`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

test.describe("Admin content moderation (immersion)", () => {
  test("GET /immersion/pending returns 401 when not authenticated", async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/immersion/pending`);
    expect(res.status()).toBe(401);
  });

  test("GET /immersion/pending returns 401 when authenticated as non-admin", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const res = await request.get(`${BASE}/immersion/pending`);
    expect(res.status()).toBe(401);
  });

  test("PUT /immersion/approve/:id and reject/:id return 401 for non-admin", async ({
    request,
  }) => {
    await request.post(`${BASE}/login`, {
      data: { username: "newUser", password: "newPassword" },
    });
    const approveRes = await request.put(
      `${BASE}/immersion/approve/507f1f77bcf86cd799439011`
    );
    expect(approveRes.status()).toBe(401);
    const rejectRes = await request.put(
      `${BASE}/immersion/reject/507f1f77bcf86cd799439011`
    );
    expect(rejectRes.status()).toBe(401);
  });
});
