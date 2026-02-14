import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  createDeckSchema,
  uploadMediaSchema,
} from "../../src/lib/schemas";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const valid = {
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
    };
    expect(registerSchema.parse(valid)).toEqual(valid);
  });

  it("rejects username shorter than 2 characters", () => {
    expect(() =>
      registerSchema.parse({
        username: "a",
        email: "john@example.com",
        password: "password123",
      }),
    ).toThrow();
  });

  it("rejects invalid email format", () => {
    expect(() =>
      registerSchema.parse({
        username: "johndoe",
        email: "not-an-email",
        password: "password123",
      }),
    ).toThrow();
  });

  it("rejects password shorter than 8 characters", () => {
    expect(() =>
      registerSchema.parse({
        username: "johndoe",
        email: "john@example.com",
        password: "short",
      }),
    ).toThrow();
  });

  it("accepts username with exactly 2 characters", () => {
    const valid = {
      username: "ab",
      email: "a@b.com",
      password: "password1",
    };
    expect(registerSchema.parse(valid)).toEqual(valid);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const valid = {
      username: "johndoe",
      password: "password123",
    };
    expect(loginSchema.parse(valid)).toEqual(valid);
  });

  it("rejects username shorter than 2 characters", () => {
    expect(() =>
      loginSchema.parse({
        username: "a",
        password: "password123",
      }),
    ).toThrow();
  });

  it("rejects password shorter than 8 characters", () => {
    expect(() =>
      loginSchema.parse({
        username: "johndoe",
        password: "short",
      }),
    ).toThrow();
  });
});

describe("createDeckSchema", () => {
  it("accepts valid deck entry", () => {
    const valid = {
      word: "hello",
      english: "hola",
      category: "greetings",
      language: "spanish",
    };
    expect(createDeckSchema.parse(valid)).toEqual(valid);
  });

  it("rejects empty category", () => {
    expect(() =>
      createDeckSchema.parse({
        word: "hello",
        english: "hola",
        category: "",
        language: "spanish",
      }),
    ).toThrow();
  });

  it("rejects empty language", () => {
    expect(() =>
      createDeckSchema.parse({
        word: "hello",
        english: "hola",
        category: "greetings",
        language: "",
      }),
    ).toThrow();
  });

  it("accepts empty word and english (schema allows; addToDeck validates)", () => {
    const data = {
      word: "",
      english: "",
      category: "x",
      language: "y",
    };
    expect(createDeckSchema.parse(data)).toEqual(data);
  });
});

describe("uploadMediaSchema", () => {
  it("accepts valid media data", () => {
    const valid = {
      title: "My Book",
      description: "A wonderful read with many pages.",
      author: "Jane Doe",
      language: "english",
    };
    expect(uploadMediaSchema.parse(valid)).toEqual(valid);
  });

  it("rejects empty title", () => {
    expect(() =>
      uploadMediaSchema.parse({
        title: "",
        description: "At least 8 chars.",
        author: "Author",
        language: "en",
      }),
    ).toThrow();
  });

  it("rejects description shorter than 8 characters", () => {
    expect(() =>
      uploadMediaSchema.parse({
        title: "Title",
        description: "short",
        author: "Author",
        language: "en",
      }),
    ).toThrow();
  });

  it("rejects empty author", () => {
    expect(() =>
      uploadMediaSchema.parse({
        title: "Title",
        description: "Description here.",
        author: "",
        language: "en",
      }),
    ).toThrow();
  });

  it("accepts optional link and genres", () => {
    const valid = {
      title: "Title",
      description: "Description here.",
      author: "Author",
      language: "en",
      link: "https://example.com",
      genres: ["Comedy", "Drama"],
    };
    expect(uploadMediaSchema.parse(valid)).toEqual(valid);
  });
});
