import { env } from "@/config/env";
import axios, { type AxiosError, type AxiosRequestHeaders } from "axios";
import type { IApiResponse } from "@/types/api";

export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData && config.headers) {
      // Let the browser/runtime set multipart/form-data with the proper boundary.
      delete config.headers["Content-Type"];
    }

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
    return Promise.reject(error);
  },
);

/**
 * Unwraps an `IApiResponse<T>` Axios call, throwing an Error with the backend
 * message when `success` is false.
 */
export const unwrapApiResponse = async <T>(
  request: Promise<{ data: IApiResponse<T> }>,
  fallbackMessage = "Request failed",
): Promise<T> => {
  const { data } = await request;
  if (!data.success) {
    throw new Error(data.message || fallbackMessage);
  }
  return data.data;
};
