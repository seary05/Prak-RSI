import { z } from 'zod';

export const flagStatusSchema = z.object({
  status: z.enum(['pending', 'resolved', 'dismissed']),
}).strict();

export type FlagStatusInput = z.infer<typeof flagStatusSchema>;