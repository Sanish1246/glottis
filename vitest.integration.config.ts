import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/integration/**/*.test.{js,ts}"],
    testTimeout: 15000,
    hookTimeout: 10000,
    env: {
      NODE_ENV: "test",
    },
  },
});
