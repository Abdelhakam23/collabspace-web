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
import { EnvelopeIcon, LockIcon, PersonIcon } from "@/components/auth/icons";
import { register as registerAccount } from "@/lib/api/auth";
import { ApiError, storeToken } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      // The design has a single password field, so it doubles as confirmation.
      const res = await registerAccount({ name, email, password, password_confirmation: password });
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
    <AuthShell cardTop={142} cardBg="#FAFAFA">
      <form onSubmit={onSubmit} className="space-y-6">
        <AuthHeading title="Sign Up" titleClassName="text-4xl font-bold" subtitle="Connect with every application!" />
        <GoogleButton />
        <OrDivider />
        <TextField
          id="name"
          label="Full Name"
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<PersonIcon />}
          error={fieldErrors.name?.[0]}
        />
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
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon />}
          error={fieldErrors.password?.[0]}
        />
        {/* The register endpoint has no remember field; here it controls
            how long the session is kept on this device. */}
        <RememberMe checked={remember} onChange={setRemember} />
        <FormError message={error} />
        <PrimaryButton type="submit" disabled={pending}>
          {pending ? "Signing up..." : "Sign up"}
        </PrimaryButton>
        <p className="pt-3 text-center text-base text-[#718096]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
