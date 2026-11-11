"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import AuthShell, { AuthAside } from "@/components/AuthShell";
import PasswordField, { PasswordMatchHint } from "@/components/PasswordField";
import Spinner from "@/components/Spinner";
import {
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "@/components/styles";
import { getErrorMessage } from "@/helper/getErrorMessage";
import {
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  getPasswordError,
} from "@/helper/validation";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonDisabled =
    !username.trim() || !email.trim() || !password || !confirmPassword;

  const onSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || buttonDisabled) return;

    const cleanUsername = username.trim();

    if (cleanUsername.length < MIN_USERNAME_LENGTH) {
      toast.error(
        `Username must contain at least ${MIN_USERNAME_LENGTH} characters.`
      );
      return;
    }

    const passwordError = getPasswordError(password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("/api/users/signup", {
        username: cleanUsername,
        email: email.trim().toLowerCase(),
        password,
      });

      // The account is created even if the verification email could not be sent
      if (response.data?.emailSent === false) {
        toast(response.data.message, { icon: "⚠️", duration: 6000 });
      } else {
        toast.success("Account created! Check your email to verify it.");
      }

      router.push("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Unable to create your account."));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      aside={
        <AuthAside
          title="Your Security Matters"
          description="Create your personal account with a secure password and enjoy a simple and reliable authentication experience."
          points={[
            "Secure account creation",
            "Email verification support",
            "Protected account access",
          ]}
        />
      }
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-950/60">
          Welcome Aboard
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-[#10132F] sm:text-5xl">
          Create Account
        </h1>

        <p className="mt-3 text-sm text-[#343A69]/75">
          Create your account and get started.
        </p>
      </div>

      <form onSubmit={onSignup} className="space-y-5">
        <div>
          <label htmlFor="username" className={labelClass}>
            Username
          </label>

          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            required
            minLength={MIN_USERNAME_LENGTH}
            maxLength={MAX_USERNAME_LENGTH}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className={labelClass}>
            Email Address
          </label>

          <input
            id="signup-email"
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
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
          autoComplete="new-password"
          hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your password"
          autoComplete="new-password"
        />

        <PasswordMatchHint
          password={password}
          confirmPassword={confirmPassword}
        />

        <button
          type="submit"
          disabled={buttonDisabled || loading}
          className={primaryButtonClass}
        >
          {loading ? (
            <>
              <Spinner />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#171A3B]">
        Already have an account?{" "}
        <Link href="/login" className={linkClass}>
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}
