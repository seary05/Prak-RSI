import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users } from '../db/schema.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(reviews).where(eq(reviews.id, id));
    return rows[0];
  }

  async findAll(stallId?: number) {
    const db = await getDb();
    const query = db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: { id: users.id, name: users.name },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id));
    return (stallId === undefined ? query : query.where(eq(reviews.stallId, stallId))).orderBy(reviews.id);
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const rows = await db.insert(reviews).output().values({
      stallId: input.stallId,
      userId: input.userId,
      rating: input.rating,
      comment: input.comment ?? null,
      likeCount: 0,
    });
    if (!rows[0]) return undefined;
    const created = await this.findAll();
    return created.find((review) => review.id === rows[0].id);
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }
}