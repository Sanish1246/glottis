import { test, expect } from "@playwright/test";

const BASE="http://localhost:8000";

test.describe("Login", () => {test("POST /login valid login request returns 200 ", async ({ request }) => {
  //API POST call for login
  let res;
  try {
    res = await request.post(`${BASE}/login`, {
      data: {
        username: "newUser",
        password: "newPassword",
      },
    });

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);

  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});

test("POST /login user not found returns 404", async ({ request }) => {
  //API POST call for login
  let res;
  try {
    res = await request.post(`${BASE}/login`, {
      data: {
        username: "newUser2",
        password: "newPassword",
      },
    });

    expect(res.status()).toBe(404);


  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});

test("POST /login invalid password login returns 401", async ({ request }) => {
  //API POST call for login
  let res;
  try {
    res = await request.post(`${BASE}/login`, {
      data: {
        username: "newUser",
        password: "newPassword1",
      },
    });

    expect(res.status()).toBe(401);

  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
});


test.describe("Register", () => {test("POST /register user registration returns 201", async ({ request }) => {
  //API POST call for registration
  let res;
  try {
    res = await request.post(`${BASE}/register`, {
      data: {
        username: "newUser1",
        email:"newEmail1@test.com",
        password: "newPassword1",
        role:"student"
      },
    });

    expect(res.status()).toBe(201);

    // cleanup created user so next browser/project can reuse the same username
  await request.post(`${BASE}/test/cleanup/user`, {
    data: { username: 'newUser1', email: 'newEmail1@test.com' },
    headers: process.env.TEST_API_KEY ? { 'x-test-key': process.env.TEST_API_KEY } : undefined,
  });


  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
});

test("DELETE /logout logout request returns 200", async ({ request }) => {
  //API POST call for logout
  let res;
  try {
    res = await request.post(`${BASE}/login`, {
      data: {
        username: "newUser",
        password: "newPassword",
      },
    });

    // Login
    expect(res.status()).toBe(200);

    res = await request.delete(`${BASE}/logout`);

    //Successful logout
    expect(res.status()).toBe(200);

  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});