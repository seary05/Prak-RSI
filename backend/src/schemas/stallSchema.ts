import { z } from 'zod';
import { paginationSchema } from './commonSchema.ts';

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const stallQuerySchema = paginationSchema.extend({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50).optional(),
});

export const createStallSchema = z.object({
  name: z.string().trim().min(3).max(100),
  category: optionalText(50),
  location: optionalText(100),
  description: optionalText(1000),
}).strict();

export const updateStallSchema = createStallSchema.partial();

export type StallQuery = z.infer<typeof stallQuerySchema>;
export type CreateStallInput = z.infer<typeof createStallSchema>;
export type UpdateStallInput = z.infer<typeof updateStallSchema>;