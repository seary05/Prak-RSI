import { z } from 'zod';

export const createLikeSchema = z.object({
  reviewId: z.number().int().positive(),
}).strict();

export const reviewIdParamSchema = z.object({
  reviewId: z.coerce.number().int().positive(),
});

export type CreateLikeInput = z.infer<typeof createLikeSchema>;
export type ReviewIdParam = z.infer<typeof reviewIdParamSchema>;