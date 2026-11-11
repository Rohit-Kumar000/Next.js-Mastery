"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthShell, { AuthAside } from "@/components/AuthShell";
import PasswordField from "@/components/PasswordField";
import Spinner from "@/components/Spinner";
import {
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "@/components/styles";
import { getErrorMessage } from "@/helper/getErrorMessage";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonDisabled = !email.trim() || !password;

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || buttonDisabled) return;

    try {
      setLoading(true);

      await axios.post("/api/users/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Login successful!");

      router.replace("/profile");
      router.refresh();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to log in."));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      aside={
        <AuthAside
          title="Secure Login"
          description="Access your account securely and manage your personal information with confidence."
          points={[
            "Secure authentication",
            "Protected account access",
            "Personal profile dashboard",
          ]}
        />
      }
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-950/60">
          Welcome Back
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-[#10132F] sm:text-5xl">
          Log In
        </h1>

        <p className="mt-3 text-sm text-[#343A69]/75">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={onLogin} className="space-y-5">
        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email Address
          </label>

          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex justify-end px-3">
          <Link
            href="/forgotpassword"
            className="text-sm font-semibold text-indigo-950/80 underline decoration-indigo-600/40 underline-offset-4 transition hover:text-indigo-700"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={buttonDisabled || loading}
          className={primaryButtonClass}
        >
          {loading ? (
            <>
              <Spinner />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#171A3B]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={linkClass}>
          Sign Up
        </Link>
      </p>
    </AuthShell>
  );
}
