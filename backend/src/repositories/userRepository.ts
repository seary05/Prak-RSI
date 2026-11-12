import { and, eq, gt, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'owner' | 'customer';
}

export class UserRepository {
  async findByEmail(email: string) {
    const db = await getDb();
    const rows = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.email, email));
    return rows[0];
  }

  async setPasswordResetToken(email: string, tokenHash: string, expiresAt: Date) {
    const db = await getDb();
    const columns = await db.execute(sql`SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'USERS'
        AND COLUMN_NAME IN ('password_reset_token_hash', 'password_reset_expires_at')`);

    const names = new Set((columns as { recordset?: { COLUMN_NAME?: string }[] }).recordset?.map((row) => row.COLUMN_NAME) ?? []);
    if (!names.has('password_reset_token_hash') || !names.has('password_reset_expires_at')) {
      return;
    }

    return db.update(users)
      .set({ passwordResetTokenHash: tokenHash, passwordResetExpiresAt: expiresAt })
      .where(eq(users.email, email));
  }

  async consumePasswordReset(tokenHash: string, passwordHash: string) {
    const db = await getDb();
    const columns = await db.execute(sql`SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'USERS'
        AND COLUMN_NAME IN ('password_reset_token_hash', 'password_reset_expires_at')`);

    const names = new Set((columns as { recordset?: { COLUMN_NAME?: string }[] }).recordset?.map((row) => row.COLUMN_NAME) ?? []);
    if (!names.has('password_reset_token_hash') || !names.has('password_reset_expires_at')) {
      return [];
    }

    return db.update(users)
      .set({
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      })
      .output({ id: users.id })
      .where(and(
        eq(users.passwordResetTokenHash, tokenHash),
        gt(users.passwordResetExpiresAt, new Date()),
      ));
  }

  async findAll() {
    const db = await getDb();
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.id);
  }

  async create(input: CreateUserInput) {
    const db = await getDb();
    const rows = await db.insert(users).output({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    }).values(input);
    return rows[0];
  }
}