
//  Performance test: NFR7 - Flashcard review response time

//  NFR7: The system shall load flashcard review interfaces within 2 seconds
//         under normal network conditions.
 
//   This script exercises the API endpoints used by the flashcard review UI:
//   - GET /flashcards/:lang/:level  — list decks for review selection
//   - GET /flashcards/:id           — load a specific deck for review
 
//   Run: k6 run tests/performance/flashcard-review-nfr7.js
//        BASE_URL=http://localhost:8000 k6 run tests/performance/flashcard-review-nfr7.js
 

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
const MAX_RESPONSE_TIME_MS = 2000; // NFR7: load within 2 seconds

export const options = {
  vus: 5,
  duration: "30s",
  thresholds: {
    // NFR7: 95% of flashcard review requests must complete within 2 seconds
    "http_req_duration{name:flashcard_review}": ["p(95)<2000"],
    "http_req_failed": ["rate<0.01"],
  },
};

export default function () {
  const lang = "italian";
  const level = "Beginner";

  // 1. Load deck list (review interface: choose deck)
  const listRes = http.get(`${BASE_URL}/flashcards/${lang}/${level}`, {
    tags: { name: "flashcard_review" },
  });

  check(listRes, {
    "deck list status 200": (r) => r.status === 200,
    "deck list within 2s (NFR7)": (r) => r.timings.duration <= MAX_RESPONSE_TIME_MS,
  });

  if (listRes.status !== 200) {
    sleep(1);
    return;
  }

  const decks = listRes.json();
  if (!Array.isArray(decks) || decks.length === 0) {
    sleep(1);
    return;
  }

  // 2. Load a specific deck (review interface: deck content)
  const deckId = decks[0]._id;
  const deckRes = http.get(`${BASE_URL}/flashcards/${deckId}`, {
    tags: { name: "flashcard_review" },
  });

  check(deckRes, {
    "deck by id status 200": (r) => r.status === 200,
    "deck by id within 2s (NFR7)": (r) => r.timings.duration <= MAX_RESPONSE_TIME_MS,
  });

  sleep(0.5);
}
