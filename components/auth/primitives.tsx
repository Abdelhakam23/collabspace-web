import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { GoogleIcon } from "./icons";

export function PrimaryButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="h-10 w-full rounded-2xl bg-primary-500 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {children}
    </button>
  );
}

export function GoogleButton() {
  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled
        aria-describedby="google-unavailable"
        className="flex h-[50px] w-full cursor-not-allowed items-center justify-center gap-3 rounded-md border border-[#cbd5e0] bg-white text-base font-medium text-[#718096] opacity-70"
      >
        <GoogleIcon />
        Sign With Google
      </button>
      <p id="google-unavailable" className="text-center text-xs text-[#94a0b0]">
        Google sign-in isn&apos;t available yet
      </p>
    </div>
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

export function AuthHeading({
  title,
  subtitle,
  titleClassName = "text-[31px] font-semibold",
}: {
  title: string;
  subtitle: string;
  titleClassName?: string;
}) {
  return (
    <div className="space-y-[15px] text-center">
            <h1
        className={`${titleClassName} text-[#1f2937]`}
        style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as CSSProperties}
      >
        {title}
      </h1>
      <p
        className="text-base text-[#718096]"
        style={{ textBoxTrim: "trim-both", textBoxEdge: "cap alphabetic" } as CSSProperties}
      >
        {subtitle}
      </p>
    </div>
  );
}
