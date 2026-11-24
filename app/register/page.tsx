import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthHeading, GoogleButton, OrDivider } from "@/components/auth/primitives";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell>
      <div className="space-y-6">
        <AuthHeading title="Sign Up" titleClassName="text-4xl font-bold" subtitle="Connect with every application!" />
        <GoogleButton />
        <OrDivider />
        <RegisterForm />
        <p className="pt-3 text-center text-base text-[#718096]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
