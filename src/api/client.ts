import axios from "axios";

// IMPORTANT: the backend mounts every route under "/api" (see app.use("/api", routes)
// in the backend's src/index.ts). The base URL MUST therefore include "/api" or
// every request (including /auth/login) 404s.
//
// Set VITE_API_PATH in an admin ".env" file to override, e.g.
//   VITE_API_PATH=http://localhost:8000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_PATH || "http://localhost:8000/api",
});

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queue: { resolve: (v?: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Don't try to refresh if the /auth/refresh call itself is what failed —
    // otherwise a genuinely expired/missing refresh token recurses back
    // into this same interceptor.
    if (originalRequest?.url?.includes("/auth/refresh")) {
      tokenStorage.clearTokens();
      window.dispatchEvent(new Event("auth:logout"));
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        // backend expects refreshToken explicitly in the body, not a cookie
        const { data } = await api.post("/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        tokenStorage.clearTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;