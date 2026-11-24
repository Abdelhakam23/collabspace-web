import { ApiError, apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AuthPayload } from "@/lib/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/register`, payload);
  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/login`, payload);
  return data;
}

export interface ForgotPasswordPayload {
  email: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/forgot-password`, payload);
  return data;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

export async function verifyResetOtp(payload: VerifyResetOtpPayload) {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/verify-reset-otp`, payload);
  return data;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/reset-password`, payload);
  return data;
}

export async function socialAuthRedirect() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/auth/social/google/redirect`);
  return data;
}

export interface SocialAuthCallbackPayload {
  token: string;
}

export async function socialAuthCallback(payload: SocialAuthCallbackPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/social/google/callback`, payload);
  return data;
}

export async function logout() {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/logout`, {});
  return data;
}

export function authError(err: unknown): { message: string | null; fields: Record<string, string[]> } {
  if (err instanceof ApiError) {
    const fields = err.fields ?? {};
    return { message: Object.keys(fields).length > 0 ? null : err.message, fields };
  }
  return { message: "Something went wrong. Please try again.", fields: {} };
}
