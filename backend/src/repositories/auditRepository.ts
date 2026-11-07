import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, users } from '../db/schema.ts';

export interface CreateAuditInput {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: string | null;
}

export class AuditRepository {
  async findAll() {
    const db = await getDb();
    return db.select({
      id: auditLogs.id,
      userId: auditLogs.userId,
      action: auditLogs.action,
      targetTable: auditLogs.targetTable,
      targetId: auditLogs.targetId,
      metadata: auditLogs.metadata,
      createdAt: auditLogs.createdAt,
      user: { id: users.id, name: users.name },
    }).from(auditLogs)
      .innerJoin(users, eq(auditLogs.userId, users.id))
      .orderBy(auditLogs.id);
  }

  async create(input: CreateAuditInput) {
    const db = await getDb();
    const rows = await db.insert(auditLogs).output().values(input);
    return rows[0];
  }
}