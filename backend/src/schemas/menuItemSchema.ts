import { z } from 'zod';
import { paginationSchema } from './commonSchema.ts';

export const menuItemQuerySchema = paginationSchema.extend({
  stallId: z.coerce.number().int().positive().optional(),
});

export const createMenuItemSchema = z.object({
  stallId: z.number().int().positive(),
  name: z.string().trim().min(1).max(100),
  price: z.number().int().min(0),
  isAvailable: z.boolean().optional(),
}).strict();

export const updateMenuItemSchema = createMenuItemSchema.partial();
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type MenuItemQuery = z.infer<typeof menuItemQuerySchema>;