"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Lock, Mail, User } from "lucide-react";
import { TextField } from "@/components/auth/text-field";
import { FormError, PrimaryButton, RememberMe } from "@/components/auth/primitives";
import { authError, register as registerAccount } from "@/lib/api/auth";
import { storeToken } from "@/lib/api-client";

export function RegisterForm() {
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
      const res = await registerAccount({ name, email, password, password_confirmation: password });
      if (res.data?.token) storeToken(res.data.token, remember);
      router.push("/dashboard");
    } catch (err) {
      const { message, fields } = authError(err);
      setFieldErrors(fields);
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <TextField
        id="name"
        label="Full Name"
        type="text"
        placeholder="Full Name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User size={20} strokeWidth={1.6} />}
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
        icon={<Mail size={20} strokeWidth={1.6} />}
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
        icon={<Lock size={20} strokeWidth={1.6} />}
        error={fieldErrors.password?.[0]}
      />
            <RememberMe checked={remember} onChange={setRemember} />
      <FormError message={error} />
      <PrimaryButton type="submit" disabled={pending}>
        {pending ? "Signing up..." : "Sign up"}
      </PrimaryButton>
    </form>
  );
}
