/**

 * Simulates 100 concurrent VUs; each logs in and performs an authenticated request.
 * Pass: login and authenticated request succeed for all (or threshold) of users.
 
 */

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
const LOGIN_USER = __ENV.LOGIN_USER || "newUser";
const LOGIN_PASSWORD = __ENV.LOGIN_PASSWORD || "newPassword";

//At least 100 users logged in at the same time
const CONCURRENT_USERS = parseInt(__ENV.CONCURRENT_USERS || "100", 10);

export const options = {
  // Ramp to 100 VUs, hold 45s, then ramp down 
  scenarios: {
    concurrent_logins: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "15s", target: CONCURRENT_USERS },
        { duration: "45s", target: CONCURRENT_USERS },
        { duration: "10s", target: 0 },
      ],
      gracefulRampDown: "5s",
      gracefulStop: "5s",
    },
  },
  thresholds: {
    // logins must succeed (100% or near)
    "checks{name:login_ok}": ["rate>0.99"],
    "checks{name:authenticated_ok}": ["rate>0.99"],
    "http_req_failed{name:login}": ["rate<0.01"],
    "http_req_failed{name:authenticated}": ["rate<0.01"],
  },
};

export default function () {
  // 1. Login (session cookie is stored automatically per VU)
  const loginRes = http.post(
    `${BASE_URL}/login`,
    JSON.stringify({
      username: LOGIN_USER,
      password: LOGIN_PASSWORD,
    }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "login" },
    }
  );

  const loginOk = check(loginRes, {
    "login status 200": (r) => r.status === 200,
  }, { name: "login_ok" });

  if (!loginOk) {
    sleep(1);
    return;
  }

  // 2. Authenticated request to verify session is active (NFR6: "logged in")
  const authRes = http.get(`${BASE_URL}/user_decks`, {
    tags: { name: "authenticated" },
  });

  check(authRes, {
    "authenticated status 200": (r) => r.status === 200,
  }, { name: "authenticated_ok" });

  sleep(0.5);
}
