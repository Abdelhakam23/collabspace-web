import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthHeading, GoogleButton, OrDivider } from "@/components/auth/primitives";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell>
      <div className="space-y-6">
        <AuthHeading title="Sign In" subtitle="Welcome back, you've been missed!" />
        <GoogleButton />
        <OrDivider />
        <LoginForm />
        <p className="pt-3 text-center text-base text-[#718096]">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-primary-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
