import { api } from "./axiosClient";
import type { Stall, StallInput, StallListParams, StallListResult } from "../types/stall";

export const stallApi = {
  async list(params: StallListParams, signal?: AbortSignal): Promise<StallListResult> {
  const res = await api.get("/stalls", { params, signal });
  const body = res.data;

  const items: Stall[] = body.data ?? body.items ?? body;

  const meta = body.meta ?? body.pagination ?? {};
  const limit = Number(meta.limit ?? params.limit ?? 10);
  const page = Number(meta.page ?? params.page ?? 1);
  const total = Number(meta.total ?? meta.totalItems ?? meta.count ?? items.length);
  const totalPages = Number(
      meta.totalPages ?? meta.total_pages ?? meta.pages ?? Math.max(1, Math.ceil(total / limit))
    );

    return { items, pagination: { page, limit, total, totalPages } };
  },

  async detail(id: number, signal?: AbortSignal): Promise<Stall> {
    const res = await api.get(`/stalls/${id}`, { signal }); // path param lewat template string
    return res.data.data;
  },

  async categories(signal?: AbortSignal): Promise<string[]> {
    const res = await api.get("/stalls/categories", { signal });
    return res.data.data;
  },

  async create(input: StallInput): Promise<Stall> {
    const res = await api.post("/stalls", input); // request body
    return res.data.data;
  },

  async update(id: number, input: Partial<StallInput>): Promise<Stall> {
    const res = await api.put(`/stalls/${id}`, input);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/stalls/${id}`);
  },
};