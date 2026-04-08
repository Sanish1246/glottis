# Glottis

Language learning platform: React (Vite) frontend, Express API, MongoDB, Socket.io chat, flashcards, lessons, immersion content, and optional WhatsApp / Gemini integrations.

## Prerequisites

- [Node.js](https://nodejs.org/) (current LTS recommended; the stack uses ES modules and Vite 7)
- A [MongoDB](https://www.mongodb.com/) deployment and connection string
- Optional: [k6](https://k6.io/) for performance and load test scripts
- Optional: [Playwright](https://playwright.dev/) browsers (installed via `npx playwright install` the first time you run E2E tests)

## Quick start

```bash
git clone <repository-url>
cd glottis
npm install
```

Create a `.env` file in the project root (see [Environment variables](#environment-variables)).

Run the app in development (starts Vite on port **5173** and the API on **8000**):

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API / static server: [http://localhost:8000](http://localhost:8000)

The UI is configured to call `http://localhost:8000` for API requests and Socket.io.

### Run frontend or backend only

```bash
npm run dev:react   # Vite only
npm run dev:server  # nodemon + server.js only
```

### Production build

```bash
npm run build
npm run preview   # local preview of the Vite build
```

## Environment variables

Copy the following into a `.env` file at the repo root. Values are loaded via `dotenv` on the server.

### Required for core features

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string used by `db.js` |

Without this, the server will not connect to the database.

### Recommended for local development

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Secret for `express-session` (defaults to a dev value in code if unset; **set a strong value in production**) |
| `PORT` | API port (default **8000**) |

### AI and chatbot routes

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Generative AI key for `ChatbotRoute` and WhatsApp route |

### WhatsApp Cloud API (optional)

Used by `server.js` (webhook subscription), `routes/WhatsappRoute.js`, and related tooling. If these are missing, WhatsApp features will not work; the HTTP server can still run for the rest of the app.

| Variable | Purpose |
|----------|---------|
| `APP_ID` | Meta app ID for Graph API subscription updates |
| `APP_ACCESS_TOKEN` | Bearer token for Graph API (webhook registration) |
| `VERIFY_TOKEN` | Webhook verify token (default `my_verify_token` in code if unset) |
| `PHONE_NUMBER_ID` | WhatsApp phone number ID |
| `WHATSAPP_TOKEN` | API token for sending messages |
| `WHATSAPP_NUM` | Chatbot phone number (as used in the route) |

### Ngrok (optional, used on server start)

`server.js` starts ngrok to expose the local port for Meta webhooks. For the ngrok agent to work reliably, configure your [ngrok authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) in the environment (commonly `NGROK_AUTHTOKEN` as expected by the ngrok CLI/SDK). If ngrok or Meta registration fails, errors are logged but the server may still listen on `PORT`.

### Email (flashcard reminders job)

| Variable | Purpose |
|----------|---------|
| `EMAIL_USER` | SMTP / mail account user (from address) |
| `EMAIL_PASS` | Mail password or app password |

### API tests and protected routes in non-test mode

Several routes require header `x-test-key` to match `TEST_API_KEY` when `NODE_ENV` is **not** `test`. For manual or E2E calls against a running server with `NODE_ENV=development`, set `TEST_API_KEY` and send that value as `x-test-key` where your tests already do so.

| Variable | Purpose |
|----------|---------|
| `TEST_API_KEY` | Shared secret for `x-test-key` header (Playwright API specs, etc.) |

### E2E defaults (optional)

| Variable | Purpose |
|----------|---------|
| `ADMIN_USERNAME` | Used in flashcard API E2E (default `San` in test code) |
| `ADMIN_PASSWORD` | Used in flashcard API E2E (default `Sanish2003` in test code) |

### ML training script (optional)

| Variable | Purpose |
|----------|---------|
| `TRAIN_RANDOM_STATE` | Integer seed for `scripts/modelTraining.js` when set |

### Example `.env` skeleton

```env
# Core
MONGODB_URI=mongodb+srv://user:pass@cluster.example/dbname
PORT=8000
SESSION_SECRET=change-me-in-production

# Optional: Gemini
GEMINI_API_KEY=

# Optional: WhatsApp + Meta
APP_ID=
APP_ACCESS_TOKEN=
VERIFY_TOKEN=my_verify_token
PHONE_NUMBER_ID=
WHATSAPP_TOKEN=
WHATSAPP_NUM=

# Optional: ngrok
NGROK_AUTHTOKEN=

# Optional: email jobs
EMAIL_USER=
EMAIL_PASS=

# Optional: hitting API with NODE_ENV != test
TEST_API_KEY=

# Optional: CI
CI=
```

## Tests

### Unit tests (Vitest, jsdom)

```bash
npm test              # watch mode
npm run test:unit     # single run: tests/unit
npm run test:coverage # coverage for tests/unit
```

### Integration tests (Vitest, Node, Supertest)

Uses the real Express `app` and MongoDB. Ensure `MONGODB_URI` points at a database you can use for testing (tests create data such as users).

```bash
npm run test:integration
```

`vitest.integration.config.ts` sets `NODE_ENV=test`, which skips the `x-test-key` gate on protected routes.

### End-to-end (Playwright)

E2E specs live under `tests/e2e` and assume the API at **`http://localhost:8000`**. Start the backend first, then run:

```bash
npm run dev:server
# In another terminal:
npx playwright test
```

Install browsers once if needed:

```bash
npx playwright install
```

For suites that send `x-test-key`, set `TEST_API_KEY` in `.env` and match it in your environment (see Playwright/dotenv notes in `playwright.config.ts` if you enable `dotenv` there).

### Performance and load (k6)

Requires [k6](https://k6.io/docs/get-started/installation/) on your PATH. Defaults use `http://localhost:8000` unless you override `BASE_URL`.

```bash
npm run test:performance
npm run test:load
```

Override base URL for k6:

```bash
k6 run -e BASE_URL=http://localhost:8000 tests/performance/flashcard-review.js
```

### Lint

```bash
npm run lint
```

## Project scripts (summary)

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite + nodemon server together |
| `npm run build` | Production frontend build |
| `npm run preview` | Preview Vite build |
| `npm test` | Vitest (watch) |
| `npm run test:unit` | Unit tests once |
| `npm run test:integration` | Integration tests once |
| `npm run test:coverage` | Unit coverage |
| `npm run test:performance` | k6 performance script |
| `npm run test:load` | k6 load script |
| `npm run lint` | ESLint |
