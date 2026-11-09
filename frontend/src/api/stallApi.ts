import { api } from "./axiosClient";
import type { Stall, StallInput, StallListParams, StallListResult } from "../types/stall";

export const stallApi = {
  async list(params: StallListParams, signal?: AbortSignal): Promise<StallListResult> {
    // query param dikirim lewat `params`; nilai undefined otomatis tidak ikut terkirim
    const res = await api.get("/stalls", { params, signal });
    // ⚠️ SESUAIKAN: lokasi array dan pagination di response
    return {
      items: res.data.data,
      pagination: res.data.meta,
    };
  },

  async detail(id: number, signal?: AbortSignal): Promise<Stall> {
    const res = await api.get(`/stalls/${id}`, { signal }); // path param lewat template string
    return res.data.data; // ⚠️ SESUAIKAN
  },

  async create(input: StallInput): Promise<Stall> {
    const res = await api.post("/stalls", input); // request body
    return res.data.data; // ⚠️ SESUAIKAN
  },

  async update(id: number, input: Partial<StallInput>): Promise<Stall> {
    const res = await api.put(`/stalls/${id}`, input);
    return res.data.data; // ⚠️ SESUAIKAN
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/stalls/${id}`);
  },
};