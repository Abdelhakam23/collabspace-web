import type { ButtonHTMLAttributes, ReactNode } from "react";
import { GoogleIcon } from "./icons";

export function PrimaryButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="h-12 w-full rounded-full bg-primary-500 text-base font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

export function GoogleButton() {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-secondary-200 bg-white text-base font-medium text-secondary-900 transition-colors hover:bg-secondary-50"
    >
      <GoogleIcon />
      Sign With Google
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4 text-sm text-secondary-400">
      <span className="h-px flex-1 bg-secondary-200" />
      OR
      <span className="h-px flex-1 bg-secondary-200" />
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
    <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary-600">
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
      <h1 className="text-2xl font-semibold text-secondary-900">{title}</h1>
      <p className="text-sm text-secondary-400">{subtitle}</p>
    </div>
  );
}

export type { ReactNode };
