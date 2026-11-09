import { isAxiosError } from "axios";

export interface ApiError {
  status: number | null;
  message: string;
  fieldErrors: Record<string, string>;
  isNetworkError: boolean;
}

export function toApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    if (!err.response) {
      return {
        status: null,
        message: "Tidak dapat terhubung ke server. Periksa koneksi atau pastikan backend berjalan.",
        fieldErrors: {},
        isNetworkError: true,
      };
    }
    const data = err.response.data;
    const fieldErrors: Record<string, string> = {};
    if (Array.isArray(data?.errors)) {
      for (const e of data.errors) {
        if (e?.field) fieldErrors[e.field] = e.message;
      }
    }
    return {
      status: err.response.status,
      message: data?.message ?? "Terjadi kesalahan pada server",
      fieldErrors,
      isNetworkError: false,
    };
  }
  return {
    status: null,
    message: "Terjadi kesalahan tak terduga",
    fieldErrors: {},
    isNetworkError: false,
  };
}