import type { ButtonHTMLAttributes } from "react";
import { GoogleIcon } from "./icons";

/** Primary action: 40px tall, 16px radius, primary blue. */
export function PrimaryButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="h-10 w-full rounded-2xl bg-primary-500 text-base font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * "Sign With Google" from the design: 50px tall, 6px radius, white fill,
 * #CBD5E0 border. Links to the backend's Google OAuth redirect endpoint.
 */
export function GoogleButton() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return (
    <a
      href={`${base}/api/v1/auth/social/google/redirect`}
      className="flex h-[50px] w-full items-center justify-center gap-3 rounded-md border border-[#cbd5e0] bg-white text-base font-medium text-[#8390a4] transition-colors hover:bg-[#f9fafb]"
    >
      <GoogleIcon />
      Sign With Google
    </a>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4 text-sm text-[#8390a4]">
      <span className="h-px flex-1 bg-[#cbd5e0]" />
      OR
      <span className="h-px flex-1 bg-[#cbd5e0]" />
    </div>
  );
}

export function RememberMe({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base text-[#718096]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-primary-500"
      />
      Remember Me
    </label>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-[#fdecea] px-4 py-2 text-sm text-[#af2622]" role="alert">
      {message}
    </p>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-1 text-center">
      <h1 className="text-[31px] font-semibold leading-tight text-secondary-900">{title}</h1>
      <p className="text-sm text-[#94a0b0]">{subtitle}</p>
    </div>
  );
}
