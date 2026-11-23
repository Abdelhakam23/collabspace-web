"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { TextField } from "@/components/auth/text-field";
import { AuthHeading, FormError, PrimaryButton } from "@/components/auth/primitives";
import { LockIcon } from "@/components/auth/icons";
import { resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api-client";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const otp = params.get("otp") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    if (password !== confirmation) {
      setFieldErrors({ password_confirmation: ["Passwords do not match"] });
      return;
    }
    setPending(true);
    try {
      await resetPassword({ email, otp, password, password_confirmation: confirmation });
      router.push("/login");
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
    <form onSubmit={onSubmit} className="space-y-6">
      <AuthHeading title="Reset Password" subtitle="Choose a new password for your account" />
      <TextField
        id="password"
        label="New Password"
        type="password"
        placeholder="New Password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<LockIcon />}
        error={fieldErrors.password?.[0]}
      />
      <TextField
        id="password_confirmation"
        label="Confirm Password"
        type="password"
        placeholder="Confirm Password"
        autoComplete="new-password"
        required
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        icon={<LockIcon />}
        error={fieldErrors.password_confirmation?.[0]}
      />
      <FormError message={error} />
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Resetting..." : "Reset Password"}
      </PrimaryButton>
      <p className="pt-3 text-center text-base text-[#718096]">
        Back to{" "}
        <Link href="/login" className="font-semibold text-primary-500 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
