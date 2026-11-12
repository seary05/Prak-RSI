import { api } from "./axiosClient";
import type { LoginInput, RegisterInput, User } from "../types/auth";

export const authApi = {
  async register(input: RegisterInput): Promise<void> {
    await api.post("/auth/register", input);
  },

  async login(input: LoginInput): Promise<{ token: string }> {
    const res = await api.post("/auth/login", input);
    // ⚠️ SESUAIKAN: lokasi token di response. Contoh: res.data.data.token atau res.data.token
    return { token: res.data.data.token };
  },

  async forgotPassword(email: string): Promise<{ resetUrl?: string }> {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data.data ?? {};
  },

  async resetPassword(input: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', input);
  },

  async me(): Promise<User> {
    const res = await api.get("/auth/me");
    // ⚠️ SESUAIKAN: lokasi objek user. Contoh: res.data.data atau res.data.data.user
    return res.data.data;
  },
};