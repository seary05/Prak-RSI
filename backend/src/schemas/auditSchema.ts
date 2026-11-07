import { z } from 'zod';

export const createAuditLogSchema = z.object({
  action: z.string().trim().min(1).max(50),
  targetTable: z.string().trim().min(1).max(50),
  targetId: z.coerce.number().int().positive(),
  metadata: z.unknown().optional(),
}).strict();

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;