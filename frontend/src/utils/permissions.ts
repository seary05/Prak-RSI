import type { User } from "../types/auth";
import type { Stall } from "../types/stall";

export const canCreateStall = (u: User | null) => u?.role === "admin" || u?.role === "owner";

export const canEditStall = (u: User | null, stall: Stall) =>
  u?.role === "admin" || (u?.role === "owner" && stall.ownerId === u.id);

export const canDeleteStall = (u: User | null) => u?.role === "admin";