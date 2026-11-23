import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, AuthPayload } from "@/lib/types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/** POST /api/v1/auth/register — Register (A1.1) */
export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/register`, payload);
  return data;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

/** POST /api/v1/auth/login — Login (Admin) (A1.2) */
export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/login`, payload);
  return data;
}

export interface ForgotPasswordPayload {
  email: string;
}

/** POST /api/v1/auth/forgot-password — Forgot Password (A1.5) */
export async function forgotPassword(payload: ForgotPasswordPayload) {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/forgot-password`, payload);
  return data;
}

export interface VerifyResetOtpPayload {
  email: string;
  otp: string;
}

/** POST /api/v1/auth/verify-reset-otp — Verify Reset OTP (A1.6) */
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

/** POST /api/v1/auth/reset-password — Reset Password (A1.7) */
export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/reset-password`, payload);
  return data;
}

/** GET /api/v1/auth/social/google/redirect — Social Auth Redirect (Google) (A1.8) */
export async function socialAuthRedirect() {
  const { data } = await apiClient.get<ApiEnvelope<unknown>>(`/api/v1/auth/social/google/redirect`);
  return data;
}

export interface SocialAuthCallbackPayload {
  token: string;
}

/** POST /api/v1/auth/social/google/callback — Social Auth Callback (Google Mock/Token) (A1.9) */
export async function socialAuthCallback(payload: SocialAuthCallbackPayload) {
  const { data } = await apiClient.post<ApiEnvelope<AuthPayload>>(`/api/v1/auth/social/google/callback`, payload);
  return data;
}

/** POST /api/v1/auth/logout — Logout (A1.10) */
export async function logout() {
  const { data } = await apiClient.post<ApiEnvelope<null>>(`/api/v1/auth/logout`, {});
  return data;
}
