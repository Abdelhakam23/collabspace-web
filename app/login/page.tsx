"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { TextField } from "@/components/auth/text-field";
import {
  AuthHeading,
  FormError,
  GoogleButton,
  OrDivider,
  PrimaryButton,
  RememberMe,
} from "@/components/auth/primitives";
import { EnvelopeIcon, LockIcon } from "@/components/auth/icons";
import { login } from "@/lib/api/auth";
import { ApiError, storeToken } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setPending(true);
    try {
      const res = await login({ email, password, remember });
      if (res.data?.token) storeToken(res.data.token, remember);
      router.push("/dashboard");
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
        <AuthHeading title="Sign In" subtitle="Welcome back, you've been missed!" />
        <GoogleButton />
        <OrDivider />
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
        <TextField
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon />}
          error={fieldErrors.password?.[0]}
        />
        <div className="flex items-center justify-between">
          <RememberMe checked={remember} onChange={setRemember} />
          {/* The design shows this link, but the file has no recovery screens, so
              there is no Figma source for where it leads. Rendered inert until a
              designed target exists - see docs/design-api-gaps.md. */}
          <span className="text-base text-primary-500" aria-disabled="true">
            Forget Password?
          </span>
        </div>
        <FormError message={error} />
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </PrimaryButton>
        <p className="pt-3 text-center text-base text-[#718096]">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-primary-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
