import { z } from 'zod';

export const reviewQuerySchema = z.object({
  stallId: z.coerce.number().int().positive().optional(),
});

export const createReviewSchema = z.object({
  stallId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).nullable().optional(),
}).strict();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;