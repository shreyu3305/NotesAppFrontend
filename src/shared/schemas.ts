import { z } from "zod";

// Auth Schemas
export const SignUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

// Notes Schemas
export const NoteCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title must be less than 120 characters'),
  body: z.string().min(1, 'Body is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional().default([])
});

export const NoteUpdateSchema = NoteCreateSchema.partial();

// Type exports
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type NoteCreateInput = z.infer<typeof NoteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof NoteUpdateSchema>;

// API Response Types
export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface NotesListResponse {
  items: Note[];
  page: number;
  total: number;
  totalPages: number;
}