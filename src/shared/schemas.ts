import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const NoteCreateSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1),
  tags: z.array(z.string()).max(10).optional().default([]),
});

export const NoteUpdateSchema = NoteCreateSchema.partial();

export type Note = z.infer<typeof NoteCreateSchema> & {
  _id: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  email: string;
  name: string;
};

export type ApiError = { 
  error: { 
    code: string; 
    message: string; 
    fields?: Record<string, string> 
  } 
};