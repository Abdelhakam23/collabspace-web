"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { TextField } from "@/components/auth/text-field";
import { AuthHeading, FormError, PrimaryButton } from "@/components/auth/primitives";
import { EnvelopeIcon } from "@/components/auth/icons";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

/* NOTE: the Figma file has no designed recovery screens (checked every
   page), so this flow reuses the sign in card and field specs. */
export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setPending(true);
    try {
      await forgotPassword({ email });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields) setFieldErrors(err.fields);
        if (!err.fields || Object.keys(err.fields).length === 0) setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="space-y-6">
        <AuthHeading title="Forget Password" subtitle="Enter your email and we'll send you a verification code" />
        <TextField
          id="email"
          label="Email"
          type="email"
          placeholder="Your Email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<EnvelopeIcon />}
          error={fieldErrors.email?.[0]}
        />
        <FormError message={error} />
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send Code"}
        </PrimaryButton>
        <p className="pt-3 text-center text-base text-[#718096]">
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-primary-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
