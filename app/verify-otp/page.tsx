"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthHeading, FormError, PrimaryButton } from "@/components/auth/primitives";
import { verifyResetOtp } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = digits.join("");

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    event.preventDefault();
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? ""));
    inputs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await verifyResetOtp({ email, otp });
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AuthHeading title="Verification Code" subtitle={`Enter the 6-digit code sent to ${email || "your email"}`} />
      <div className="flex justify-center gap-3" onPaste={onPaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            value={digit}
            onChange={(e) => setDigit(index, e.target.value)}
            onKeyDown={(e) => onKeyDown(index, e)}
            className="h-14 w-12 rounded-[10px] border border-[#cbd5e0] bg-[#f9fafb] text-center text-xl font-medium text-secondary-900 outline-none transition-colors focus:border-primary-500"
          />
        ))}
      </div>
      <FormError message={error} />
      <PrimaryButton type="submit" disabled={pending || otp.length !== OTP_LENGTH}>
        {pending ? "Verifying..." : "Verify"}
      </PrimaryButton>
      <p className="pt-3 text-center text-base text-[#718096]">
        Wrong email?{" "}
        <Link href="/forgot-password" className="font-semibold text-primary-500 hover:underline">
          Go back
        </Link>
      </p>
    </form>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthShell>
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </AuthShell>
  );
}
