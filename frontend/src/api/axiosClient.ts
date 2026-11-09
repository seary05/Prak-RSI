import axios from "axios";

export const TOKEN_KEY = "token";
export const SESSION_EXPIRED_KEY = "sessionExpired";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Setiap request: tempel JWT kalau ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Setiap response: tangani 401 secara terpusat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    // 401 pada login = kredensial salah; 401 pada /auth/me saat startup ditangani AuthProvider
    const skip = ["/auth/login", "/auth/me"].some((p) => url.includes(p));

    if (status === 401 && !skip) {
      if (localStorage.getItem(TOKEN_KEY)) {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, "1");
      }
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);