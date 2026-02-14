import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const createDeckSchema = z.object({
  word: z.string(),
  english: z.string(),
  category: z.string().min(1, {
    message: "This field cannot be empty!",
  }),
  language: z.string().min(1, {
    message: "This field cannot be empty!",
  }),
});

export const uploadMediaSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty!.",
  }),
  description: z.string().min(8, {
    message: "Description must be at least 8 characters long.",
  }),
  author: z.string().min(1, {
    message: "Author cannot be empty!.",
  }),
  language: z.string().min(1, {
    message: "Language cannot be empty!.",
  }),
  link: z.string().optional(),
  genres: z.array(z.string()).optional(),
  coverImage: z.instanceof(File).optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type CreateDeckSchema = z.infer<typeof createDeckSchema>;
export type UploadMediaSchema = z.infer<typeof uploadMediaSchema>;
