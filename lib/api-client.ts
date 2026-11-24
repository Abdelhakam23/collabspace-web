import "client-only";
import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  status?: number;
    fields?: Record<string, string[]>;

  constructor(message: string, status?: number, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export const TOKEN_STORAGE_KEY = "collabspace_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string, remember = true): void {
  if (remember) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LaravelErrorBody {
  message?: string;
  errors?: Record<string, string[]> | null;
}

function firstValidationMessage(body: LaravelErrorBody): string | undefined {
  if (!body.errors) return undefined;
  const first = Object.values(body.errors)[0];
  return Array.isArray(first) ? first[0] : undefined;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<LaravelErrorBody>) => {
    const status = error.response?.status;
    const body = error.response?.data;
    const message =
      firstValidationMessage(body ?? {}) ??
      body?.message ??
      "Something went wrong, please try again";

    const url = error.config?.url ?? "";
    const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/register");

    if (status === 401 && !isAuthRequest && typeof window !== "undefined") {
      clearStoredToken();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }

    return Promise.reject(new ApiError(message, status, body?.errors ?? undefined));
  },
);
