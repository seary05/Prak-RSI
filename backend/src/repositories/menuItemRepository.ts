import { and, count, eq, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface FindMenuItemsParams {
  page: number;
  limit: number;
  stallId?: number;
}

export interface CreateMenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export class MenuItemRepository {
  private async findJoinedById(id: number) {
    const db = await getDb();
    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stall: {
          id: stalls.id,
          name: stalls.name,
          category: stalls.category,
          location: stalls.location,
        },
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));
    return rows[0];
  }

  async findAll(params: FindMenuItemsParams) {
    const db = await getDb();
    const conditions: SQL[] = [];
    if (params.stallId !== undefined) conditions.push(eq(menuItems.stallId, params.stallId));
    const where = conditions.length ? and(...conditions) : undefined;
    const rows = await db
      .select({
        id: menuItems.id,
        stallId: menuItems.stallId,
        name: menuItems.name,
        price: menuItems.price,
        isAvailable: menuItems.isAvailable,
        stall: {
          id: stalls.id,
          name: stalls.name,
          category: stalls.category,
          location: stalls.location,
        },
      })
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(where)
      .orderBy(menuItems.id)
      .offset((params.page - 1) * params.limit)
      .fetch(params.limit);
    const totals = await db.select({ total: count() }).from(menuItems).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    return this.findJoinedById(id);
  }

  async create(input: CreateMenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable ?? true,
      });
    return rows[0] ? this.findJoinedById(rows[0].id) : undefined;
  }

  async update(id: number, input: Partial<CreateMenuItemInput>) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined ? { stallId: input.stallId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      })
      .where(eq(menuItems.id, id))
      .output();
    return rows[0] ? this.findJoinedById(id) : undefined;
  }

  async remove(id: number) {
    const beforeDelete = await this.findJoinedById(id);
    if (!beforeDelete) return undefined;
    const db = await getDb();
    await db.delete(menuItems).where(eq(menuItems.id, id));
    return beforeDelete;
  }

  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select({
      id: menuItems.id,
      stallId: menuItems.stallId,
      name: menuItems.name,
      price: menuItems.price,
      isAvailable: menuItems.isAvailable,
      stall: {
        id: stalls.id,
        name: stalls.name,
        category: stalls.category,
        location: stalls.location,
      },
    }).from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.stallId, stallId));
  }
}