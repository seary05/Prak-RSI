import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email('format email tidak valid').max(150);
const passwordSchema = z.string().min(8, 'password minimal 8 karakter').max(72, 'password maksimal 72 karakter');

export const registerSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: emailSchema,
  password: passwordSchema,
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'password wajib diisi'),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;