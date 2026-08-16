import { env } from "@/config/env";
import axios, { type AxiosError, type AxiosRequestHeaders } from "axios";

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const token = cookieStore.get("accessToken")?.value;

      if (token) {
        const headers = config.headers as AxiosRequestHeaders | undefined;
        config.headers = {
          ...(headers ?? {}),
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        // Unauthorized requests are handled by callers like getMe(), so avoid noisy logs.
        break;
      case 403:
        console.error("Forbidden");
        break;
      case 404:
        console.error("Not Found");
        break;
      case 500:
        console.error("Server Error");
        break;
      default:
        break;
    }

    return Promise.reject(error);
  },
);
